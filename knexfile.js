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

        //Diretório onde ficaram as tabelas migrations
        migrations: {
            directory:'src/migration',
        },

        //Diretório para arquivos de popular as tabelas
        seeds: {
            directory:'src/seeds',
        }
    },
};

