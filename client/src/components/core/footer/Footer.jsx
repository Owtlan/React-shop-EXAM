import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaTiktok } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-black text-white py-8 text-center mt-auto">
            <div className="container mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">

                    <div className="text-2xl font-bold">
                        <Link to="/" className="hover:text-gray-400 duration-300">
                            FashionStore
                        </Link>
                    </div>

                    <nav className="flex flex-wrap justify-center gap-6 text-sm">
                        <Link to="/" className="hover:text-gray-400 duration-300">Начало</Link>
                        <Link to="/" className="hover:text-gray-400 duration-300">Продукти</Link>
                        <Link to="/about" className="hover:text-gray-400 duration-300">За нас</Link>
                        <Link to="/contact" className="hover:text-gray-400 duration-300">Контакт</Link>
                    </nav>

                    <div className="flex gap-4">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-lg hover:text-gray-400 duration-300">
                            <FaFacebookF />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-lg hover:text-gray-400 duration-300">
                            <FaInstagram />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-lg hover:text-gray-400 duration-300">
                            <FaTwitter />
                        </a>
                        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-lg hover:text-gray-400 duration-300">
                            <FaTiktok />
                        </a>
                    </div>
                </div>

                <div className="text-center text-sm text-gray-400 mt-6">
                    © {new Date().getFullYear()} FashionStore. Всички права запазени.
                </div>
            </div>
        </footer>
    )
}