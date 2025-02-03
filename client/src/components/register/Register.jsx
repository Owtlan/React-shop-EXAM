
import { useState } from "react"
import { auth, db } from '../../firebase-config'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from "react-router-dom"
import { collection, addDoc } from "firebase/firestore"

export default function Register() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()



    const handleRegister = async (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setError("Паролите не съвпадат.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user


            await addDoc(collection(db, "users"), {
                uid: user.uid,
                email: user.email,
                createdAt: new Date(),
            })

            console.log("Потребителят е добавен в Firestore!");
            navigate('/')

        } catch (error) {
            console.error("Грешка при регистрацията: ", error.message);

        }

    }


    return (
        <>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                    <h2 className="text-2xl font-semibold text-center">Регистрация</h2>
                    {error && <p className="text-red-500 text-center">{error}</p>}

                    <form onSubmit={handleRegister} className="mt-4">
                        <div>
                            <label className="block mb-1">Имейл</label>
                            <input
                                type="email"
                                className="w-full p-2 border rounded"
                                placeholder="Въведете имейл"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mt-3">
                            <label className="block mb-1">Парола</label>
                            <input
                                type="password"
                                className="w-full p-2 border rounded"
                                placeholder="Въведете парола"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mt-3">
                            <label className="block mb-1">Потвърдете паролата</label>
                            <input
                                type="password"
                                className="w-full p-2 border rounded"
                                placeholder="Повторете паролата"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                        >
                            Регистрация
                        </button>
                    </form>
                </div>
            </div>
        </>
    )


}