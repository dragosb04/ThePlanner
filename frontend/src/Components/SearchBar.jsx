import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';

function SearchBar({ onSearch }) {
    const [input, setInput] = useState('');

    const handleSearchClick = () => {
        onSearch(input);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearchClick();
        }
    };

    return (
        <div className="search-container">
            <div className="search-box">
                <input
                    id="search-input"
                    type="text"
                    placeholder="Scrie aici..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button onClick={handleSearchClick}>
                    <FaSearch />
                </button>
            </div>
        </div>
    );
}

export default SearchBar;
