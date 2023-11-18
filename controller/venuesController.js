const connection = require('../config/database');
const cloudinary = require('../config/cloudinary');
const { imageUploader } = require('../extra/imageUploader');

exports.createVenue = async (req, res) => {
    const { name, description, capacity, address } = req.body;
    const query = `INSERT INTO venues (name, description, capacity, image, address) VALUES (?, ?, ?, ?, ?);`;

    const missingFields = [];
    if (!name) missingFields.push("name");
    if (!description) missingFields.push("description");
    if (!capacity || isNaN(capacity)) missingFields.push("capacity");
    if (!req.file || !req.file.buffer) {
        missingFields.push("image");
    }
    if (!address) missingFields.push("address");
    if (missingFields.length > 0) {
        const errorMessage = missingFields.map(field => {
            if (field === "capacity") {
                return "capacity should be a number";
            }
            return `please provide ${field}`;
        }).join(', ');

        return res.status(400).json({
            success: false,
            message: `Please correct the following: ${errorMessage}`,
        });
    }

    try {
        const imageURL = await imageUploader(req.file);
        const [result] = await connection.promise().query(query, [
            name,
            description,
            capacity,
            imageURL,
            address,
        ]);

        const [venue] = await getVenueInfo(result.insertId);
        res.status(200).json({
            success: true,
            message: `Venue added successfully`,
            data: venue,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `An error occurred while adding venue`,
            error: error.message,
        });
    }
};

exports.getAllVenues = async (_, res) => {
    const query = "SELECT * FROM venues";
    try {
        const [result] = await connection.promise().query(query);
        if (!result.length)
            return res.status(400).json({
                success: false,
                message: `There are no venues yet.`
            });
        return res.status(200).json({
            success: true,
            message: `All venues retrieved successfully`,
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `An error occurred while getting all venues`,
            error: error.message,
        });
    }
};

exports.getVenueById = async (req, res) => {
    const { ID } = req.params;
    try {
        const result = await getVenueInfo(ID);
        if (!result.length)
            return res.status(400).json({
                success: false,
                message: `Couldn't find any venue with ID ${ID}`
            });
        return res.status(200).json({
            success: true,
            message: `Venue with ID ${ID} retrieved successfully`,
            data: result,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: `An error occured while getting venue with ID ${ID}`,
            error: error.message,
        });
    }
}

exports.updateVenue = async (req, res) => {
    const { ID } = req.params;
    const { name, description, capacity, image, address } = req.body;
    const query = `UPDATE venues SET name = ?, description = ?, capacity = ?, image = ?, address = ? WHERE ID = ?;`;
    let imageURL = '';

    const missingFields = [];
    if (!name) missingFields.push("name");
    if (!description) missingFields.push("description");
    if (!capacity || isNaN(capacity)) missingFields.push("capacity");
    if (!address) missingFields.push("address");
    if (!req.file || !req.file.buffer) {
        missingFields.push("image");
    }
    if (missingFields.length > 0) {
        const errorMessage = missingFields.map(field => {
            if (field === "capacity") {
                return "capacity should be a number";
            }
            return `please provide ${field}`;
        }).join(', ');

        return res.status(400).json({
            success: false,
            message: `Please correct the following: ${errorMessage}`,
        });
    }

    try {
        if (req.file) {
            imageURL = await imageUploader(req.file);
        } else {
            imageURL = image;
        }
        const [result] = await connection.promise().query(query, [
            name,
            description,
            capacity,
            imageURL,
            address,
            ID,
        ]);

        const venue = await getVenueInfo(ID);
        res.status(200).json({
            success: true,
            message: `Venue with ID ${ID} updated successfully`,
            data: venue[0],
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `An error occurred while updating venue with ID ${ID}`,
            error: error.message,
        });
    }
};

exports.deleteVenue = async (req, res) => {
    const { ID } = req.params;
    const query = `DELETE FROM venues WHERE ID=?`;
    try {
        const [result] = await connection.promise().query(query, [ID]);
        if (!result.affectedRows)
            return res.status(400).json({
                success: false,
                message: `Couldn't find any venue with ID ${ID}`,
            });
        return res.status(200).json({
            success: true,
            message: `Venue with ID ${ID} deleted successfully`,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `An error occured while deleting venue with ID ${ID}`,
            error: error.message,
        });
    }
};

const getVenueInfo = async (ID) => {
    const query = `SELECT * FROM venues WHERE ID = ?;`;
    try {
        const [result] = await connection.promise().query(query, [ID]);
        return result;
    } catch (error) {
        return error.message;
    }
};