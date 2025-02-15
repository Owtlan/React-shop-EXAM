import { useContext } from "react"
// import AuthContext from "./contexts/authContext";
import AuthContext from "../../AuthContext/authContext";
import { Link } from "react-router-dom";
import Logout from "../logout/Logout";
import { useCart } from "../../context/CartContext";


const Navbar = () => {

    const { isAuthenticated } = useContext(AuthContext)
    const { cart, removeFromCart } = useCart()


    const totalPrice = cart.reduce((sum, product) => sum + product.price, 0)

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

                    {/* 🛒 Иконка за количка с hover меню */}
                    <li className="relative group">
                        <Link to="/cart" className="relative">
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

                    <li><Logout /></li>
                </>
            )}
        </ul>
    </nav>

    )
};

export default Navbar

