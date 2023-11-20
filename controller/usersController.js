const connection = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../extra/generateToken');
require('dotenv').config();

exports.createUser = async (req, res) => {
    const { fullName, email, password } = req.body;

    const missingFields = [];
    if (!fullName) missingFields.push("fullName");
    if (!email) missingFields.push("email");
    if (!password) missingFields.push("password");

    if (missingFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Please provide: ${missingFields.join(', ')}`,
        });
    }

    const duplicateEmailnQuery = `SELECT * FROM users WHERE email = ?`;

    try {
        const [duplicateEmail] = await connection.promise().query(duplicateEmailnQuery, [email]);
        if (duplicateEmail.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Email is already linked to another account`,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `INSERT INTO users (fullName, email, password) VALUES (?, ?, ?)`;
        const [result] = await connection.promise().query(query, [fullName, email, hashedPassword]);
        if (!result) {
            throw new Error(`An error occured while adding user`);
        }
        const [data] = await getUserInfo(result.insertId);
        res.status(200).json({
            success: true,
            message: `User registered successfully`,
            data,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: `An error occured while adding user`,
            error: error.message,
        });
    }
}

exports.getAllUsers = async (_, res) => {
    const query = "SELECT ID, fullName, email, role FROM users";
    try {
        const [result] = await connection.promise().query(query);
        if (!result.length)
            return res.status(400).json({
                success: false,
                message: `There are no users yet.`
            });
        res.status(200).json({
            success: true,
            message: `All users retrieved successfully `,
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `An error occurred while getting all users`,
            error: error.message,
        });
    }
};

exports.getUserById = async (req, res) => {
    const { ID } = req.params;
    try {
        const [result] = await getUserInfo(ID);
        if (!result.length)
            return res.status(400).json({
                success: false,
                message: `There is no user with ID ${ID} (yet).`
            });
        return res.status(200).json({
            success: true,
            message: `User of with ${ID} retrieved successfully`,
            data: result[0],
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: `An error occured while getting user by ID ${ID}`,
            error: error.message,
        });
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const query = `SELECT * FROM users WHERE email = ?;`;
    try {
        const [result] = await connection.promise().query(query, [email]);

        if (!result.length)
            return res.status(400).json({
                success: false,
                message: `Couldn't find any user linked to ${email} `,
            });

        const user = result[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch)
            return res.status(400).json({
                success: false,
                message: `Incorrect password for user linked to ${email}`,
            });
        const token = generateToken(user.ID, user.role);
        res.status(200).json({
            success: true,
            message: `User linked to ${email} logged in successfully`,
            token,
            user
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
    const { ID } = req.params;
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `UPDATE users SET email = '${email}', password = '${hashedPassword}' WHERE ID=${ID}`;
    const duplicateEmailQuery = `SELECT * FROM users WHERE email = ? AND ID <> ?`;

    try {
        if (email) {
            const [duplicateEmail] = await connection.promise().query(duplicateEmailQuery, [email, ID]);
            if (duplicateEmail.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Email is already linked to another account`,
                });
            }
        }

        const [result] = await connection.promise().query(query);
        if (!result.affectedRows)
            return res.status(400).json({
                success: false,
                message: `Couldn't find any user with ID ${ID}`,
            });
        const user = await getUserInfo(ID);
        res.status(200).json({
            success: true,
            message: `User with ID ${ID} updated successfully`,
            data: user[0],
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `An error occured while updating user with ID ${ID}`,
            error: error.message,
        });
    }
};

exports.deleteUser = async (req, res) => {
    const { ID } = req.params;
    const query = `DELETE FROM users WHERE ID=?`;
    try {
        const [result] = await connection.promise().query(query, [ID]);
        if (!result.affectedRows)
            return res.status(400).json({
                success: false,
                message: `Couldn't find any user with ID ${ID}`,
            });
        return res.status(200).json({
            success: true,
            message: `User with ID ${ID} deleted successfully`,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `An error occured while deleting user with ID ${ID}`,
            error: error.message,
        });
    }
};

exports.switchToAdmin = async (req, res) => {
    const { ID } = req.params;
    const query = `UPDATE users SET role = 'admin' WHERE ID = ?;`;
    try {
        const [result] = await connection.promise().query(query, [ID]);
        if (!result.affectedRows)
            return res.status(400).json({
                success: false,
                message: `Couldn't find any user with ID ${ID}`,
            });
        const user = await getUserInfo(ID);
        res.status(200).json({
            success: true,
            message: `User with ID ${ID} switched to admin successfully`,
            data: user[0],
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `An error occured while switching user with ID ${ID} to admin`,
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
