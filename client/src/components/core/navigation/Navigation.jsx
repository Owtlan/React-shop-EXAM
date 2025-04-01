import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../../AuthContext/authContext";
import Logout from "../../user-actions/logout/Logout";
import { useCart } from "../../../context/CartContext";
import { getAuth } from "firebase/auth";
import ThemeToggle from "../../themetoggle/ThemeToggle";

const Navbar = () => {
    const { isAuthenticated } = useContext(AuthContext);
    const { cart, removeFromCart } = useCart();
    const auth = getAuth();


    const [showNavBar, setShowNavBar] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.classList.add('menu-open');
        } else {
            document.body.classList.remove('menu-open');
        }
    }, [isMenuOpen]);

    return (
        <nav
            className={`navbar flex flex-row justify-between lg:flex-row bg-gray-800 bg-opacity-90 p-4 fixed top-0 w-full transition-opacity duration-300 z-50 gap-2 ${showNavBar ? "opacity-100" : "opacity-0"} ${isMenuOpen ? "navbar-open" : ""}`}
        >            {isMobile && (
            <div>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="relative group md:hidden focus:outline-none">
                    <div className="relative flex overflow-hidden items-center justify-center rounded-full w-[50px] h-[50px] transform transition-all bg-slate-700 ring-0 ring-gray-300 hover:ring-8 group-focus:ring-4 ring-opacity-30 duration-200 shadow-md">
                        <div className="flex flex-col justify-between w-[20px] h-[20px] transform transition-all duration-300 origin-center overflow-hidden">
                            <span className={`bg-white h-[2px] w-7 transform transition-all duration-300 origin-left ${isMenuOpen ? "translate-x-10" : ""}`}></span>
                            <span className={`bg-white h-[2px] w-7 rounded transform transition-all duration-300 delay-75 ${isMenuOpen ? "translate-x-10" : ""}`}></span>
                            <span className={`bg-white h-[2px] w-7 transform transition-all duration-300 origin-left delay-150 ${isMenuOpen ? "translate-x-10" : ""}`}></span>

                            <div className={`absolute items-center justify-between transform transition-all duration-500 top-2.5 flex w-0 group-focus:w-12 ${isMenuOpen ? "translate-x-0 w-12" : "-translate-x-10"}`}>
                                <span className={`absolute bg-white h-[2px] w-5 transform transition-all duration-500 delay-300 ${isMenuOpen ? "rotate-45" : "rotate-0"}`}></span>
                                <span className={`absolute bg-white h-[2px] w-5 transform transition-all duration-500 delay-300 ${isMenuOpen ? "-rotate-45" : "rotate-0"}`}></span>
                            </div>
                        </div>
                    </div>
                </button>
            </div>
        )}

            <ul className={`md:flex ${isMobile ? (isMenuOpen ? "flex flex-col" : "hidden") : "flex"} space-x-6 text-white`}>
                <li><Link to="/" className="text-xs sm:text-lg font-semibold hover:text-orange-500 transition-colors">Начало</Link></li>
                <li><Link to="/catalog" className="text-xs sm:text-lg font-semibold hover:text-orange-500 transition-colors">Каталог</Link></li>

                {isAuthenticated && (
                    <>
                        <li><Link to="/create" className="text-xs sm:text-lg font-semibold hover:text-orange-500 transition-colors">Създай</Link></li>
                        <li><Link to="/users" className="text-xs sm:text-lg font-semibold hover:text-orange-500 transition-colors">Чат с Потребители</Link></li>

                        <li className="relative group">
                            <Link to="/checkout" className="relative">
                                <span className="text-lg">🛒</span>
                                {cart.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                        {cart.reduce((sum, product) => sum + product.quantity, 0)}
                                    </span>
                                )}
                            </Link>

                            <div className="text-black absolute top-10 right-0 w-64 bg-white shadow-lg p-4 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                {cart.length === 0 ? (
                                    <p className="text-center text-gray-500">Количката е празна</p>
                                ) : (
                                    <>
                                        <ul>
                                            {cart.map((product) => (
                                                <li key={product.id} className="flex items-center justify-between py-2 border-b">
                                                    <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-contain pr-2" />
                                                    <p className="text-sm">{product.name} (x{product.quantity})</p>
                                                    <p className="text-sm font-semibold">{product.totalPrice.toFixed(2)} лв.</p>
                                                    <button onClick={() => removeFromCart(product.id)} className="text-red-500 text-lg font-bold">✖</button>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="mt-2 text-right font-semibold text-lg">
                                            Общо: {cart.reduce((sum, product) => sum + product.totalPrice, 0).toFixed(2)} лв.
                                        </div>

                                        <Link to="/checkout" className="block mt-3 bg-green-500 text-white text-center py-2 rounded-md hover:bg-green-600 transition">
                                            Поръчай
                                        </Link>
                                    </>
                                )}
                            </div>
                        </li>

                    </>
                )}
                {!isAuthenticated && (
                    <>
                        <li><Link to="/register" className="md:bg-orange-500 text-white md:py-2 md:px-4 rounded-md hover:bg-orange-600 transition-colors">Регистрация</Link></li>
                        <li className="mt-2 md:mt-0"><Link to="/login" className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors">Вход</Link></li>
                    </>
                )}
            </ul>

            {isAuthenticated && (
                <div className="flex flex-col lg:flex-row items-center space-x-4 lg:ml-auto list-none">
                    <li className="text-amber-50 font-bold text-xs sm:text-base">Email: {auth.currentUser?.email}</li>
                    <div className="flex gap-2.5 items-center">
                        <ThemeToggle />
                        <li><Logout /></li>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

