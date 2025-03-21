import { useState } from "react";

export default function Search({ onSearch, searchQuery, handleClear }) {

    const [inputValue, setInputValue] = useState(searchQuery);

    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSearch = (e) => {
        e.preventDefault()
        onSearch(inputValue);
    };

    const handleClearInput = () => {
        setInputValue('')
        handleClear()
    }


    return (
        <div className="mb-4">
            <div className="relative">
                <form className="form relative" onSubmit={handleSearch}> {/* Добавяне на onSubmit */}
                    <button className="absolute left-2 -translate-y-1/2 top-1/2 p-1">
                        <svg
                            width="17"
                            height="16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            role="img"
                            ariaLabelledby="search"
                            className="w-5 h-5 text-gray-700"
                        >
                            <path
                                d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                                stroke="currentColor"
                                strokeWidth="1.333"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                        </svg>
                    </button>
                    <input
                        className="input rounded-full px-8 py-3 border-2 border-transparent focus:outline-none focus:border-blue-500 placeholder-gray-400 transition-all duration-300 shadow-md"
                        placeholder="Search..."
                        required=""
                        type="text"
                        value={inputValue}
                        onChange={handleChange}
                    />
                    <button type="reset" className="absolute right-3 -translate-y-1/2 top-1/2 p-1" onClick={handleClearInput}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-gray-700"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    )





    {/* <input
                    placeholder="Search..."
                    className="input shadow-lg focus:border-2 border-gray-300 px-5 py-3 rounded-xl w-56 transition-all focus:w-64 outline-none"
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
            </div>

            <button
                className="bg-black text-white border border-gray-600 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-110 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group"
                onClick={handleClearInput}
            >
                Изчисти
            </button> */}


}