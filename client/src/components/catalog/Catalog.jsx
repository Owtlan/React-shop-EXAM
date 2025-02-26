import { useEffect, useState } from "react";
import { auth, db } from "../../firebase-config";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import LikeButton from "../like/LikeButton";
import { useCart } from "../../context/CartContext";
import { onAuthStateChanged } from "firebase/auth";

export default function Catalog({ category, showLiked, ratingFilter }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });

        // Следим за промени в продуктите
        const unsubscribeProducts = onSnapshot(collection(db, "products"), (snapshot) => {
            const productsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(productsList);
            setLoading(false);
        });

        return () => {
            unsubscribeAuth(); // Спираме слушателя за auth
            unsubscribeProducts(); // Спираме слушателя за продукти
        };
    }, []);

    const filteredProducts = products
        .filter(product => !category || product.category === category)
        .filter(product => !showLiked || (product.likedBy && product.likedBy.includes(currentUser?.uid)))
        .filter(product => {
            if (!ratingFilter) return true;
            return (product.likedBy?.length || 0) >= ratingFilter[0] &&
                (product.likedBy?.length || 0) <= ratingFilter[1];
        });



    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div
                    className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full"
                >
                    <div
                        className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"
                    ></div>
                </div>
            </div>
        );
    }

    // Ако няма продукти, показваме съобщение
    if (filteredProducts.length === 0) {
        return <p className="text-center text-lg mt-10">Няма налични продукти с тези филтри.</p>;
    }

    return (
        <div className="container mx-auto p-8">
            <h2 className="text-3xl font-semibold text-center mb-6">Каталог</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="bg-white p-4 shadow-lg rounded-lg">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-contain rounded" />
                        <h3 className="text-xl font-semibold mt-3">{product.name}</h3>

                        <Link to={`/details/${product.id}`} className="">
                            <button
                                className="relative inline-flex items-center justify-center px-8 py-2.5 overflow-hidden tracking-tighter text-white bg-gray-800 rounded-md group"
                            >
                                <span
                                    className="absolute w-0 h-0 transition-all duration-500 ease-out bg-orange-600 rounded-full group-hover:w-56 group-hover:h-56"
                                ></span>
                                <span className="absolute bottom-0 left-0 h-full -ml-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-auto h-full opacity-100 object-stretch" viewBox="0 0 487 487">
                                        <path fillOpacity=".1" fillRule="nonzero" fill="#FFF" d="M0 .3c67 2.1 134.1 4.3 186.3 37 52.2 32.7 89.6 95.8 112.8 150.6 23.2 54.8 32.3 101.4 61.2 149.9 28.9 48.4 77.7 98.8 126.4 149.2H0V.3z"></path>
                                    </svg>
                                </span>
                                <span className="absolute top-0 right-0 w-12 h-full -mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="object-cover w-full h-full" viewBox="0 0 487 487">
                                        <path fillOpacity=".1" fillRule="nonzero" fill="#FFF" d="M487 486.7c-66.1-3.6-132.3-7.3-186.3-37s-95.9-85.3-126.2-137.2c-30.4-51.8-49.3-99.9-76.5-151.4C70.9 109.6 35.6 54.8.3 0H487v486.7z"></path>
                                    </svg>
                                </span>
                                <span
                                    className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-200"
                                ></span>
                                <span className="relative text-base font-semibold">Детайли !</span>
                            </button>
                        </Link>
                        <p className="text-lg font-bold text-blue-500 mt-2">{product.price} лв.</p>

                        {currentUser && product.userId !== currentUser?.uid && (
                            <>
                                <LikeButton productId={product.id} likedBy={product.likedBy || []} />
                                <p className="text-gray-700 mt-2 flex justify-end">❤️ {product.likedBy?.length || 0} харесвания</p>
                                <button
                                    onClick={() => addToCart(product)}
                                    className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                                >
                                    Купи
                                </button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
