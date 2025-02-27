import { useContext, useEffect, useState } from "react"
// import AuthContext from "./contexts/authContext";
import AuthContext from "../../AuthContext/authContext";
import { Link } from "react-router-dom";
import Logout from "../user-actions/logout/Logout";
import { useCart } from "../../context/CartContext";
import { getAuth } from "firebase/auth";
import ThemeToggle from "../themetoggle/ThemeToggle";

const Navbar = () => {

    const { isAuthenticated } = useContext(AuthContext)
    const { cart, removeFromCart } = useCart()
    const totalPrice = cart.reduce((sum, product) => sum + product.price, 0)
    const auth = getAuth()
    // console.log(auth.currentUser.email);

    const [showNavBar, setShowNavBar] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)


    useEffect(() => {
        const handleScroll = () => {

            if (window.scrollY > 50) {
                setShowNavBar(true)
            }

            setLastScrollY(window.scrollY)
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    return (
        <nav className={`flex sm:items-center sm:flex-col md:flex-col lg:flex-row bg-gray-800 bg-opacity-90 p-4 fixed top-0 w-full transition-opacity duration-300 z-50 ${showNavBar ? "opacity-100" : "opacity-0"
            }`}
        >
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

                        {/* 🛒 Иконка за количка с hover меню */}
                        <li className="relative group">
                            <Link to="/checkout" className="relative">
                                <span className="text-lg">🛒</span>
                                {cart.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                        {cart.length}
                                    </span>
                                )}
                            </Link>

                            {/* 📌 Hover Меню с продуктите */}
                            <div className="absolute top-10 right-0 w-64 bg-white shadow-lg p-4 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                {cart.length === 0 ? (
                                    <p className="text-center text-gray-500">Количката е празна</p>
                                ) : (
                                    <>
                                        <ul>
                                            {cart.map((product) => (
                                                <li key={product.id} className="flex items-center justify-between py-2 border-b">
                                                    <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-contain" />
                                                    <p className="text-sm">{product.name}</p>
                                                    <p className="text-sm font-semibold">{product.price} лв.</p>
                                                    <button onClick={() => removeFromCart(product.id)} className="text-red-500 text-lg font-bold">✖</button>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* 🔹 Крайна сума */}
                                        <div className="mt-2 text-right font-semibold text-lg">
                                            Общо: {totalPrice.toFixed(2)} лв.
                                        </div>

                                        {/* 🛒 Бутон "Поръчай" */}
                                        <Link to="/checkout" className="block mt-3 bg-green-500 text-white text-center py-2 rounded-md hover:bg-green-600 transition">
                                            Поръчай
                                        </Link>
                                    </>
                                )}
                            </div>
                        </li>
                    </>
                )}
            </ul>
            {isAuthenticated && (
                <div className="flex items-center space-x-4 lg:ml-auto list-none">
                    <li className="text-amber-50 font-bold">Email: {auth.currentUser.email}</li>

                    <ThemeToggle />
                    <li><Logout /></li>
                </div>
            )}


        </nav>

    )
};

export default Navbar

