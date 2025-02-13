import { useContext } from "react"
// import AuthContext from "./contexts/authContext";
import AuthContext from "../../AuthContext/authContext";
import { Link } from "react-router-dom";
import Logout from "../logout/Logout";



const Navbar = () => {

    const { isAuthenticated } = useContext(AuthContext)

    return (
        <nav className="bg-gray-800 p-4 flex justify-between items-center shadow-lg">
            <ul className="flex space-x-6">
                <li><Link to="/" className="text-white text-lg font-semibold hover:text-orange-500 transition-colors">Начало</Link></li>
                <li><Link to="/catalog" className="text-white text-lg font-semibold hover:text-orange-500 transition-colors">Каталог</Link></li>
                {!isAuthenticated && (
                    <>
                        <li><Link to="/register" className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors">Регистрация</Link></li>
                        <li><Link to="/login" className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors">Вход</Link></li>
                    </>
                )}
                {isAuthenticated && (
                    <>
                        <li><Link to="/create" className="text-white text-lg font-semibold hover:text-orange-500 transition-colors">Създай</Link></li>
                        <li><Link to="/users" className="text-white text-lg font-semibold hover:text-orange-500 transition-colors">Потребители</Link></li>
                        <li><Logout /></li>
                    </>
                )}
            </ul>
        </nav>

    )
};

export default Navbar

