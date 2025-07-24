const Event = require('../models/event');

exports.createEvent = (req, res) => {
  const eventData = req.body;
  Event.create(eventData, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Event created', eventId: results.insertId });
  });
};

exports.getEvents = (req, res) => {
  Event.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getEventById = (req, res) => {
  Event.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Event not found' });
    res.json(results[0]);
  });
};

exports.updateEvent = (req, res) => {
  const id = req.params.id;
  const eventData = req.body;
  Event.update(id, eventData, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    // Preia eventul actualizat și îl trimite la frontend
    Event.getById(id, (err2, results) => {
      if (err2) return res.status(500).json({ error: err2.message });
      if (results.length === 0) return res.status(404).json({ message: 'Event not found' });
      res.status(200).json(results[0]);
    });
  });
};

exports.deleteEvent = (req, res) => {
  Event.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Event deleted' });
  });
};

exports.getEventsByUserId = (req, res) => {
  const userID = req.params.userID;
  Event.getEventsByUserId(userID, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
}