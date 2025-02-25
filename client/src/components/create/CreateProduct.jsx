import { useState } from "react";
import { db } from "../../firebase-config";
import { collection, addDoc } from "firebase/firestore";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

export default function CreateProduct() {

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [category, setCategory] = useState('')
    const [error, setError] = useState('');
    const navigate = useNavigate();



    const uploadImage = async () => {
        if (!image) {
            setError("Моля, изберете снимка!");
            return;
        }

        const formData = new FormData();


        formData.append("file", image)
        formData.append("upload_preset", "product_upload")

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/de4beegii/image/upload`,
                formData
            );
            setImageUrl(response.data.secure_url)
            console.log("Снимката е качена успешно:", response.data.secure_url);

        } catch (err) {
            setError("Грешка при качването на снимката");
        }

    }



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !price || !description || !imageUrl || !category) {
            setError("Моля, попълнете всички полета!")
            return;
        }
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            setError("Не сте влезли в профила си!");
            return;
        }


        try {
            await addDoc(collection(db, "products"), {
                name,
                price: Number(price),
                description,
                imageUrl,
                category,
                createdAt: new Date(),
                userId: user.uid
            });

            console.log("Продуктът е добавен успешно!");
            navigate("/catalog")

        } catch (error) {
            console.error("Грешка при добавяне на продукт:", error.message)
            setError("Грешка при добавянето на продукта.")
        }
    };

    console.log("Избрана категория:", category); // За да провериш дали категорията е правилно зададена


    return (
        <>

            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                    <h2 className="text-2xl font-semibold text-center">Добави продукт</h2>
                    {error && <p className="text-red-500 text-center">{error}</p>}

                    <form onSubmit={handleSubmit} className="mt-4">
                        <div>
                            <label className="block mb-1">Име на Продукта</label>
                            <input type="text"
                                className="w-full p-2 border rounded"
                                placeholder="Въведете име"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mt-3">
                            <label className="block mb-1">Цена</label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded"
                                placeholder="Въведете цена"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mt-3">
                            <label className="block mb-1">Описание</label>
                            <textarea
                                className="w-full p-2 border rounded"
                                placeholder="Добавете описание"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>


                        <div className="mt-3">
                            <label className="block mb-1">Изображение</label>
                            <input
                                type="file"
                                className="w-full p-2 border rounded"
                                onChange={(e) => {
                                    setImage(e.target.files[0]);
                                    console.log("Избран файл:", e.target.files[0]);
                                }}
                                required
                            />
                            <button type="button" onClick={uploadImage}
                                className="mt-2 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition">
                                Качи снимка
                            </button>
                        </div>

                        {imageUrl && (
                            <div className="mt-3">
                                <img src={imageUrl} alt="Продукт" className="w-full h-40 object-cover rounded" />
                            </div>
                        )}

                        <div className="mt-3">
                            <label className="block mb-1">Изберете категория</label>
                            <select
                                className="w-full p-2 border rounded"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            >
                                <option value="">Изберете категория</option>
                                <option value="Мъжки Обувки">Мъжки Обувки</option>
                                <option value="Мъжки Якета">Мъжки Якета</option>
                                <option value="Женски Якета">Женски Якета</option>
                                <option value="Дамски Обувки">Дамски Обувки</option>
                                <option value="Мъжки Тениски">Мъжки Тениски</option>
                                <option value="Женски Тениски">Женски Тениски</option>
                            </select>
                        </div>



                        <button
                            type="submit"
                            className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                        >
                            Създай продукт
                        </button>

                    </form>

                </div>
            </div>

        </>
    )
}