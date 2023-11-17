const connection = require('../config/database');
const cloudinary = require('../config/cloudinary');
const { imageUploader } = require('../extra/imageUploader');

// exports.createVenue = async (req, res) => {
//     try {
//         const { name, description, capacity, address } = req.body;
//         const b64 = req.file.buffer.toString('base64');
//         let image = 'data:' + req.file.mimetype + ';base64,' + b64;
//         const url = await cloudinary.uploader.upload(image, { folder: 'venues' })
//         const query = `INSERT INTO venues (name, description, capacity, image, address) VALUES ('${name}','${description}',${capacity},'${url.secure_url}', '${address}')`;
//         const [result] = await connection.promise().query(query);
//         res.status(200).json('Venue added successfully');
//     } catch (error) {
//         console.error('An error occured while adding venue', error);
//         res.status(500).json({ error: 'Server error' });
//     }
// }

exports.createVenue = async (req, res) => {
    const { name, description, capacity, address } = req.body;
    const query = `INSERT INTO venues (name, description, capacity, image, address) VALUES (?, ?, ?, ?, ?);`;
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
            message: `An error occured while adding venue`,
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

// exports.updateVenue = async (req, res) => {
//     const ID = req.params.ID;
//     const { name, description, capacity, image, address } = req.body;
//     try {
//         const b64 = req.file.buffer.toString('base64');
//         let image = 'data:' + req.file.mimetype + ';base64,' + b64;
//         const url = await cloudinary.uploader.upload(image, { folder: 'venues' })
//         const query = ` UPDATE venues SET name ='${name}', description = '${description}', capacity = '${capacity}', image='${url.secure_url}', address='${address}' WHERE ID=${ID}`;
//         const [result] = await connection.promise().query(query);
//         res.status(200).json(result);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'An error occured while updating venue' });
//     }
// };

exports.updateVenue = async (req, res) => {
    const { ID } = req.params;
    const { name, description, capacity, image, address } = req.body;
    const query = `UPDATE venues SET name = ?, description = ?, capacity = ?, image = ?, address = ? WHERE ID = ?;`;
    let imageURL = '';
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
            message: `An error occured while updating venue with ID ${ID}`,
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