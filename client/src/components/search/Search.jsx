import { useState } from "react";



export default function Search({ onSearch, searchQuery, handleClear }) {

    const [inputValue, setInputValue] = useState(searchQuery);    // const [clear, setClear] = useState('')


    // console.log(setFilteredProducts);


    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSearch = () => {
        onSearch(inputValue);
    };




    return (
        <div className="mb-4">
            <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                placeholder="Търсене..."
                className="w-full p-2 border border-gray-300 rounded-md"
            />

            <button
                onClick={handleSearch}
                className="mt-2 w-full bg-blue-500 text-white py-2 rounded-md"
            >
                Търсене
            </button>

            <button
                className="bg-black text-white border border-gray-600 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-110 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
                onClick={handleClear}
            >
                Изчисти
            </button>
        </div>
    );
}