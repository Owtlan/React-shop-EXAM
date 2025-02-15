import { createContext, useContext, useEffect, useState } from "react";

// 1️⃣ Създаваме контекста
const CartContext = createContext();

// 2️⃣ Създаваме провайдър компонента
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);



    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, [])


    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // Функция за добавяне на продукт в количката
    const addToCart = (product) => {
        setCart((prevCart) => [...prevCart, product]);
    };

    // Функция за премахване на продукт от количката
    const removeFromCart = (id) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };


    const clearCart = () => {
        setCart([]);
        localStorage.removeItem("cart");
    }

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

// 3️⃣ Функция за използване на контекста
export const useCart = () => {
    return useContext(CartContext);
};
