import Header from './Header';
import BottomNav from './BottomNav';
import './EventList.css';
import useCurrentUser from "../Hooks/useCurrentUser";
import { MdModeEdit } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function getDaysLeftClass(days) {
    if (days <= 3) return "danger";
    if (days <= 15) return "warning";
    return "safe";
}

function MyEvents() {
    const user = useCurrentUser();
    const [events, setEvents] = useState([]);

    useEffect(() => {
        if (user?.id) {
            fetch(`http://localhost:3000/api/events/user/${user.id}`)
                .then(res => res.json())
                .then((data) => {
                    const formatted = data.map(event => {
                        const eventDate = new Date(event.eventDate);
                        const today = new Date();
                        const timeDiff = eventDate - today;
                        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

                        const formattedDate = eventDate.toLocaleDateString('ro-RO', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                        }) + (event.eventTime ? `, ${event.eventTime.slice(0, 5)}` : '');

                        return {
                            id: event.id,
                            title: event.name,
                            date: formattedDate,
                            daysLeft: daysLeft < 0 ? 0 : daysLeft,
                        };
                    });
                    setEvents(formatted);
                })
                .catch(err => console.error("Failed to fetch events", err));
        }
    }, [user]);

    if (!user) return <p>Se încarcă...</p>;

    return (
        <>
            <Header />
            <div className="event-list-container">
                {events.length === 0 ? (
                    <h2 className="event-list-title">Nu ai niciun eveniment</h2>
                ) : (
                    <>
                        {events.map((event, index) => (
                            <Link to={`/event/${event.id}`} key={index} className="event-card">
                                <div className="event-details">
                                    <div className="event-title">{event.title}</div>
                                    <div className="event-date">{event.date}</div>
                                </div>
                                <div className="event-countdown">
                                    <div className={`event-days ${getDaysLeftClass(event.daysLeft)}`}>
                                        {event.daysLeft}
                                    </div>
                                    <div className="days-label">zile rămase</div>
                                </div>
                            </Link>
                        ))}
                    </>
                )}
            </div>
            <BottomNav />
        </>
    );
}

export default MyEvents;
