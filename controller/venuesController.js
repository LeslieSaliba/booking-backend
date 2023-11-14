const connection = require('../config/database');
const cloudinary = require('../config/cloudinary');

exports.createVenue = async (req, res) => {
    try {
        const { name, description, capacity, address } = req.body;
        const b64 = req.file.buffer.toString('base64');
        let image = 'data:' + req.file.mimetype + ';base64,' + b64;
        const url = await cloudinary.uploader.upload(image, { folder: 'venues' })
        const query = `INSERT INTO venues (name, description, capacity, image, address) VALUES ('${name}','${description}',${capacity},'${url.secure_url}', '${address}')`;
        const [result] = await connection.promise().query(query);
        res.status(200).json('Venue added successfully');
    } catch (error) {
        console.error('An error occured while adding venue', error);
        res.status(500).json({ error: 'Server error' });
    }
}

exports.getAllVenues = async (req, res) => {
    try {
        const query = "SELECT * FROM venues";
        const [result] = await connection.promise().query(query);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while getting all venues" });
    }
};

exports.getVenueById = async (req, res) => {
    try {
        const ID = req.params.ID;
        const query = `SELECT * FROM venues WHERE ID= ${ID}`;
        const [result] = await connection.promise().query(query);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'An error occured while getting venue by ID' });
    }
}

exports.updateVenue = async (req, res) => {
    const ID = req.params.ID;
    const { name, description, capacity, image, address } = req.body;
    try {
        const b64 = req.file.buffer.toString('base64');
        let image = 'data:' + req.file.mimetype + ';base64,' + b64;
        const url = await cloudinary.uploader.upload(image, { folder: 'venues' })
        const query = ` UPDATE venues SET name ='${name}', description = '${description}', capacity = '${capacity}', image='${url.secure_url}', address='${address}' WHERE ID=${ID}`;
        const [result] = await connection.promise().query(query);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occured while updating venue' });
    }
};

exports.deleteVenue = async (req, res) => {
    const ID = req.params.ID;
    try {
        const query = `DELETE FROM venues WHERE ID=${ID}`;
        const [result] = await connection.promise().query(query);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occured while deleting venue' });
    }
};
