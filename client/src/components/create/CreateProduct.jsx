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
    const [category, setCategory] = useState('');
    const [color, setColor] = useState('');
    const [colorImage, setColorImage] = useState(null);
    const [colorImages, setColorImages] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const uploadImage = async (image) => {
        if (!image) {
            setError("Моля, изберете снимка!");
            return;
        }

        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "product_upload");

        try {
            const response = await axios.post(
                'https://api.cloudinary.com/v1_1/de4beegii/image/upload',
                formData
            );
            return response.data.secure_url; 
        } catch (err) {
            setError("Грешка при качването на снимката");
            console.error(err);
        }
    };

    const handleAddColorImage = async () => {
        if (!color || !colorImage) {
            setError("Моля, попълнете цветът и изображението!");
            return;
        }

        try {
            const colorImageUrl = await uploadImage(colorImage); 
            setColorImages([...colorImages, { color, url: colorImageUrl }]); 
            setColor(''); 
            setColorImage(null); 
        } catch (err) {
            setError("Грешка при качването на изображението за цвета");
            console.error(err);
        }
    };

    const handleImageChange = async (selectedImage) => {
        setImage(selectedImage);
        if (!imageUrl) {
            const url = await uploadImage(selectedImage);
            setImageUrl(url); 
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !price || !description || !imageUrl || !category || colorImages.length === 0) {
            setError("Моля, попълнете всички полета!");
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
                colorImages, 
                createdAt: new Date(),
                userId: user.uid,
            });

            navigate("/catalog");
        } catch (error) {
            console.error("Грешка при добавяне на продукт:", error.message);
            setError("Грешка при добавянето на продукта.");
        }
    };

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
                                    const selectedImage = e.target.files[0];
                                    setImage(selectedImage);
                                    if (!imageUrl) {
                                        uploadImage(selectedImage).then(url => setImageUrl(url));
                                    }
                                }}
                                required
                            />

                            {imageUrl && (
                                <div className="mt-3">
                                    <img src={imageUrl} alt="Продукт" className="w-full h-40 object-cover rounded" />
                                </div>
                            )}
                        </div>

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
                                <option value="Женски Дънки">Женски Дънки</option>
                                <option value="Мъжки Дънки">Мъжки Дънки</option>
                            </select>
                        </div>

                        <div className="mt-3">
                            <label className="block mb-1">Цвят и изображение</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                placeholder="Цвят на продукта"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                            />
                            <input
                                type="file"
                                className="w-full p-2 border rounded mt-2"
                                onChange={(e) => setColorImage(e.target.files[0])}
                            />
                            <button
                                type="button"
                                onClick={handleAddColorImage}
                                className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                            >
                                Добави цвят и изображение
                            </button>
                        </div>

                        <div className="mt-3">
                            <h3>Добавени цветове и изображения:</h3>
                            <ul>
                                {colorImages.map((item, index) => (
                                    <li key={index}>
                                        {item.color}:
                                        <button type="button" onClick={() => setImageUrl(item.url)}>
                                            <img src={item.url} alt={item.color} className="w-12 h-12 object-cover rounded" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
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
    );
}
