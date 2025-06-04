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
     
        try{
            const userresult = await pool.query(
                `SELECT * FROM users WHERE username = $1`,[username]
            )
          if(userresult.rowCount === 0) {

                return res.status(401).json({  field: 'username', message:'อีเมลล์ไม่ถูกต้อง'})
            }
            const user = userresult.rows[0]
       
            const ismatch = await bcrypt.compare(password,user.password_hash)

            if(!ismatch){
                return res.status(401).json({  field: 'password',  message: "รหัสผ่านไม่ถูกต้อง" });
            }

            const token = jwt.sign(
                {
                    user_id:user.id,
                    username:user.username,
                    email:user.email,
                    fullname:user.full_name
                },
                process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN}
            )

            res.cookie('token',token,{
                httpOnly:true,
                secure:false,
                sameSite:'Lax',
                maxAge:86400000,
            })

            // return console.log(req.headers['user-agent'] || 'unknown') 

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
       console.log(userId) 
      return 
        try{
                const user = await pool.query(
                `SELECT a.id,a.username,p.first_name,p.last_name,a.email ,p.avatar_url , p.bio , c.role_name
                , p.address_line , p.subdistrict , p.district,p.province,p.postal_code,p.country,p.phone_number
                ,a.custom_id , p.facebook_address , p.line_address , p.github_address
                FROM users a
                INNER JOIN user_roles b ON a.id = b.user_id
                INNER JOIN roles c ON b.role_id = c.id
                INNER JOIN user_profiles p ON a.id = p.user_id
                WHERE a.id = $1`,[userId]
            )

            if(user.rowCount === 0) {
        
            return res.status(200).json({  success: false, field: 'username', message:'ไม่พบผู้ใช้งาน'})
        
        }
            const userresult = user.rows[0] 
            //console.log(userresult)
            return res.status(200).json({ success: true, data: userresult });
        }catch(e){
            console.error(e);
            res.status(500).json({ error: 'Internal server error' });
        }
       
          
        

   
        
    },
    editprofile:async (req,res) =>{

        const userId = req.params.id;
        
        const { first_name,last_name,email,phone_number,bio,facebook_address,line_address,github_address} = req.body;
        
        const client = await pool.connect();

        try{
            await client.query('BEGIN')

            const userupdate = await client.query(`UPDATE users SET 
            full_name = $1 , email = $2 WHERE id = $3 RETURNING id ,email, full_name ,username`,
                [`${first_name} ${last_name}`, email , userId ]
            )

            const profileupdate = await client.query(`UPDATE user_profiles SET 
                first_name = $1,
                last_name = $2,
                phone_number = $3,
                bio = $4,
                facebook_address = $5,
                line_address = $6,
                github_address = $7,
                updated_at = NOW()
                WHERE user_id = $8
                RETURNING *`,
            [first_name,last_name, phone_number, bio, facebook_address, line_address,github_address, userId ])

                
            if (userupdate.rowCount === 0 || profileupdate.rowCount === 0) {
              return   res.status(200).json({ success: false, message: 'ไม่พบผู้ใช้งาน' });
            }

            
            await client.query('COMMIT');

           return  res.status(200).json({   success: true, user: userupdate.rows[0],profile: profileupdate.rows[0],});

            
        }catch(e){
            await client.query('ROLLBACK');
            console.error(e);
            return res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดระหว่างอัปเดตข้อมูล' });
        }finally {
            client.release();
        }
    },
    logout : async (req,res)=>{

    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
    });

    return res.status(200).json({ message: 'ออกจากระบบเรียบร้อยแล้ว' });
    },

}