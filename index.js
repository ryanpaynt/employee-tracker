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
                        'View Employees by ...',
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
                case 'View Employees by ...':
                    viewBy();
                    break;
                case 'Add Employee':
                    addEmpl();
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

const viewBy = () => {
    inquirer
    .prompt([{
        type: 'list',
        message: 'What would you like to view by?',
        name: 'view',
        choices: ['Departments', 'Roles', 'Manager']
    }
]).then((res) => {
    switch(res.view){
        case 'Departments':
            viewByDep();
            break;
        case 'Roles':
            viewByRole();
            break;
    }
});
}

const addEmpl = () => {
    console.log('Inserting a new employee');

    const query = 
    `SELECT r.id, r.title, r.salary
    FROM role r`

    connection.query(query, (err,res) =>{
        if(err)throw err;
        const arrRoles = res.map(data => ({id: data.id, title: data.title, salary: data.salary}));

        console.table(res);
        promptRole(arrRoles);
    })
}

const promptRole = (arrRoles) => {
    inquirer
    .prompt([
      {
        type: "input",
        message: "What is the employee's first name?",
        name: "f_name"
      },
      {
        type: "input",
        message: "What is the employee's last name?",
        name: "l_name"
      },
      {
        type: "list",
        message: "What is the employee's role?",
        name: "roleId",
        choices: arrRoles//.map(function(item) { return item["title"] })
      },
    ]).then((res)=>{
        console.log(res);

        const query =  
        `INSERT INTO employee SET ?`
        connection.query(query, 
            {
                f_name: res.f_name,
                l_name: res.l_name,
                role_id: res.roleId,
                manager_id: res.managerId
            }
            , (err,res) =>{
            if(err)throw err;
            console.table(res);

        })
    });
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

const viewByRole = () => {
    console.log("Viewing Employees by Role...\n");
    const query =
        `SELECT r.id, r.title AS title
    FROM employee e
    LEFT JOIN role r
        ON e.role_id = r.id
    GROUP BY r.id, r.title`
    connection.query(query, (err, res) => {
        if (err) throw err;
        const roles = res.map(data => ({ id: data.id, name: data.title }));
        console.table(roles);
        console.table(res);
        employeeFromRol(roles);
    })
}

const viewByDep = () => {
    console.log("Viewing Employees by Department...\n");
    const query =
        `SELECT d.id, d.name AS name
    FROM employee e
    LEFT JOIN role r
        ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    GROUP BY d.id, d.name`
    connection.query(query, (err, res) => {
        if (err) throw err;
        const departments = res.map(data => ({ id: data.id, name: data.name }));
        console.table(departments);
        console.table("Departments generated.");
        employeeFromDep(departments);
    })
}

const employeeFromRol = (roles) => {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Which role do you want?',
                name: 'roleSearch',
                choices: roles
            }
        ]).then((res) => {
            console.log(`Generating Employees by ${res.roleSearch}...\n`);

            const query =
                `SELECT e.id, e.f_name, e.l_name, r.title, d.name AS department 
                FROM employee e
                JOIN role r
                    ON e.role_id = r.id
                JOIN department d
                ON d.id = r.department_id
                WHERE r.title = ?`

            connection.query(query, res.roleSearch, (err, res) => {
                if (err) throw err;
                console.table(res);
                console.log('Employees generated.');
                promptOne();
            });
        });
}

const employeeFromDep = (deps) => {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Which department do you want?',
                name: 'depSearch',
                choices: deps
            }
        ]).then((res) => {
            console.log(`Generating Employees by ${res.depSearch}...\n`);

            const query =
                `SELECT e.id, e.f_name, e.l_name, r.title, d.name AS department 
                FROM employee e
                JOIN role r
                    ON e.role_id = r.id
                JOIN department d
                ON d.id = r.department_id
                WHERE d.name = ?`

            connection.query(query, res.depSearch, (err, res) => {
                if (err) throw err;
                console.table(res);
                console.log('Employees generated.');
                promptOne();
            });
        });
}

connection.connect((err) => {
    if (err) throw err;
    console.log("initializing...");
    promptOne();
});