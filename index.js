const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employee_db'
});

const init = () => {
    console.log('Showing all results...\n');
    const query = 'SELECT * FROM employee';
    connection.query(query, (err,res) => {
        if(err) throw err;
        console.table(res);
    });
};

connection.connect((err) => {
    if(err) throw err;
    console.log("initializing...");
    init();
});