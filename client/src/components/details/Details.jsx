import { doc, getDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { db } from "../../firebase-config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import styles from '../css/colorFilters.module.css'
import { useNavigate } from "react-router-dom";
import LikeButton from "../like/LikeButton";
import { useCart } from "../../context/CartContext";

export default function Details() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [selectImage, setSelectedImage] = useState(null);
    const [selectedColorImage, setSelectedColorImage] = useState(null);


    const navigate = useNavigate();
    const { addToCart } = useCart();

    const isOwner = currentUser && product?.userId === currentUser.uid;

    useEffect(() => {
        const docRef = doc(db, "products", id);
        const unsubscribeProduct = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const productData = { id: docSnap.id, ...docSnap.data() };
                setProduct(productData);

                if (productData.imageUrl) {
                    setSelectedImage(productData.colorImages[0].url);
                }

                if (productData.colorImages && productData.colorImages.length > 0) {
                    setSelectedColorImage(productData.imageUrl);
                }
            } else {
                console.error("Продуктът не съществува!");
                setProduct(null);
            }
            setLoading(false);
        });


        const unsubscribeAuth = onAuthStateChanged(getAuth(), (user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
        });

        return () => {
            unsubscribeProduct();
            unsubscribeAuth();
        };
    }, [id]);

    const handleImageChange = (color) => {
        const selected = product.colorImages.find((img) => img.color === color);

        if (selected) {
            setSelectedColorImage(selected.url);
            setProduct(prevProduct => ({

                ...prevProduct,
                name: `${prevProduct.name.split(' - ')[0]} - ${color}`
            }))
        }

    };

    const handleDelete = async () => {
        if (window.confirm("Сигурен ли си, че искаш да изтриеш този продукт?")) {
            try {
                await deleteDoc(doc(db, "products", product.id));
                alert("Продуктът беше изтрит успешно!");
                navigate("/catalog");
            } catch (error) {
                console.error("Грешка при изтриването на продукта:", error);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
                    <div className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"></div>
                </div>
            </div>
        );
    }

    if (!product) {
        return <p className="text-center text-lg mt-10">Продуктът не беше намерен.</p>;
    }

    return (
        <>
            <div className="container mx-auto px-8 pt-20 flex flex-col items-center mt-3 max-w-xl mb-10">
                <img src={selectedColorImage || selectImage} alt={product.name} className="w-full h-64 object-contain rounded" />
                <h2 className="text-2xl font-semibold mt-4">{product.name}</h2>
                <p className="text-gray-600 mt-2">{product.description}</p>
                <p className="text-lg front-bold text-blue-500 mt-2">{product.price} лв.</p>

                <div className="mt-4 flex gap-2 mb-4 md:mb-0">
                    {product.colorImages && product.colorImages.length > 0 ? (
                        product.colorImages.map((item) => (
                            <button
                                key={item.color}
                                onClick={() => handleImageChange(item.color)}
                                className={`${styles["color-filter-btn"]} ${item.color === selectedColorImage ? "bg-gray-500" : ""}`}
                            >
                                <img
                                    src={item.url}
                                    alt={item.color}
                                    className="w-12 h-12 object-cover rounded"
                                />
                            </button>
                        ))
                    ) : (
                        <p>Няма изображения за този продукт.</p>
                    )}
                </div>

                {isOwner && (
                    <div className="flex gap-4 mt-4">
                        <button onClick={() => navigate(`/edit/${product.id}`)} className="bg-yellow-500 text-white p-2 rounded">
                            Редактирай
                        </button>

                        <button
                            onClick={handleDelete}
                            className="group relative flex h-14 w-14 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-red-800 bg-red-400 hover:bg-red-600"
                        >
                            <svg
                                viewBox="0 0 1.625 1.625"
                                className="absolute -top-7 fill-white delay-100 group-hover:top-6 group-hover:animate-[spin_1.4s] group-hover:duration-1000"
                                height="15"
                                width="15"
                            >
                                <path
                                    d="M.471 1.024v-.52a.1.1 0 0 0-.098.098v.618c0 .054.044.098.098.098h.487a.1.1 0 0 0 .098-.099h-.39c-.107 0-.195 0-.195-.195"
                                ></path>
                                <path
                                    d="M1.219.601h-.163A.1.1 0 0 1 .959.504V.341A.033.033 0 0 0 .926.309h-.26a.1.1 0 0 0-.098.098v.618c0 .054.044.098.098.098h.487a.1.1 0 0 0 .098-.099v-.39a.033.033 0 0 0-.032-.033"
                                ></path>
                                <path
                                    d="m1.245.465-.15-.15a.02.02 0 0 0-.016-.006.023.023 0 0 0-.023.022v.108c0 .036.029.065.065.065h.107a.023.023 0 0 0 .023-.023.02.02 0 0 0-.007-.016"
                                ></path>
                            </svg>
                            <svg
                                width="16"
                                fill="none"
                                viewBox="0 0 39 7"
                                className="origin-right duration-500 group-hover:rotate-90"
                            >
                                <line strokeWidth="4" stroke="white" y2="5" x2="39" y1="5"></line>
                                <line
                                    strokeWidth="3"
                                    stroke="white"
                                    y2="1.5"
                                    x2="26.0357"
                                    y1="1.5"
                                    x1="12"
                                ></line>
                            </svg>
                            <svg width="16" fill="none" viewBox="0 0 33 39" className="">
                                <mask fill="white" id="path-1-inside-1_8_19">
                                    <path
                                        d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"
                                    ></path>
                                </mask>
                                <path
                                    mask="url(#path-1-inside-1_8_19)"
                                    fill="white"
                                    d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                                ></path>
                                <path strokeWidth="4" stroke="white" d="M12 6L12 29"></path>
                                <path strokeWidth="4" stroke="white" d="M21 6V29"></path>
                            </svg>
                        </button>
                    </div>
                )}

                {currentUser && product.userId !== getAuth().currentUser?.uid && (
                    <>
                        <LikeButton productId={product.id} likedBy={product.likedBy || []} />
                        <button
                            onClick={() => addToCart(product)}
                            className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                        >
                            Купи
                        </button>
                    </>
                )}
            </div>
        </>
    );
}
