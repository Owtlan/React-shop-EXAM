import { getAuth } from "firebase/auth";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../../firebase-config";

export default function LikeButton({ productId, likedBy, userId }) {

    const auth = getAuth()
    const currentUser = auth.currentUser;
    const [liked, setLiked] = useState(likedBy?.includes(currentUser?.uid));
    const [likeCount, setLikeCount] = useState(likedBy?.length || 0)



    const handleLike = async () => {

        if (!currentUser || currentUser.uid === userId) return;

        const productRef = doc(db, "products", productId);


        try {
            if (liked) {
                await updateDoc(productRef, { likedBy: arrayRemove(currentUser.uid) });
                setLikeCount(prevCount => prevCount - 1);
            } else {
                await updateDoc(productRef, { likedBy: arrayUnion(currentUser.uid) })
                setLikeCount(prevCount => prevCount + 1);
            }
            setLiked(!liked)
        } catch (error) {
            console.error("Грешка при харесване:", error);
        }
    };

    if (!currentUser) return null;

    return (
        <button
            className="absolute top-0 right-0 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-transform duration-200 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group animate-rainbow cursor-pointer border-0 bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,hsl(0,100%,63%),hsl(90,100%,63%),hsl(210,100%,63%),hsl(195,100%,63%),hsl(270,100%,63%))] bg-[length:200%] text-foreground [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.08*1rem)_solid_transparent] before:absolute before:bottom-[-20%] before:left-1/2 before:z-[0] before:h-[20%] before:w-[60%] before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,hsl(0,100%,63%),hsl(90,100%,63%),hsl(210,100%,63%),hsl(195,100%,63%),hsl(270,100%,63%))] before:[filter:blur(calc(0.8*1rem))] dark:bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,hsl(0,100%,63%),hsl(90,100%,63%),hsl(210,100%,63%),hsl(195,100%,63%),hsl(270,100%,63%))] hover:scale-105 active:scale-95 h-10 px-4 py-2 inline-flex"
            onClick={handleLike}
            disabled={currentUser?.uid === userId}
        >
            <div className="ml-2 flex items-center gap-1 text-sm md:flex">
                <svg
                    className={`size-4 ${liked ? 'text-yellow-300' : 'text-gray-300'}`}

                    data-slot="icon"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        clipRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                        fillRule="evenodd"
                    ></path>
                </svg>
                <span
                    className="inline-block tabular-nums tracking-wider font-display font-medium text-black dark:text-white"
                >
                    {likeCount} харесвания
                </span>
            </div>
        </button>
    )

}