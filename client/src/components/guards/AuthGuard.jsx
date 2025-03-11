import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../../firebase-config";


export default function AuthGuard({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        },
            (error) => {
                console.error("Грешка при проверката на автентикацията:", error)
                setError("Неуспешно зареждане на потребителя.")
                setLoading(false)
            });

        return () => unsubscribe();
    }, [])

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
    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg text-red-500">{error}</p>
            </div>
        );
    }


    return user ? children : <Navigate to="/login" />;
}