import { useState } from "react";

export default function Search({ onSearch, searchQuery, handleClear }) {

    const [inputValue, setInputValue] = useState(searchQuery);

    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSearch = () => {
        onSearch(inputValue);
    };

    const handleClearInput = () => {
        setInputValue('')
        handleClear()
    }


    return (
        <div className="mb-4">
            {/* <input
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
                onClick={handleClearInput}
            >
                Изчисти
            </button> */}

            <div className="relative">
                <input
                    placeholder="Search..."
                    className="input shadow-lg focus:border-2 border-gray-300 px-5 py-3 rounded-xl w- transition-all focus:w-64 outline-none"
                    name="search"
                    type="search"
                    value={inputValue}
                    onChange={handleChange}
                />
                <svg
                    className="size-6 absolute top-3 right-3 text-gray-500"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={handleSearch}
                >
                    <path
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                    ></path>
                </svg>

                <button
                className="bg-black text-white border border-gray-600 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-110 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
                onClick={handleClearInput}
            >
                Изчисти
            </button>
            </div>
        </div>
    );
}