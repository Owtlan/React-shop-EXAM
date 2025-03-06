import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext"
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { useState } from "react";



const Checkout = () => {
    const { cart, clearCart, removeFromCart } = useCart();


    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({
        name: "",
        address: "",
        phone: "",
        postalCode: ""
    });

    const handleChange = (e) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    }

    const handleOrderSubmit = async (e) => {
        e.preventDefault();

        if (!userInfo.name || !userInfo.address || !userInfo.phone || !userInfo.postalCode) {
            alert("Моля, попълнете всички полета!");
            return;
        }

        try {
            setLoading(true);

            await addDoc(collection(db, "orders"), {
                ...userInfo,
                cart,
                total: cart.reduce((sum, product) => sum + product.price, 0),
                createdAt: new Date(),
            })

            alert("Вашата поръчка беше направена успешно!");
            clearCart()
            navigate("/");
        } catch (error) {
            console.error("Грешка при поръчката: ", error);
            alert("Възникна грешка при създаването на поръчката.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <div
                className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full"
            >
                <div
                    className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"
                ></div>
            </div>
        </div>
    )

    return (
        <div className="container mx-auto p-8">
            <h2 className="text-3xl font-semibold text-center mb-6">Завърши поръчката</h2>

            <div className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-lg mb-6">
                <h3 className="text-xl font-semibold mb-4">Преглед на поръчката</h3>

                {cart.length === 0 ? (
                    <p className="text-gray-500 text-center">Количката е празна.</p>
                ) : (
                    <>
                        <ul>
                            {cart.map((product) => (
                                <li key={product.id} className="flex items-center justify-between py-2 border-b">
                                    <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-contain" />
                                    <p className="text-sm font-medium">{product.name} (x{product.quantity})</p> {/* Показване на количеството */}
                                    <p className="text-sm font-semibold">{product.totalPrice.toFixed(2)} лв.</p> {/* Показване на общата цена */}
                                    <button
                                        onClick={() => removeFromCart(product.id)}
                                        className="border-2 border-black group hover:border-green-500 w-12 h-12 duration-500 overflow-hidden"
                                        type="button"
                                    >
                                        <p className="text-3xl h-full w-full flex items-center justify-center text-black duration-500 relative z-10 group-hover:scale-0">
                                            ×
                                        </p>
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-4 text-right font-semibold text-lg">
                            Общо: {cart.reduce((sum, product) => sum + product.totalPrice, 0).toFixed(2)} лв. {/* Показване на крайна сума */}
                        </div>

                        {/* 🔥 Формата се показва само ако има продукти в количката */}
                        <form onSubmit={handleOrderSubmit} className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-lg mt-6">
                            <label className="block mb-2">Име:</label>
                            <input
                                type="text"
                                name="name"
                                value={userInfo.name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded mb-4"
                            />

                            <label className="block mb-2">Адрес:</label>
                            <input
                                type="text"
                                name="address"
                                value={userInfo.address}
                                onChange={handleChange}
                                className="w-full p-2 border rounded mb-4"
                            />

                            <label className="block mb-2">Телефон:</label>
                            <input
                                type="text"
                                name="phone"
                                value={userInfo.phone}
                                onChange={handleChange}
                                className="w-full p-2 border rounded mb-4"
                            />

                            <label className="block mb-2">Пощенски код:</label>
                            <input
                                type="text"
                                name="postalCode"
                                value={userInfo.postalCode}
                                onChange={handleChange}
                                className="w-full p-2 border rounded mb-4"
                            />

                            <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition">
                                Поръчай
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );

}

export default Checkout