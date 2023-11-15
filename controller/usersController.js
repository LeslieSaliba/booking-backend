const connection = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../extra/generateToken');
require('dotenv').config();

exports.createUser = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `INSERT INTO users (fullName, email, password) VALUES ('${fullName}','${email}','${hashedPassword}')`;
        const [result] = await connection.promise().query(query);
        if (!result) {
            throw new Error(`An error occured while adding user`);
        }
        const user = result[0];
        generateToken(user);
        res.status(200).json('User added successfully ', 'user: ', user, 'token: ', token);
    }
    catch (error) {
        console.error('An error occured while adding user', error);
        res.status(500).json({ error: 'Server error' });
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const query = "SELECT * FROM users";
        const [result] = await connection.promise().query(query);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while getting all users" });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const ID = req.params.ID;
        const query = `SELECT * FROM users WHERE ID= ${ID}`;
        const [result] = await connection.promise().query(query);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'An error occured while getting user by ID' });
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const query = `SELECT * FROM users WHERE email = ?;`;
    try {
        const [response] = await connection.promise().query(query, [email]);

        if (!response.length)
            return res.status(400).json({
                success: false,
                message: `Couldn't find any user linked to ${email} `,
            });

        const user = response[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch)
            return res.status(400).json({
                success: false,
                message: `Incorrect password for user linked to ${email}`,
            });
        const token = generateToken(user);
        res.status(200).json({
            success: true,
            message: `User linked to ${email} logged in successfully`, token, user
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `An error occured while login user linked to ${email}`,
            error: error.message,
        });
    }
};

exports.updateUser = async (req, res) => {
    const ID = req.params.ID;
    const { email: email, password: password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const query = ` UPDATE users SET email = '${email}', password = '${hashedPassword}' WHERE ID=${ID}`;
        const [result] = await connection.promise().query(query);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occured while updating user' });
    }
};

exports.deleteUser = async (req, res) => {
    const ID = req.params.ID;
    try {
        const query = `DELETE FROM users WHERE ID=${ID}`;
        const [result] = await connection.promise().query(query);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occured while deleting user' });
    }
};

exports.switchToAdmin = async (req, res) => {
    const { ID } = req.params;
    const query = `UPDATE users SET role = 'admin' WHERE ID = ?;`;

    try {
        const [response] = await connection.promise().query(query, [ID]);
        if (!response.affectedRows)
            return res.status(400).json({
                success: false,
                message: `User with ID = ${ID} not found`,
            });
        const data = await getUserInfo(ID);
        res.status(200).json({
            success: true,
            message: `User with ID = ${ID} switched to admin successfully`,
            data: data[0],
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `Unable to switch to admin for user with ID = ${ID}`,
            error: error.message,
        });
    }
};


const getUserInfo = async (ID) => {
    const query = `SELECT ID, fullName, email, role FROM users WHERE ID = ?;`;
    try {
        const [response] = await connection.promise().query(query, [ID]);
        return response;
    } catch (error) {
        return error;
    }
};
