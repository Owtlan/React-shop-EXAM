
import { useEffect, useState } from "react"
import { db } from "../../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import Details from "../details/Details";
import { Link } from "react-router-dom";


export default function Catalog({ category }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');
    const testDetail = <Details />


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "products"))
                const productsList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // console.log("Продукти от базата данни:", productsList);
                setProducts(productsList);
                setLoading(false);
            } catch (error) {
                console.error("Грешка при зареждане на продуктите:", error);
            }
        };

        fetchProducts();
    }, [])

    if (loading) {
        return <p className="text-center text-lg mt-10">Зареждане...</p>;
    }

    const filterProducts = category
        ? products.filter(product => product.category.toLowerCase().trim() === category.toLowerCase().trim()) // Сравнявай малките букви
        : products;



    if (filterProducts.length === 0) {
        return <p className="text-center text-lg mt-10">Няма налични продукти в тази категория.</p>
    }


    const firstNineProducts = products.slice(0, 9)

    // console.log("Избрана категория:", category); // да видиш стойността на категорията, получена от Home.jsx
    // console.log("Продукти:", products);

    return (
        <>
            <div className="container mx-auto p-8">
                <h2 className="text-3xl font-semibold text-center mb-6">Каталог</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filterProducts.map((product) => (
                        <div key={product.id} className="bg-white p-4 shadow-lg rounded-lg">
                            <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover rounded" />
                            <h3 className="text-xl font-semibold mt-3">{product.name}</h3>

                            <Link to={`/details/${product.id}`}
                                className="block mt-3 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
                            >
                                Детайли
                            </Link>
                            <p className="text-lg font-bold text-blue-500 mt-2">{product.price} лв.</p>
                        </div>

                    ))}
                </div>
            </div >
        </>

    )

}