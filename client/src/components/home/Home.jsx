import { useState } from "react"
import Catalog from "../catalog/Catalog"


export default function Home() {
    const [category, setCategory] = useState('');

    // console.log("Избрана категория от бутон:", category); // Проверка на избраната категория

    return (
        <>

            <header
                className="home-header"
                style={{
                    display: "flex",
                    justifyContent: 'center'
                }}
            >

                <div
                    style={{
                        backgroundImage: "url('https://img.freepik.com/premium-photo/beautiful-mixes-race-woman-holding-shopping-bags-smiling_204996-1035.jpg?w=1060')",
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        padding: '50px 0',
                        textAlign: 'center',
                        color: 'white',
                        minHeight: '400px',
                        width: '50%'

                    }}
                ></div>
            </header >
            <div className="home-overlay"
                style={
                    {
                        display: "flex",
                        flexDirection: 'column',
                        textAlign: 'center'
                    }
                }
            >
                <h1 className="home-title text-4xl font-bold">Открийте най-новите модни тенденции</h1>
                <p className="home-subtitle text-xl">Стил, комфорт и качество на едно място</p>
            </div>

            <div className="category-selector text-center mt-8">
                <button onClick={() => setCategory("Мъжки Обувки")} className="bg-blue-500 text-white p-2 m-2 rounded">Мъжки Обувки</button>
                <button onClick={() => setCategory("Мъжки Якета")} className="bg-blue-500 text-white p-2 m-2 rounded">Мъжки Якета</button>
                <button onClick={() => setCategory("Женски Якета")} className="bg-blue-500 text-white p-2 m-2 rounded">Женски Якета</button>
                <button onClick={() => setCategory("Дамски Обувки")} className="bg-blue-500 text-white p-2 m-2 rounded">Дамски Обувки</button>
                <button onClick={() => setCategory("Мъжки Тениски")} className="bg-blue-500 text-white p-2 m-2 rounded">Мъжки Тениски</button>
                <button onClick={() => setCategory("Женски Тениски")} className="bg-blue-500 text-white p-2 m-2 rounded">Женски Тениски</button>
            </div>


            <Catalog category={category} />

            
        </>

    )
}