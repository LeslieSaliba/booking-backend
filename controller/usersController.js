const connection = require('../config/database');

exports.createUser = async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;
        const query = `INSERT INTO users (fullName, email, password, role) VALUES ('${fullName}','${email}','${password}','${role}')`;
        const [result] = await connection.promise().query(query);
        res.status(200).json('User added successfully');
    } catch (error) {
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

exports.getUserByEmailPassword = async (req, res) => {
    try {
        const email = req.params.email;
        const password = req.params.password;
        const query = `SELECT * FROM users WHERE email='${email}'
                        AND password='${password}'`;
        const [result] = await connection.promise().query(query);
        res.status(200).json(result);
    }
    catch (error) {
        console.log(error);
    }
}

exports.updateUser = async (req, res) => {
    const ID = req.params.ID;
    const { fullName = '', email: email, password: password, role: role, } = req.body;
    try {
        const query = ` UPDATE users SET fullName ='${fullName}', email = '${email}', password = '${password}', role='${role}' WHERE ID=${ID}`;
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
