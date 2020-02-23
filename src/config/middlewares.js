const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

module.exports = (app) =>{
    app.use(bodyParser.json());
}

