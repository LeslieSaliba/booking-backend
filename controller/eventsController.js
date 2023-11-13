const connection = require('../config/database');

exports.createEvent = async (req, res) => {
    try {
        const { title, date, ticketPrice, description, venueID } = req.body;
        const query = `INSERT INTO events (title, date, ticketPrice, description, venueID) VALUES ('${title}','${date}','${ticketPrice}','${description}', '${venueID}')`;
        const [result] = await connection.promise().query(query);
        res.status(200).json('Event added successfully');
    } catch (error) {
        console.error('An error occured while adding event', error);
        res.status(500).json({ error: 'Server error' });
    }
}

exports.getAllEvents = async (req, res) => {
    try {
        const query = "SELECT * FROM events";
        const [result] = await connection.promise().query(query);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while getting all events" });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const ID = req.params.ID;
        const query = `SELECT * FROM events WHERE ID= ${ID}`;
        const [result] = await connection.promise().query(query);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'An error occured while getting event by ID' });
    }
}

exports.updateEvent = async (req, res) => {
    const ID = req.params.ID;
    const { title, date, ticketPrice, description, venueID } = req.body;
    try {
        const query = `UPDATE events SET title='${title}', date='${date}', ticketPrice=${ticketPrice}, description='${description}', venueID=${venueID} WHERE ID=${ID}`;
        const [result] = await connection.promise().query(query);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating event' });
    }
};

exports.deleteEvent = async (req, res) => {
    const ID = req.params.ID;
    try {
        const query = `DELETE FROM events WHERE ID=${ID}`;
        const [result] = await connection.promise().query(query);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occured while deleting event' });
    }
};
