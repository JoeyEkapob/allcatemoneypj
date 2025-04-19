import { useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { jwtDecode  , JwtPayload } from "jwt-decode";



const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp && decoded.exp > currentTime) {
          navigate("/home");
        }
      } catch {
        console.error("Invalid token");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  const validate = () => {
    const newErrors = { username: "", password: "" };
    if (!username.trim()) newErrors.username = "กรุณากรอก ID";
    if (!password.trim()) newErrors.password = "กรุณากรอกรหัสผ่าน";
    setErrors(newErrors);
    return !newErrors.username && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch("http://localhost:5000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/home");
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="font-kanit text-2xl font-semibold text-center text-gray-800 mb-6">
          เข้าสู่ระบบ
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label className="block text-gray-700">ชื่อผู้ใช้</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-500 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.username && <span className="text-red-500 text-sm">{errors.username}</span>}
          </div>

          <div className="relative mt-4">
          
            <label className="block text-gray-700">รหัสผ่าน</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-500 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
          
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeIcon className="w-6 h-6" /> : <EyeSlashIcon className="w-6 h-6" />}
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
          ยังไม่มีบัญชีใช่ไหม? {" "}
          <a href="#" className="text-blue-500">
            สมัครสมาชิก
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;



