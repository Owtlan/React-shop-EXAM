import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext"
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { useState } from "react";




const Checkout = () => {
    const { cart, clearCart } = useCart();
    const navigate = useNavigate();


    const [userInfo, setUserInfo] = useState({
        name: "",
        address: "",
        phone: "",
    });

    const handleChange = (e) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    }


    const handleOrderSubmit = async (e) => {
        e.preventDefault();

        if (!userInfo.name || !userInfo.address || !userInfo.phone) {
            alert("Моля, попълнете всички полета!");
            return;
        }

        try {
            await addDoc(collection(db, "orders"), {
                ...userInfo,
                cart,
                total: cart.reduce((sum, product) => sum + product.price, 0),
                createdAt: new Date(),
            })

            alert("Вашата поръчка беше направена успешно!");
            clearCart()
            navigate("/"); // Пренасочване към началната страница
        } catch (error) {
            console.error("Грешка при поръчката: ", error);
            alert("Възникна грешка при създаването на поръчката.");
        }
    }

    return (
        <div className="container mx-auto p-8">
            <h2 className="text-3xl font-semibold text-center mb-6">Завърши поръчката</h2>

            <form onSubmit={handleOrderSubmit} className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-lg">
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

                <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition">
                    Поръчай
                </button>
            </form>
        </div>
    )
}

export default Checkout