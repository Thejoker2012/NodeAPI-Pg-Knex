const bodyParser = require('body-parser');
const dotenv = require('dotenv');
//log de migrations
const knexlogger = require('knex-logger');
const cors = require('cors')

dotenv.config();

module.exports = (app) =>{
    
    app.use(bodyParser.json());
    app.use(knexlogger(app.db));
    app.use(cors({origin:'*'}))
    
}

