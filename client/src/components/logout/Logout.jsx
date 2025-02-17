import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";


export default function Logout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        if (!auth.currentUser) return;

        const userRef = doc(db, "users", auth.currentUser.uid)


        try {
            // 🔹 Проверяваме дали документът съществува
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                await updateDoc(userRef, { isOnline: false });
            } else {
                console.warn("⚠️ Потребителският документ не съществува в Firestore.");
            }

            await signOut(auth);
            console.log("✅ Успешно излизане!");
            navigate("/");
        } catch (error) {
            console.error("❌ Грешка при излизане: ", error.message);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
        >
            Изход
        </button>
    )


}
