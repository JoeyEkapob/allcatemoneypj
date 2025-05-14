const express = require('express')
const cors = require("cors")
const morgan = require("morgan")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv')


const Userscontrollers = require('./controllers/Userscontrollers')
const corsoption = require('./controllers/config/corsoption')




const app = express()
dotenv.config()

app.use(express.json())
app.use(cors(corsoption))
app.use(morgan("dev"))




app.get('/api', (req, res) => {
    res.json({ message: 'Hello from backend' });
  });
app.post('/users/register',(req,res)=>Userscontrollers.register(req,res))
app.post('/user/login',(req,res)=>Userscontrollers.login(req,res))
app.get('/userprofile',(req,res)=>Userscontrollers.getuserprofile(res,res))

app.listen(5000, () => console.log('Server running on port 5000'));
