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
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to do?',
                name: 'action_list',
                choices:
                    [
                        'View Employees',
                        'View Employees by Department',
                        'Add Employee',
                        'Remove Employee',
                        'Update Employee Role',
                        'Add Role',
                        'Quit'
                    ]
            },
        ])
        .then((res) => {
            switch (res.action_list) {
                case 'View Employees':
                    viewAllEmployees();
                    break;
                case 'View Employees by Department':
                    viewByDep();
                    break;
                case 'Add Employee':
                    break;
                case 'Remove Employee':
                    break;
                case 'Update Employee Role':
                    break;
                case 'Add Role':
                    break;
                default:
                    break;
            }
        })
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
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        console.table("Employees generated.");
        promptOne();
    });
};

const viewByDep = () => {
    console.log("Viewing EMployees by Department...\n");
    const query =
        `SELECT d.id, d.name AS budget
    FROM employee e
    LEFT JOIN role r
        ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    GROUP BY d.id, d.name`
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        console.table("Employees are Shown by Department.");
    })
}

connection.connect((err) => {
    if (err) throw err;
    console.log("initializing...");
    promptOne();
});