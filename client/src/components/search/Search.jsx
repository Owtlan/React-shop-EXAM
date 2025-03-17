import { useState } from "react";



export default function Search({ onSearch }) {

    const [searchQuery, setSearchQuery] = useState('')



    const handleChange = (e) => {
        setSearchQuery(e.target.value)
    }

    const handleSearch = () => {
        onSearch(searchQuery);
    }





    return (
        <div className="mb-4">
            <input
                type="text"
                value={searchQuery}
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
        </div>
    );
}