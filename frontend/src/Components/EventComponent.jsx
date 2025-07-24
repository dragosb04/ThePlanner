import React from 'react';
import './EventList.css';

function getDaysLeftClass(days) {
  if (days <= 3) return "danger";
  if (days <= 15) return "warning";
  return "safe";
}

function EventComponent({ events = []}) {
  const formattedEvents = events.map(event => {
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
      title: event.name,
      date: formattedDate,
      daysLeft: daysLeft < 0 ? 0 : daysLeft,
    };
  });

  return (
    <div className="event-list-container">
      {formattedEvents.map((event, index) => (
        <div key={index} className="event-card">
          <div className="event-details">
            <div className="event-title">{event.title}</div>
            <div className="event-date">{event.date}</div>
          </div>
          <div className="event-countdown">
            <div className={`event-days ${getDaysLeftClass(event.daysLeft)}`}>
              {event.daysLeft}
            </div>
            <div className="days-label">{event.daysLeft === 1 ? 'zi rămasă' : 'zile rămase'}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EventComponent;
