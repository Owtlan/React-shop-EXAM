import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useState, useEffect, createContext } from "react"


const AuthContext = createContext()


export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const auth = getAuth();


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
        });


        return () => unsubscribe();
    }, [auth]);

    return (
        <AuthContext.Provider value={{ isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext