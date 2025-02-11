import { getAuth } from "firebase/auth";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../../firebase-config";

export default function LikeButton({ productId, likedBy }) {

    const auth = getAuth()
    const currentUser = auth.currentUser;
    const [liked, setLiked] = useState(likedBy?.includes(currentUser?.uid));


    const handleLike = async () => {

        if (!currentUser) return;

        const productRef = doc(db, "products", productId);


        try {
            if (liked) {
                await updateDoc(productRef, { likedBy: arrayRemove(currentUser.uid) });
            } else {
                await updateDoc(productRef, { likedBy: arrayUnion(currentUser.uid) })
            }
            setLiked(!liked)
        } catch (error) {
            console.error("Грешка при харесване:", error);
        }
    };

    if (!currentUser) return null;

    return (
        <button onClick={handleLike} className="mt-2 text-lg font-bold text-gray-700">
            {liked ? "❤️ Unlike" : "🤍 Like"}
        </button>
    )

}