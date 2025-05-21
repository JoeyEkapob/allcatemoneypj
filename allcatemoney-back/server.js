const express = require('express')
const cors = require("cors")
const morgan = require("morgan")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv')

const Userscontrollers = require('./controllers/Userscontrollers')
const corsoption = require('./controllers/config/corsoption')
const authMiddleware = require('./authMiddleware')

const app = express()
dotenv.config()

app.use(express.json())
app.use(cors(corsoption))
app.use(morgan("dev"))


const PORT = process.env.PORT || 5000;


app.get('/api', (req, res) => {
    res.json({ message: 'Hello from backend' });
  });

app.post('/register',(req,res)=>Userscontrollers.register(req,res))
app.post('/login',(req,res)=>Userscontrollers.login(req,res))
app.get('/user/profile',authMiddleware,Userscontrollers.getuserprofile)
app.patch('/user/editprofile/:id', authMiddleware, Userscontrollers.editprofile)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
