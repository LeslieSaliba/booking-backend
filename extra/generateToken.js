const jwt = require('jsonwebtoken');

exports.generateToken = (ID, role) => {
    const token = jwt.sign(
        { ID, role },
        process.env.SECRET_VALUE, {
        expiresIn: '1h'
    }
    );
    return token;
};