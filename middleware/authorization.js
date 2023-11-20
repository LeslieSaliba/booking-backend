// function authorize(role) {
//     return (req, res, next) => {
//         if (req.user && req.user.role === role) {
//             next();
//         } else {
//             return res.status(403).json({ message: `Access forbidden: your role doesn't allow to complete this action.` });
//         }
//     };
// }

// module.exports = authorize; 