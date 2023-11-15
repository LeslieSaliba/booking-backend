const jwt = require('jsonwebtoken');

exports.generateToken = (user) => {
    const token = jwt.sign(
        { user },
        process.env.SECRET_VALUE, {
        expiresIn: '1h'
    }
    );
    return token;
};