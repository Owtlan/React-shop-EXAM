import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase-config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email || !password) {
      setError("Моля, попълнете всички полета.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("loggedInEmail", email);

      setSuccessMessage("Успешен вход! Добре дошли.");
      setTimeout(() => {
        setSuccessMessage(""); 
      }, 5000);

      navigate("/", { state: { email } }); 
    } catch (error) {
      console.error("Грешка при влизането: ", error.message);
      switch (error.code) {
        case "auth/invalid-email":
          setError("Невалиден формат на имейла.");
          break;
        case "auth/user-disabled":
          setError("Този акаунт е деактивиран.");
          break;
        case "auth/user-not-found":
          setError("Няма потребител с този имейл.");
          break;
        case "auth/wrong-password":
          setError("Грешна парола.");
          break;
        default:
          setError("Неуспешен вход. Опитайте отново.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-t from-[#e6e9f0] to-[#eef1f5]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 animate__animated animate__pulse">
        <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">Вход</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}


        {successMessage && (
          <p className="text-green-500 text-center mb-4 animate__animated animate__fadeIn">
            {successMessage}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700">Имейл</label>
            <input
              type="email"
              className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Въведете имейл"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700">Парола</label>
            <input
              type="password"
              className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Въведете парола"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          >
            Вход
          </button>
        </form>
      </div>
    </div>
  );
}