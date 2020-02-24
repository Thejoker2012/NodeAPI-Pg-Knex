var dotenv = require('dotenv');
dotenv.config();

module.exports = {
    
    test: {
        client: 'pg',
        version: '9.6',
        
        connection: {
            host:process.env.KNEX_HOST,
            user:process.env.KNEX_USER,
            password:process.env.KNEX_PASSWORD,
            database:process.env.KNEX_DATABASE
        },

        migrations: {
            directory:'src/migration',
        },
    },
};

