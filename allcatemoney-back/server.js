const express = require('express')
const cors = require("cors")
const morgan = require("morgan")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv')
const Userscontrollers = require('./controllers/Userscontrollers')
dotenv.config()

const allowedOrigins = [
    'http://localhost:5000',           // สำหรับ dev เครื่องตัวเอง
  ];



const app = express()




app.use(express.json())
app.use(morgan("dev"))

app.use(cors({
    origin: function (origin, callback) {
      /*   console.log(allowedOrigins.includes(origin))
        console.log(!origin) */
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  }));


app.get('/api', (req, res) => {
    res.json({ message: 'Hello from backend' });
  });

app.post('/users/register',(req,res)=>Userscontrollers.register(req,res))
app.post('/user/login',(req,res)=>Userscontrollers.login(req,res))

app.listen(5000, () => console.log('Server running on port 5000'));
