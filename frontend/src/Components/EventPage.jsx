import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import './EventPage.css';
import './Form.css';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

function EventPage() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [creator, setCreator] = useState("");
    const [isEditing, setIsEditing] = useState(false); // <-- adăugat
    const [editedEvent, setEditedEvent] = useState({}); // <-- adăugat
    const token = localStorage.getItem('token');
    const [originalEvent, setOriginalEvent] = useState(null);
    const navigate = useNavigate();
    function getUserIdFromToken(token) {
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.id || payload.userId || null;
        } catch (e) {
            console.error("Eroare la decodarea tokenului:", e);
            return null;
        }
    }

    const userId = getUserIdFromToken(token);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/events/${id}`);
                const data = await res.json();
                setEvent(data);
                setEditedEvent(data); // <-- inițializezi și editable objectul
                setOriginalEvent(data);
                const creatorRes = await fetch(`http://localhost:3000/api/users/${data.creator_id}`);
                const creatorData = await creatorRes.json();
                setCreator(creatorData);
            } catch (error) {
                console.error("Eroare la încărcarea evenimentului:", error);
            }
        };

        fetchEvent();
    }, [id]);

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Ești sigur că vrei să ștergi acest eveniment?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`http://localhost:3000/api/events/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error("Eroare la ștergere");
            }
            alert("Evenimentul a fost șters cu succes.");
            navigate('/'); // sau spre pagina cu lista de evenimente
        } catch (err) {
            console.error("Eroare la ștergere:", err);
            alert("A apărut o eroare la ștergere.");
        }
    };

    const handleChange = (e) => {
        setEditedEvent({ ...editedEvent, [e.target.name]: e.target.value });
    };

    const handleCancel = () => {
        setEditedEvent(originalEvent);
        setIsEditing(false);
    };

    const handleSave = async () => {
        try {
            // Transforma eventDate în format YYYY-MM-DD
            const payload = {
                ...editedEvent,
                eventDate: editedEvent.eventDate
                    ? editedEvent.eventDate.slice(0, 10)
                    : ""
            };

            const res = await fetch(`http://localhost:3000/api/events/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const text = await res.text();

            if (!res.ok) {
                throw new Error("Eroare la salvarea modificărilor.");
            }
            const updated = JSON.parse(text);
            setEvent(updated);
            setIsEditing(false);
        } catch (error) {
            console.error(error);
        }
    };


    if (!event) return <p>Se încarcă evenimentul...</p>;

    return (
        <>
            <Header />
            <div className="event-page-container">
                {isEditing ? (
                    <input
                        type="text"
                        name="name"
                        value={editedEvent.name}
                        onChange={handleChange}
                        className="event-input"
                    />
                ) : (
                    <h1>{event.name}</h1>
                )}

                {isEditing ? (
                    <textarea
                        name="details"
                        value={editedEvent.details}
                        onChange={handleChange}
                        className="event-textarea"
                    />
                ) : (
                    <div className="event-page-description">{event.details}</div>
                )}

                <div className="event-page-info">
                    <div className="event-info-column">
                        <strong>Data</strong>{" "}
                        {isEditing ? (
                            <input
                                type="date"
                                name="eventDate"
                                value={editedEvent.eventDate?.slice(0, 10)}
                                onChange={handleChange}
                            />
                        ) : (
                            new Date(event.eventDate).toLocaleDateString('ro-RO')
                        )}
                    </div>
                    <div className="event-info-column">
                        <strong>Locație</strong>{" "}
                        {isEditing ? (
                            <input
                                type="text"
                                name="location"
                                value={editedEvent.location}
                                onChange={handleChange}
                            />
                        ) : (
                            event.location
                        )}
                    </div>
                    <div className="event-info-column">
                        <strong>Ora</strong>{" "}
                        {isEditing ? (
                            <input
                                type="time"
                                name="eventTime"
                                value={editedEvent.eventTime}
                                onChange={handleChange}
                            />
                        ) : (
                            event.eventTime
                        )}
                    </div>
                </div>

                <div className="event-page-creator">
                    <strong>Creator:</strong>{" "}
                    {creator.profile_picture && (
                        <img
                            src={creator.profile_picture}
                            alt="Creator"
                            className="creator-img"
                        />
                    )}{" "}
                    {creator.username || "Necunoscut"}
                </div>


                {isEditing ? (
                    <>
                        <div className="event-page-actions">
                            <button onClick={handleSave} className="action-btn">Salvează</button>
                            <button onClick={handleCancel} className="action-btn">Anulează</button>
                        </div>
                    </>
                ) : (
                    <>
                        {token && userId === creator.id && (
                            <>
                                <div className="event-page-actions">
                                    <button onClick={() => setIsEditing(true)} className="action-btn">Editează</button>
                                    <button className="action-btn delete" onClick={handleDelete}>
                                        Șterge Evenimentul
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                )}

            </div>
            <BottomNav />
        </>
    );
}

export default EventPage;
