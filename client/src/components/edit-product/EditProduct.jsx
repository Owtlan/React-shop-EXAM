import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProduct() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");

    const auth = getAuth();
    const currentUser = auth.currentUser

    useEffect(() => {
        const fetchProduct = async () => {

            if (!currentUser) return;
            setLoading(true)

            try {

                const docRef = doc(db, "products", id)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    const productData = docSnap.data();

                    if (currentUser && productData.userId === currentUser.uid) {
                        setProduct(productData)
                        setName(productData.name)
                        setPrice(productData.price)
                        setDescription(productData.description)
                        setCategory(productData.category)
                    } else {
                        setError("Нямате права за редактиране на този продукт.")
                    }
                } else {
                    setError("Продуктът не беше намерен.");
                }
            } catch (error) {
                setError("Грешка при зареждане на продукта.");

            } finally {
                setLoading(false)
            }
        };

        fetchProduct();
    }, [id, currentUser]);


    const handleUpdate = async (e) => {
        e.preventDefault();


        if (!name || !price || !description || !category) {
            setError("Моля, попълнете всички полета!")
            return;
        }

        if (!name || name.length < 6) {
            setError("Името на продукта трябва да съдържа поне 6 букви!");
            return;
        }

        if (!description || description.length < 10) {
            setError("Описанието трябва да съдържа поне 10 букви!");
            return;
        }

        if (price <= 0) {
            setError("Цената трябва да бъде положителна!");
            return;
        }



        try {
            const productRef = doc(db, "products", id);
            await updateDoc(productRef, {
                name,
                price: Number(price),
                description,
                category,
            });
            alert("Продуктът е обновен успешно!");
            navigate(`/details/${id}`);
        } catch (error) {
            setError("Грешка при обновяването на продукта.");
        }
    };

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

        )
    }

    { error && <p className="text-red-500 text-center mt-4">{error}</p> }



    return (

        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-semibold text-center">Редактиране на продукт</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}

                <form onSubmit={handleUpdate} className="mt-4">

                    <div>
                        <label className="block mb-1">Име на Продукта</label>
                        <input type="text" className="w-full p-2 border rounded" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className="mt-3">
                        <label className="block mb-1">Цена</label>
                        <input type="number" className="w-full p-2 border rounded" value={price} onChange={(e) => setPrice(e.target.value)} />
                    </div>

                    <div className="mt-3">
                        <label className="block mb-1">Описание</label>
                        <textarea className="w-full p-2 border rounded" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>

                    <div className="mt-3">
                        <label className="block mb-1">Категория</label>
                        <select className="w-full p-2 border rounded" value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="">Изберете категория</option>
                            <option value="Мъжки Обувки">Мъжки Обувки</option>
                            <option value="Мъжки Якета">Мъжки Якета</option>
                            <option value="Женски Якета">Женски Якета</option>
                            <option value="Дамски Обувки">Дамски Обувки</option>
                            <option value="Мъжки Тениски">Мъжки Тениски</option>
                            <option value="Женски Тениски">Женски Тениски</option>
                            <option value="Женски Дънки">Женски Дънки</option>
                            <option value="Мъжки Дънки">Мъжки Дънки</option>
                        </select>
                    </div>

                    <button type="submit" className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
                        Запази промените
                    </button>

                </form>

            </div>
        </div>
    )
}