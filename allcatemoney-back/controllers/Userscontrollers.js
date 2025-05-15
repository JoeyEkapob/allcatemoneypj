const pool = require('./config/db')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports ={ 
    register : async (req,res)=>{
        const { username , password , fullname , phone , email, custom_id} = req.body

       
        try{
            const hash  = await bcrypt.hash(password,10)
           
            
            const userresult = await pool.query(
                `INSERT INTO users (username , password_hash, full_name , phone , custom_id , email , created_at , updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW() ) RETURNING id`,
                [username , hash, fullname , phone, custom_id , email]
            )
        
            
            const userid = userresult.rows[0].id
     
            await pool.query(`INSERT INTO user_roles (user_id,role_id) VALUES ( $1,$2)`,[userid,1])
            
            await pool.query(`INSERT INTO user_activity_logs (user_id,action,details,created_at ) VALUES ($1 ,$2,$3, NOW())`,[userid , 'register','User registered via API'])
        
            
            res.status(201).json({message: 'User registered successfully',userid : userid})

        }catch(e){
            res.status(500).json({ error: e.message});
        }
    },
    login: async (req,res)=>{
        const { username, password } = req.body;
       // console.log(username,password)
        try{
            const userresult = await pool.query(
                `SELECT * FROM users WHERE username = $1`,[username]
            )
          if(userresult.rowCount === 0) {

                return res.status(200).json({  success: false, field: 'username', message:'ไม่พบผู้ใช้งาน'})
            }
            const user = userresult.rows[0]
            const ismatch = await bcrypt.compare(password,user.password_hash)

            if(!ismatch){
                return res.status(200).json({ success: false, field: 'password',  message: "รหัสผ่านไม่ถูกต้อง" });
            }

            const token = jwt.sign(
                {
                    user_id:user.id,
                    username:user.username,
                    email:user.email
                },
                process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN}
            )

            /* return console.log(req.headers['user-agent'] || 'unknown') */

            await pool.query(
                `INSERT INTO user_sessions (user_id,session_token,ip_address,user_agent,expires_at,created_at)
                VALUES ($1,$2,$3,$4,NOW() + interval '1 day',NOW())`,
                [user.id , token , req.ip || 'unknown', req.headers['user-agent'] || 'unknown']
            )

            await pool.query(`INSERT INTO user_activity_logs ( user_id, action , details ,created_at ) VALUES ($1,$2,$3,NOW())`,
                [user.id,'login','User logged in successfully']
            )

            return  res.json({
                success:true,
                message:'Login successfull',
                token,
                user:{
                    id:user.id,
                    username:user.username,
                    fullname:user.full_name,
                    email:user.email,
                }
            }) 
        }catch(e){
            console.error(e);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    getuserprofile: async (req,res) =>{
      const userId = req.user.user_id
   
        const user = await pool.query(
                `SELECT * FROM users WHERE id = $1`,[userId]
            )
        if(user.rowCount === 0) {

                return res.status(200).json({  success: false, field: 'username', message:'ไม่พบผู้ใช้งาน'})
            }


        const userresult = user.rows[0] 


      //  console.log(userresult)
        return userresult
   
        
    }
    
}