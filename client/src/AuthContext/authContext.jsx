import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useState, useEffect, createContext } from "react"


const AuthContext = createContext()


export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState(null);
    const auth = getAuth();


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
                setUser(user); // Записваме текущия потребител
            } else {
                setIsAuthenticated(false);
                setUser(null); // Премахваме потребителя при logout
            }
        });


        return () => unsubscribe();
    }, [auth]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, user }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext