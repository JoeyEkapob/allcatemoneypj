const express = require('express')
const cors = require("cors")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const dotenv = require('dotenv')

const Userscontrollers = require('./controllers/Userscontrollers')
const corsoption = require('./controllers/config/corsoption')
const authMiddleware = require('./authMiddleware')
//console.log(corsoption)
const app = express()
dotenv.config()

app.use(cors(corsoption))
app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))


const PORT = process.env.PORT || 5000;


app.get('/api', (req, res) => {
    res.json({ message: 'Hello from backend' });
  });

app.post('/register',(req,res)=>Userscontrollers.register(req,res))
app.post('/login',(req,res)=>Userscontrollers.login(req,res))

app.use(authMiddleware);
app.get('/me', (req, res) => {
  return res.json({ user: req.user });
});

app.get('/user/profile',Userscontrollers.getuserprofile)
app.patch('/user/editprofile/:id', Userscontrollers.editprofile)
app.post('/logout', Userscontrollers.logout);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
