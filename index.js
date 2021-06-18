const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employee_db'
});

const promptOne = () => {
    
}

const viewAllEmployees = () => {
    console.log('Showing all results...\n');
    const query = 
    `SELECT e.id, e.f_name, e.l_name, r.title, d.name AS department, r.salary, CONCAT(m.f_name, ' ', m.l_name) AS manager
    FROM employee e
    LEFT JOIN role r
      ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    LEFT JOIN employee m
      ON m.id = e.manager_id`;
    connection.query(query, (err,res) => {
        if(err) throw err;
        console.table(res);
        console.table("Employees generated.");
    });
};



connection.connect((err) => {
    if(err) throw err;
    console.log("initializing...");
    viewAllEmployees();
});