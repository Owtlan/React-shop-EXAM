import '../../css/Home.css'


export default function Home() {
    return (
        <>
            <header
                className="home-header"
                style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?fashion,clothes')" }}
            >
                <div className="home-overlay">
                    <h1 className="home-title">Открийте най-новите модни тенденции</h1>
                    <p className="home-subtitle">Стил, комфорт и качество на едно място</p>
                    <a href="#" className="home-button">Разгледай сега</a>
                </div>
            </header>
        </>

    )
}