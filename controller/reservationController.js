const connection = require('../config/database');
const { getUserById } = require('./usersController');

exports.createReservation = async (req, res) => {
    const { eventID, userID } = req.body;
    const query = `INSERT INTO reservations (eventID, userID) VALUES (${eventID},${userID})`;
    try {
        const [result] = await connection.promise().query(query);
        const [reservation] = await getReservationInfo(result.insertId);
        res.status(200).json({
            success: true,
            message: `Reservation added successfully`,
            data: reservation,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `An error occured while adding reservation for the user with ID ${userID} in event with ID ${eventID}`,
            error: error.message,
        });
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

exports.getAllReservations = async (_, res) => {
    const query = `SELECT reservations.ID AS reservationID, reservations.userID, users.fullName, users.email, users.role, reservations.eventID, events.title, events.date, events.ticketPrice, events.description, events.venueID, venues.name, venues.description,venues.capacity,venues.image,venues.address
                    FROM reservations
                    INNER JOIN users ON users.ID = reservations.userID
                    INNER JOIN events ON events.ID = reservations.eventID
                    INNER JOIN venues ON venues.ID = events.venueID;`;
    try {
        const [result] = await connection.promise().query(query);
        if (!result.length)
            return res.status(400).json({
                success: false,
                message: `There are no reservations yet.`
            });
        res.status(200).json({
            success: true,
            message: `All reservations retrieved successfully`,
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `An error occurred while getting all reservations`,
            error: error.message,
        });
    }
};

exports.getReservationById = async (req, res) => {
    const ID = req.params.ID;
    try {
        const result = await getReservationInfo(ID);
        if (!result.length)
            return res.status(400).json({
                success: false,
                message: `Couldn't find any reservation with ID ${ID}`
            });
        return res.status(200).json({
            success: true,
            message: `Reservation of ID ${ID} retrieved successfully `,
            data: result[0],
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: `An error occured while getting reservation with ID ${ID}`,
            error: error.message,
        });
    }
}

exports.getReservationsByUser = async (req, res) => {
    const ID = req.params.ID;
    const queryUser = getUserById(ID);
    const query = `SELECT reservations.ID AS reservationID, reservations.userID, users.fullName, users.email, users.role, reservations.eventID, events.title, events.date, events.ticketPrice, events.description, events.venueID, venues.name, venues.description,venues.capacity,venues.image,venues.address
                    FROM reservations
                    INNER JOIN users ON users.ID = reservations.userID
                    INNER JOIN events ON events.ID = reservations.eventID
                    INNER JOIN venues ON venues.ID = events.venueID
                    WHERE reservations.userID = ?;`;
    try {
        // const user = await connection.promise().query(queryUser, [ID]);
        // if (!user || user.length === 0) {
        //     return res.status(400).json({
        //         success: false,
        //         message: `There is no user with ID ${ID}`
        //     });
        // }
        const [result] = await connection.promise().query(query, [ID]);
        if (!result.length)
            res.status(400).json({
                success: false,
                message: `There are no reservations for user with ID ${ID} yet.`
            });
        return res.status(200).json({
            success: true,
            message: `All reservations for user with ID ${ID} retrieved successfully `,
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `An error occurred while getting all reservations by user with ID ${ID}`,
            error: error.message,
        });
    }
};

exports.getReservationsByEvent = async (req, res) => {
    const { ID } = req.params;
    const query = `SELECT reservations.ID AS reservationID, reservations.userID, users.fullName, users.email, users.role, reservations.eventID, events.title, events.date, events.ticketPrice, events.description, events.venueID, venues.name, venues.description,venues.capacity,venues.image,venues.address
                      FROM reservations
                      INNER JOIN users ON users.ID = reservations.userID
                      INNER JOIN events ON events.ID = reservations.eventID
                      INNER JOIN venues ON venues.ID = events.venueID
                      WHERE reservations.eventID = ?;`;
    try {
        const [result] = await connection.promise().query(query, [ID]);
        res.status(200).json({
            success: true,
            message: `All reservations for event with ID ${ID} retrieved successfully `,
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `An error occurred while getting all reservations by event ID ${ID}`,
            error: error.message,
        });
    }
};

exports.updateReservation = async (req, res) => {
    const ID = req.params.ID;
    const { eventID, userID } = req.body;
    try {
        const query = `UPDATE reservations SET eventID=${eventID}, userID=${userID} WHERE ID=${ID}`;
        const [result] = await connection.promise().query(query);

        if (!result.affectedRows)
            return res.status(400).json({
                success: false,
                message: `Couldn't find any reservation with ID ${ID}`,
            });
        const reservation = await getReservationInfo(ID);
        res.status(200).json({
            success: true,
            message: `Reservation with ID ${ID} updated successfully`,
            data: reservation[0],
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `An error occurred while updating reservation with ID ${ID}`,
            error: error.message,
        });
    }
};

exports.deleteReservation = async (req, res) => {
    const ID = req.params.ID;
    const query = `DELETE FROM reservations WHERE ID=${ID}`;
    try {
        const [result] = await connection.promise().query(query);
        if (!result.affectedRows)
            return res.status(400).json({
                success: false,
                message: `Couldn't find any reservation with ID ${ID}`,
            });
        return res.status(200).json({
            success: true,
            message: `Reservation with ID ${ID} deleted successfully`,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `An error occured while deleting reservation with ID ${ID}`,
            error: error.message,
        });
    }
};

const getReservationInfo = async (ID) => {
    const query = `SELECT reservations.ID AS reservationID, reservations.userID, users.fullName, users.email, users.role, reservations.eventID, events.title, events.date, events.ticketPrice, events.description, events.venueID, venues.name, venues.description,venues.capacity,venues.image,venues.address
                      FROM reservations
                      INNER JOIN users ON users.ID = reservations.userID
                      INNER JOIN events ON events.ID = reservations.eventID
                      INNER JOIN venues ON venues.ID = events.venueID
                      WHERE reservations.ID = ?;`;
    try {
        const [result] = await connection.promise().query(query, [ID]);
        return result;
    } catch (error) {
        return error;
    }
};