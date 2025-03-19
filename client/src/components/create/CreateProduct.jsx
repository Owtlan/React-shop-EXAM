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

    // const handleImageChange = async (selectedImage) => {
    //     setImage(selectedImage);
    //     if (!imageUrl) {
    //         const url = await uploadImage(selectedImage);
    //         setImageUrl(url);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !price || !description || !imageUrl || !category || colorImages.length === 0) {
            setError("Моля, попълнете всички полета!");
            return;
        }

        if (price <= 0) {
            setError("Цената трябва да бъде положителна!");
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
            <div className="flex justify-center items-center min-h-screen bg-background-image: bg-gradient-to-t from-[#e6e9f0] to-[#eef1f5]">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                    <h2 className="text-3xl font-semibold text-center text-teal-700 mb-6">Добави нов продукт</h2>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Име на Продукта</label>
                            <input type="text"
                                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                placeholder="Въведете име"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Цена</label>
                            <input
                                type="number"
                                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                placeholder="Въведете цена"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Описание</label>
                            <textarea
                                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                placeholder="Добавете описание"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Изображение на продукта</label>
                            <input
                                type="file"
                                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                onChange={(e) => {
                                    const selectedImage = e.target.files[0];
                                    setImage(selectedImage);
                                    if (!imageUrl) {
                                        uploadImage(selectedImage).then(url => setImageUrl(url));
                                    }
                                }}
                                required
                            />
                            {imageUrl && <img src={imageUrl} alt="Продукт" className="mt-4 w-full h-40 object-cover rounded-md" />}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Изберете категория</label>
                            <select
                                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Цвят и изображение</label>
                            <div className="flex space-x-4">
                                <input
                                    type="text"
                                    className="w-1/2 p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    placeholder="Цвят на продукта"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                />
                                <input
                                    type="file"
                                    className="w-1/2 p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    onChange={(e) => setColorImage(e.target.files[0])}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleAddColorImage}
                                className="mt-3 w-full bg-teal-500 text-white p-3 rounded-lg hover:bg-teal-600 transition duration-300"
                            >
                                Добави цвят и изображение
                            </button>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-700">Добавени цветове и изображения:</h3>
                            <ul className="mt-2">
                                {colorImages.map((item, index) => (
                                    <li key={index} className="flex items-center space-x-2 mb-2">
                                        <span className="text-sm">{item.color}</span>
                                        <img src={item.url} alt={item.color} className="w-12 h-12 object-cover rounded-md" />
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-teal-600 text-white p-3 rounded-lg hover:bg-teal-700 transition duration-300"
                        >
                            Създай продукт
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
