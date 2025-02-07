import { signOut } from "firebase/auth";
import { auth } from "../../firebase-config";
import { useNavigate } from "react-router-dom";


export default function Logout() {
    const navigate = useNavigate();

    const handleLogout = async () => {

        try {
            await signOut(auth)
            console.log("Успешно излизане!");
            navigate('/')
        } catch (error) {
            console.error("Грешка при излизане: ", error.message)
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
        >
            Изход
        </button>
    )


}
