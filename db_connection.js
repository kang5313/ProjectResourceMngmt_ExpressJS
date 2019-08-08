const pgp = require('pg-promise')();

const cn = 'postgres://postgres:qawsed@localhost:5432/ProjectResourceMngmt' // change to your db connection
const db = pgp(cn);

module.exports = db