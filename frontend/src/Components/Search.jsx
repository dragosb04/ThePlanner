import { useState, useEffect } from 'react';
import BottomNav from './BottomNav';
import EventComponent from './EventComponent';
import Header from './Header';
import SearchBar from './SearchBar'; // ✅ import nou
import './Search.css';

function Search() {
    const [query, setQuery] = useState('');
    const [events, setEvents] = useState([]);
    const [searched, setSearched] = useState(false);
    const [message, setMessage] = useState('');

    const handleSearch = async (input) => {
        const trimmed = input.trim();
        setQuery(input); // ✅ actualizăm și query-ul (pt. mesaj)
        
        if (!trimmed) {
            setEvents([]);
            setSearched(true);
            return;
        }

        try {
            const response = await fetch(`/api/events/search?q=${encodeURIComponent(trimmed)}`);
            const data = await response.json();
            setEvents(data);
            setSearched(true);
        } catch (error) {
            console.error('Eroare la căutare:', error);
            setEvents([]);
            setSearched(true);
        }
    };

    useEffect(() => {
        if (searched) {
            if (!query.trim()) {
                setMessage('Introdu un termen pentru căutare.');
            } else if (events.length === 0) {
                setMessage(`Nu există evenimente pentru căutarea "${query}"`);
            } else {
                setMessage(`Rezultate pentru "${query}"`);
            }
        }
    }, [events, searched]);

    return (
        <>
            <Header title="Căutare Evenimente" />
            <BottomNav />
                <SearchBar onSearch={handleSearch} /> {/* ✅ componentă reutilizabilă */}
                {searched && <h2 className="result-title">{message}</h2>}
                <EventComponent events={events} />

        </>
    );
}

export default Search;
