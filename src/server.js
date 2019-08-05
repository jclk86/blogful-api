const knex = require('knex');
const app = require('./app');
const {PORT, DB_URL} = require("./config");
// const PORT = process.env.PORT || 8000 - gets from config.js

const db = knex({
  client: 'pg',
  connection: DB_URL,
});

app.set('db', db) // server is the main start up file. When you set db to db here, you place it on teh app object, which, with above, you set it to app file. So now the app file can access it. 

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
});

// everything essentially attaches onto the app object. 