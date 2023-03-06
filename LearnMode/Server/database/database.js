import mysql from 'mysql';

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'learnmode'
});

db.connect((err) => {
    if(err){
        throw err;
    }

    console.log("MySQL Connected");
})

export default db;