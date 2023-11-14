const jwt = require('jsonwebtoken');
const connection = require('./database');

const authenticated = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({ error: "Authorization token required" });
    const token = authorization.split(' ')[1];
    try {
        const { ID } = jwt.verify(token, process.env.SECRET_VALUE);
        const [rows] = await connection.promise().query('SELECT ID, role FROM users WHERE ID = ?', [ID]);
        if (rows.length === 0) {
            console.log(await ID);
            return res.status(401).json({ error: "User not found" });
        }
        req.user = rows[0];
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: "Forbidden access: your request is not authorized." })
    }
}
module.exports = authenticated;