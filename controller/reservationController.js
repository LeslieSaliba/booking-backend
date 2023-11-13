const connection = require('../config/database');

exports.createReservation = async (req, res) => {
    try {
        const { eventID, userID } = req.body;
        const query = `INSERT INTO reservation (eventID, userID) VALUES (${eventID},${userID})`;
        const [result] = await connection.promise().query(query);
        res.status(200).json('Reservation added successfully');
    } catch (error) {
        console.error('An error occured while adding reservation', error);
        res.status(500).json({ error: 'Server error' });
    }
}

// exports.getAllReservations = async (req, res) => {
//     try {
//         const query = "SELECT * FROM reservation";
//         const [result] = await connection.promise().query(query);
//         res.status(200).json(result);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: "An error occurred while getting all reservations" });
//     }
// };

exports.getAllReservations = async (req, res) => {
    try {
        const query = `SELECT 
        users.fullName,
        users.email,
        users.role,
        events.ID AS eventID,
        events.title,
        events.date,
        events.ticketPrice,
        events.description AS eventDescription,
        venues.ID AS venueID,
        venues.name AS venueName,
        venues.description AS venueDescription,
        venues.capacity,
        venues.image,
        venues.address
            FROM reservation
        JOIN users ON reservation.userID = users.ID
        JOIN events ON reservation.eventID = events.ID
        JOIN venues ON events.venueID = venues.ID;`;
        
        const [result] = await connection.promise().query(query);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while getting all reservations" });
    }
};

exports.getReservationById = async (req, res) => {
    try {
        const ID = req.params.ID;
        const query = `SELECT * FROM reservation WHERE ID= ${ID}`;
        const [result] = await connection.promise().query(query);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'An error occured while getting reservation by ID' });
    }
}

exports.getReservationsByUser = async (req, res) => {
    try {
        const ID = req.params.ID;
        const query = `SELECT * FROM reservation WHERE userID=${ID}`;
        const [result] = await connection.promise().query(query);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while getting all reservations by user" });
    }
};

exports.getReservationsByEvent = async (req, res) => {
    try {
        const ID = req.params.ID;
        const query = `SELECT * FROM reservation WHERE eventID=${ID}`;
        const [result] = await connection.promise().query(query);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while getting all reservations by event" });
    }
};

exports.updateReservation = async (req, res) => {
    const ID = req.params.ID;
    const { eventID, userID } = req.body;
    try {
        const query = `UPDATE reservation SET eventID=${eventID}, userID=${userID} WHERE ID=${ID}`;
        const [result] = await connection.promise().query(query);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating reservation' });
    }
};

exports.deleteReservation = async (req, res) => {
    const ID = req.params.ID;
    try {
        const query = `DELETE FROM reservation WHERE ID=${ID}`;
        const [result] = await connection.promise().query(query);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occured while deleting reservation' });
    }
};