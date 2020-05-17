const { Client } = require('pg');

const client = new Client({
    user: 'biotronmaster',
    host: 'localhost',
    database: 'biotron',
    password: 'vsetkyTokeny9',
    port: 5430,
});

client.connect();
