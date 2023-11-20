const jwt = require('jsonwebtoken');

 const isAuthenticated = (roles) => {
   return (req, res, next) => {
     if (
       !req.headers.authorization ||
       !req.headers.authorization.startsWith('Bearer')
     )
       return res.status(400).json({
         success: false,
         message: 'No authentication credentials provided, unable to check if authenticated.',
       });

     const token = req.headers.authorization.split(' ')[1];

     if (!token)
       return res.status(400).json({
         success: false,
         message: 'No token provided, unable to check if authenticated.',
       });
     try {
       const credentials = jwt.verify(token, process.env.SECRET_VALUE);
       const hasAccess = roles.includes(credentials.role);
       if (!hasAccess)
         return res.status(400).json({
           success: false,
           message: `You are NOT authenticated: your role doesn't allow to complete this action.`,
         });
       next();
     } catch (error) {
       return res.status(400).json({
         success: false,
         message: 'Error occured',
         error: error.message,
       });
     }
   };
 };

 module.exports = isAuthenticated;