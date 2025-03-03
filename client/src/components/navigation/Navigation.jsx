import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../AuthContext/authContext";
import Logout from "../user-actions/logout/Logout";
import { useCart } from "../../context/CartContext";
import { getAuth } from "firebase/auth";
import ThemeToggle from "../themetoggle/ThemeToggle";

const Navbar = () => {
    const { isAuthenticated } = useContext(AuthContext);
    const { cart, removeFromCart } = useCart();
    const totalPrice = cart.reduce((sum, product) => sum + product.price, 0);
    const auth = getAuth();

    const [showNavBar, setShowNavBar] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Следим дали е мобилен изглед

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768); // Актуализираме дали е мобилен изглед
            if (window.innerWidth >= 768) {
                setIsMenuOpen(false); // Ако минем 768px, затваряме менюто
            }
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <nav className={`flex flex-col lg:flex-row bg-gray-800 bg-opacity-90 p-4 fixed top-0 w-full transition-opacity duration-300 z-50 ${showNavBar ? "opacity-100" : "opacity-0"}`}>
            {/* 🍔 Бутон за мобилно меню (само ако е под 768px) */}
            {isMobile && (
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

            {/* 📌 Навигационно меню */}
            <ul className={`md:flex ${isMobile ? (isMenuOpen ? "flex flex-col" : "hidden") : "flex"} space-x-6 text-white`}>
                <li><Link to="/" className="text-base sm:text-lg font-semibold hover:text-orange-500 transition-colors">Начало</Link></li>
                <li><Link to="/catalog" className="text-base sm:text-lg font-semibold hover:text-orange-500 transition-colors">Каталог</Link></li>

                {isAuthenticated && (
                    <>
                        <li><Link to="/create" className="text-base sm:text-lg font-semibold hover:text-orange-500 transition-colors">Създай</Link></li>
                        <li><Link to="/users" className="text-base sm:text-lg font-semibold hover:text-orange-500 transition-colors">Потребители</Link></li>
                    </>
                )}
            </ul>

            {isAuthenticated && (
                <div className="flex items-center space-x-4 lg:ml-auto list-none">
                    <li className="text-amber-50 font-bold text-xs sm:text-base">Email: {auth.currentUser?.email}</li>
                    <ThemeToggle />
                    <li><Logout /></li>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
