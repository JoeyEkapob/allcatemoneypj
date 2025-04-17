import { useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import config from "../../config";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const InputField = ({ label, type, value, onChange, error }) => (
  <div>
    <label className=" block text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-500 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    {error && <span className="text-red-500 text-sm">{error}</span>}
  </div>
);

const PasswordField = ({ label, type, value, onChange, error }) => (
  <div>
    <label className="block text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-500 rounded-lg  mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    {error && <span className="text-red-500 text-sm">{error}</span>}
  </div>
);

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  useEffect(()=>{
    const token = localStorage.getItem("token")
    if(token){
      try{
      
        const decoded = jwtDecode<JwtPayload>(token);

        const currentTime = Date.now() / 1000
        if (decoded.exp > currentTime) {
          navigate("/home");
        }
      }catch(e){
        console.log("Invalid token")
      }
    }else{
      navigate("/")
    }
  },[])


  const validate = () => {
      const newErrors = { username: "", password: "" };
  
      if (!username.trim()) newErrors.username = "กรุณากรอก ID";
      if (!password.trim()) newErrors.password = "กรุณากรอกรหัสผ่าน";
  
      setErrors(newErrors);

      return !newErrors.username && !newErrors.password;
    };
  const handleSubmit = async (e) => {
    e.preventDefault();
   
    /* console.log(validate()) */
  if (validate()) {
       try{
        //console.log("เข้าสู่ระบบสำเร็จ!");
        const result =  await fetch("http://localhost:5000/user/login",{
          method:"POST",
          headers:config.headers,
          body:JSON.stringify({ username , password })

        })
        const data = await result.json();

        localStorage.setItem("token",data.token)
        navigate("/home");

       }catch(e){
        console.error(e)
       }   
      } 
  };

  return (
   
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="font-kanit text-2xl font-semibold text-center text-gray-800 mb-6 ">
          เข้าสู่ระบบ
        </h2>
    
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="อีเมล"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={errors.username}
          />

          <div className="mt-4 relative">
            <PasswordField
              label="รหัสผ่าน"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />

            <button
              type="button"
              className="absolute right-3 top-9 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeIcon className="w-8 h-6" />
              ) : (
                <EyeSlashIcon className="w-8 h-6" />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            เข้าสู่ระบบ
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <a href="#" className="text-blue-500">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;


