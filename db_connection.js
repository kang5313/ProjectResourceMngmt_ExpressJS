const pgp = require('pg-promise')();

const cn = 'postgres://username:password@host:port/database' // change to your db connection
const db = pgp(cn);

module.exports = db