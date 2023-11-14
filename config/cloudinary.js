const cloudinary = require('cloudinary').v2;
          
cloudinary.config({ 
  cloud_name: 'drbtpehij', 
  api_key: '897667149461347', 
  api_secret: 'PaGRXTAEtHPf1BSL4Pbsu8TgO5Y' 
});

module.exports = cloudinary;