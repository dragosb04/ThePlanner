import Header from "./Header";
import './Form.css';
import BottomNav from "./BottomNav";
import './AddEvent.css';
import './EventList.css';
import { useState, useEffect } from 'react';
import useCurrentUser from "../Hooks/useCurrentUser";

function AddEvent() {
    const user = useCurrentUser();
    const [data, setData] = useState({
        name: '',
        eventDate: '',
        eventTime: '',
        location: '',
        details: '',
        creator_id: user ? user.id : null,
    });

    useEffect(() => {
        if (!user) {
            setData(prev => ({ ...prev, message: 'Trebuie să fii autentificat pentru a adăuga un eveniment.' }));
        }
        else {
            setData(prev => ({ ...prev, creator_id: user.id }));
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/events/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Eveniment adăugat cu succes!');
            setData({
                name: '',
                eventDate: '',
                eventTime: '',
                location: '',
                details: '',
                creator_id: user ? user.id : null,
            });
        }
        else {
            alert(result.message || 'Eroare la adăugarea evenimentului.');
        }

    };
    return (
        <>
            <Header />
            <div className="form-box">
                <form onSubmit={handleSubmit} className="form-group">
                    <div className="form-group">
                        <label>Titlu eveniment:</label>
                        <input type="text"
                            name="name"
                            value={data.name}
                            onChange={handleInputChange}
                            required />
                    </div>
                    <div className="form-group">
                        <label>Locație:</label>
                        <input type="text"
                            name="location"
                            value={data.location}
                            onChange={handleInputChange}
                            required />
                    </div>
                    <div className="form-group">
                        <label>Dată:</label>
                        <input type="date"
                            name="eventDate"
                            value={data.eventDate}
                            onChange={handleInputChange}
                            required />
                    </div>
                    <div className="form-group">
                        <label>Oră</label>
                        <input type="time"
                            name="eventTime"
                            value={data.eventTime}
                            onChange={handleInputChange}
                            required />
                    </div>
                    <div className="form-group">
                        <textarea className="event-description"
                            name="details"
                            inputMode="text"
                            value={data.details}
                            onChange={handleInputChange}
                            placeholder="Descriere eveniment"></textarea>
                    </div>
                    <button type="submit">Adaugă Eveniment</button>
                </form>
                <div style={{ marginTop: '20px', fontSize: '14px' }}>
                    <p>După adăugarea evenimentului, acesta va fi vizibil în lista ta de evenimente.</p>
                </div>
            </div>
            <BottomNav />
        </>
    );
}

export default AddEvent;