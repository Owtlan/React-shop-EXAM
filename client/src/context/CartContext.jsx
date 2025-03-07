import { createContext, useContext, useEffect, useState } from "react";
import AuthContext from "../AuthContext/authContext";

// 1️⃣ Създаваме контекста
const CartContext = createContext();

// 2️⃣ Създаваме провайдър компонента
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const { user } = useContext(AuthContext)
    const [idsArray, setIdsArray] = useState([])


    useEffect(() => {
        const savedCart = localStorage.getItem("cart");


        try {

            if (savedCart) {
                const parsedCart = JSON.parse(savedCart);
                // console.log(parsedCart);

                if (user) {
                    console.log(parsedCart);


                    const filteredCart = parsedCart.filter((product) => product.userId === user.uid)
                    setCart(filteredCart)

                } else {
                    setCart([]); // Ако няма потребител, изчистваме количката
                }
            } else {
                setCart([])
            }
        } catch (error) {
            console.error("Грешка при парсиране на cart от localStorage", error);
            // console.log(localStorage);

            localStorage.removeItem("cart");
        }

    }, [user])


    useEffect(() => {

        if (user && cart.length > 0) {
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }, [cart, user]);

    // Функция за добавяне на продукт в количката
    // Функция за добавяне на продукт в количката
    const addToCart = (product) => {
        if (user) {
            // Винаги добавяйте `userId` към продукта, за да е сигурно, че той ще бъде асоцииран с потребителя
            const productWithUserId = { ...product, userId: user.uid };

            setCart((prevCart) => {
                const existingProductIndex = prevCart.findIndex(item => item.id === productWithUserId.id);

                if (existingProductIndex !== -1) {
                    // Ако продуктът вече съществува в количката, увеличаваме количеството му и актуализираме цената
                    const updatedCart = [...prevCart];
                    updatedCart[existingProductIndex].quantity += 1;
                    updatedCart[existingProductIndex].totalPrice = updatedCart[existingProductIndex].quantity * productWithUserId.price;
                    return updatedCart;
                } else {
                    // Ако продуктът не съществува в количката, добавяме го с quantity = 1 и изчисляваме totalPrice
                    return [
                        ...prevCart,
                        {
                            ...productWithUserId,
                            quantity: 1,
                            totalPrice: productWithUserId.price
                        }
                    ];
                }
            });
        }
    };

    // Функция за премахване на продукт от количката
    const removeFromCart = (id) => {
        setCart((prevCart) => {
            const productIndex = prevCart.findIndex((item) => item.id === id);

            if (productIndex !== -1) {
                const updatedCart = [...prevCart];
                const product = updatedCart[productIndex];

                // Ако количеството на продукта е повече от 1, намаляваме количеството му
                if (product.quantity > 1) {
                    updatedCart[productIndex].quantity -= 1;
                    updatedCart[productIndex].totalPrice = updatedCart[productIndex].quantity * product.price;
                } else {
                    // Ако количеството е 1, премахваме продукта напълно
                    updatedCart.splice(productIndex, 1);
                }

                // Ако количката е празна, изтриваме я от localStorage
                if (updatedCart.length === 0) {
                    localStorage.removeItem("cart");
                } else {
                    // Актуализираме localStorage със текущото състояние на количката
                    localStorage.setItem("cart", JSON.stringify(updatedCart));
                }

                return updatedCart;
            }
            return prevCart;
        });
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
