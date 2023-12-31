const connection = require('../config/database');

exports.createEvent = async (req, res) => {
    const { title, date, ticketPrice, description, venueID } = req.body;
    const missingFields = [];
    if (!title) missingFields.push("title");
    if (!date) missingFields.push("date");
    if (ticketPrice === undefined || isNaN(ticketPrice)) missingFields.push("ticketPrice");
    if (!description) missingFields.push("description");
    if (!venueID || isNaN(venueID)) missingFields.push("venueID");
    if (missingFields.length > 0) {
        const errorMessage = missingFields.map(field => {
            if (field === "ticketPrice") {
                return "ticketPrice should be a number";
            } else if (field === "venueID") {
                return "venueID should be a number";
            }
            return `please provide ${field}`;
        }).join(', ');

        return res.status(400).json({
            success: false,
            message: `Please correct the following: ${errorMessage}`,
        });
    }

    const query = `INSERT INTO events (title, date, ticketPrice, description, venueID) VALUES ('${title}','${date}',${ticketPrice},'${description}', ${venueID})`;
    const venueQuery = `SELECT * FROM venues WHERE ID = ?`;

    try {
        const [venueResult] = await connection.promise().query(venueQuery, [venueID]);
        if (!venueResult.length) {
            return res.status(400).json({
                success: false,
                message: `There is no venue with ID ${venueID}`,
            });
        }

        const [result] = await connection.promise().query(query);
        const data = await getEventInfo(result.insertId);
        if (!Array.isArray(data)) throw new Error(`An error occurred while adding event.`);
        return res.status(200).json({
            success: true,
            message: `Event added successfully.`,
            data: data[0]
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `An error occurred while adding event.`,
            error: error.message,
        });
    }
}

exports.getAllEvents = async (_, res) => {
    const query = "SELECT * FROM events";
    try {
        const [result] = await connection.promise().query(query);
        if (!result.length)
            return res.status(400).json({
                success: false,
                message: `There are no events yet.`
            });
        return res.status(200).json({
            success: true,
            message: `All events retrieved successfully.`,
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `An error occurred while getting all events.`,
            error: error.message,
        });
    }
};

exports.getEventById = async (req, res) => {
    const ID = req.params.ID;
    try {
        const result = await getEventInfo(ID);
        if (!result.length)
            return res.status(400).json({
                success: false,
                message: `Couldn't find any event with ID ${ID}`
            });
        return res.status(200).json({
            success: true,
            message: `Event with ID ${ID} retrieved successfully.`,
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `An error occurred while retrieving the event with ID ${ID}.`,
            error: error.message
        });
    };
};

exports.updateEvent = async (req, res) => {
    const { ID } = req.params;
    const { title, date, ticketPrice, description, venueID } = req.body;
    const query = `UPDATE events SET title = ?, date = ?, ticketPrice = ?, description = ?, venueID = ? WHERE ID = ?`;
    const venueQuery = `SELECT * FROM venues WHERE ID = ?`;

    const missingFields = [];
    if (!title) missingFields.push("title");
    if (!date) missingFields.push("date");
    if (ticketPrice === undefined || isNaN(ticketPrice)) missingFields.push("ticketPrice");
    if (!description) missingFields.push("description");
    if (!venueID || isNaN(venueID)) missingFields.push("venueID");
    if (missingFields.length > 0) {
        const errorMessage = missingFields.map(field => {
            if (field === "ticketPrice") {
                return "ticketPrice should be a number";
            } else if (field === "venueID") {
                return "venueID should be a number";
            }
            return `please provide ${field}`;
        }).join(', ');

        return res.status(400).json({
            success: false,
            message: `Please correct the following: ${errorMessage}`,
        });
    }

    try {
        const [venueResult] = await connection.promise().query(venueQuery, [venueID]);
        if (!venueResult.length) {
            return res.status(400).json({
                success: false,
                message: `There is no venue with ID ${venueID}`,
            });
        }

        const [response] = await connection.promise().query(query, [
            title,
            date,
            ticketPrice,
            description,
            venueID,
            ID,
        ]);
        if (!response.affectedRows)
            return res.status(400).json({
                success: false,
                message: `Couldn't find any event with ID ${ID}.`,
            });

        const event = await getEventInfo(ID);
        return res.status(200).json({
            success: true,
            message: `Event with ID ${ID} updated successfully.`,
            data: event[0]
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `An error occurred while updating event with ID ${ID}.`,
            error: error.message,
        });
    }
};

exports.deleteEvent = async (req, res) => {
    const ID = req.params.ID;
    const query = `DELETE FROM events WHERE ID=?`;
    try {
        const [result] = await connection.promise().query(query, [ID]);
        if (!result.affectedRows)
            return res.status(400).json({
                success: false,
                message: `Couldn't find any event with ID ${ID}.`,
            });
        return res.status(200).json({
            success: true,
            message: `Event with ID ${ID} deleted successfully.`,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `An error occured while deleting event with ID ${ID}.`,
            error: error.message,
        });
    }
};

const getEventInfo = async (ID) => {
    const query = `SELECT * FROM events WHERE ID = ?`;
    try {
        const [result] = await connection.promise().query(query, [ID]);
        return result;
    } catch (error) {
        return error.message;
    }
};