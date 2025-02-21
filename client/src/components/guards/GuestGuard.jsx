import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../../firebase-config";





export default function GuestGuard({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);


    if (loading) {
        return (
            <div className="flex flex-col gap-4 w-full items-center justify-center">
                <div className="w-20 h-20 border-4 border-transparent animate-spin border-t-blue-400 rounded-full">
                    <div className="w-16 h-16 border-4 border-transparent animate-spin border-t-red-400 rounded-full"></div>
                </div>
                <p>Зареждане...</p>
            </div>
        );
    }

    return user ? <Navigate to="/" /> : children; // ✅ Само за гости (нелогнати)
}