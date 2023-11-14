const connection = require('../config/database');

exports.createUser = async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;
        const query = `INSERT INTO users (fullName, email, password) VALUES ('${fullName}','${email}','${password}')`;
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

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const query = `SELECT * FROM users WHERE email = ?;`;
    try {
        const [response] = await connection.promise().query(query, [email]);
       
        if (!response.length)
            return res.status(400).json({
                success: false,
                message: `User with email ${email} not found`,
            });

        if (password == response[0].password) {
            res.status(200).json({
                success: true,
                message: `User with email ${email} logged in successfully`,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: `Entered password of email ${email} is wrong`,
            });
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `Unable to login for user with email ${email}`,
            error: error.message,
        });
    }
};

exports.updateUser = async (req, res) => {
    const ID = req.params.ID;
    const { fullName = '', email: email, password: password } = req.body;
    try {
        const query = ` UPDATE users SET fullName ='${fullName}', email = '${email}', password = '${password}' WHERE ID=${ID}`;
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
        const [response] = await connection.query(query, [ID]);
        return response;
    } catch (error) {
        return error;
    }
};
