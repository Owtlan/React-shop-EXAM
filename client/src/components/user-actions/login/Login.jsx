
import { signInWithEmailAndPassword } from "firebase/auth"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "../../../firebase-config"

export default function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()


    const handleLogin = async (e) => {
        e.preventDefault()


        try {
            await signInWithEmailAndPassword(auth, email, password)
            console.log("Успешно влизане!");

            navigate('/')
        } catch (error) {
            console.error("Грешка при влизането: ", error.message);
            setError('Невалидни данни за вход. Моля, опитайте отново.')
        }
    };

    return (
        <>

            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                    <h2 className="text-2xl font-semibold text-center">Вход</h2>
                    {error && <p className="text-red-500 text-center">{error}</p>}

                    <form onSubmit={handleLogin} className="mt-4">
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
                                autoComplete="new-password"
                                className="w-full p-2 border rounded"
                                placeholder="Въведете парола"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                        >
                            Вход
                        </button>
                    </form>
                </div>
            </div>
        </>
    )

}