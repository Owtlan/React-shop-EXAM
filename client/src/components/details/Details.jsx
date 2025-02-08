import { doc, getDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { db } from "../../firebase-config";
import { getAuth } from "firebase/auth";


import { useNavigate } from "react-router-dom";
import LikeButton from "../like/LikeButton";


export default function Details() {

    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)

    const auth = getAuth();
    const currentUser = auth.currentUser;
    const navigate = useNavigate()

    const isOwner = currentUser && product?.userId === currentUser.uid



    useEffect(() => {
        const docRef = doc(db, "products", id);

        // 📌 Следим промени в реално време
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setProduct({ id: docSnap.id, ...docSnap.data() });
            } else {
                console.error("Продуктът не съществува!");
                setProduct(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [id])

    if (loading) {
        return <p className="text-center text-lg mt-10">Зареждане...</p>;
    }

    if (!product) {
        return <p className="text-center text-lg mt-10">Продуктът не беше намерен.</p>;

    }
    const handleDelete = async () => {
        if (window.confirm("Сигурен ли си, че искаш да изтриеш този продукт?")) {
            try {
                await deleteDoc(doc(db, "products", product.id))
                alert("Продуктът беше изтрит успешно!");
                navigate("/catalog");
            } catch (error) {

            }
        }
    }



    return (
        <>
            <div className="container mx-auto p-8 flex flex-col items-center mt-3 max-w-xl">
                <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-contain rounded" />
                <h2 className="text-2xl font-semibold mt-4">{product.name}</h2>
                <p className="text-gray-600 mt-2">{product.description}</p>
                <p className="text-lg front-bold text-blue-500 mt-2">{product.price} лв.</p>


                {isOwner && (
                    <div className="flex gap-4 mt-4">
                        <button onClick={() => navigate(`/edit/${product.id}`)} className="bg-yellow-500 text-white p-2 rounded">
                            Редактирай
                        </button>

                        <button onClick={handleDelete} className="bg-red-500 text-white p-2 rounded">
                            🗑️ Изтрий
                        </button>

                    </div>
                )}

                {product.userId !== getAuth().currentUser?.uid && (
                    <>
                        <LikeButton productId={product.id} likedBy={product.likedBy || []} />
                        <p className="text-gray-700 mt-2">❤️ {product.likedBy?.length || 0} харесвания</p>
                    </>
                )}


            </div>
        </>
    )

}