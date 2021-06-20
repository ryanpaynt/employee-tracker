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
                        'View Employees by...',
                        'Add...',
                        'Update...',
                        'Quit'
                    ]
            },
        ])
        .then((res) => {
            switch (res.action_list) {
                case 'View Employees':
                    viewAllEmployees();
                    break;
                case 'View Employees by...':
                    viewBy();
                    break;
                case 'Add...':
                    addBy();
                    break;
                case 'Update...':
                    setupUpd();
                    break;
                default:
                    quit();
                    break;
            }
        })
}

const setupUpd = () => {
    inquirer
    .prompt([
        {
            type: 'list',
            message: 'What would you like to update?',
            name: 'updList',
            choices: ['Department', 'Role', 'Manager']
        }
    ]).then((res) =>{
        switch(res.updList){
            case 'Department':
                var query = 
                `SELECT * FROM department`
            
                connection.query(query, (err,res) =>{
                    if(err)throw err;
                    const arrDept = res.map(data => ({name: data.name, value: data.id}));
                    updDepPrompt(arrDept);
                });
                break;
            case 'Role':
                var query = 
                `SELECT * FROM role`

                connection.query(query, (err,res) =>{
                    if(err)throw err;
                    const arrRoles = res.map(data => ({ name: data.title, value: data.id }));
                    console.log(arrRoles);
                    updRolPrompt(arrRoles);
                });
                break;
        }
    });
}

const updRolPrompt = (arr) => {
    inquirer
    .prompt([
        {
            type: 'list',
            message: 'What would you like to update?',
            name: 'rolList',
            choices: arr
        },
        {
            type: 'input',
            message: 'What would you like to name the role?',
            name: 'rolRename',
        },
        {
            type: 'input',
            message: 'What is the desired salary?',
            name: 'rolSalary',
        }
    ]).then((res) => {
        console.log(`Updating ${res.deptList}`);

        var query = `UPDATE department SET ? WHERE ?`
        connection.query(query, [{name: res.depList}, {name: res.depRename}, {salary: res.rolSalary}], (err,res) =>{
            if(err) throw err;
            console.log('Role updated');
            promptOne();
        });
    });
}

const updDepPrompt = (arr) => {
    console.log('hit');
    inquirer
    .prompt([
        {
            type: 'list',
            message: 'What would you like to update?',
            name: 'deptList',
            choices: arr
        },
        {
            type: 'input',
            message: 'What would you like to name the department?',
            name: 'depRename',
        }
    ]).then((res) => {
        console.log(`Updating ${res.deptList}`);

        var query = `UPDATE department SET ? WHERE ?`
        connection.query(query, [{name: res.depList}, {name: res.depRename}], (err,res) =>{
            if(err) throw err;
            console.log('Department updated');
            promptOne();
        });
    });
}

const quit = () => {
    console.log('Quitting app...\n');
    return process.exit(22);
}

const viewBy = () => {
    inquirer
    .prompt([
    {
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

const addBy = () => {
    inquirer
    .prompt([
        {
            type: 'list',
            message: 'What would you like to add?',
            name: 'listAdd',
            choices: ['Department', 'Role', 'Employee']
        }
]).then((res) =>{
    switch(res.listAdd){
        case 'Department':
            addDep();
            break;
        case 'Role':
            setupRole();
            break;
        default:
            addEmpl();
    }
});
}

const setupRole = () => {
    const query = 
    `SELECT * FROM department`

    connection.query(query, (err,res) =>{
        if(err)throw err;
        const arrRoles = res.map(data => ({ name: data.name, value: data.id }));
        addRole(arrRoles);
    })
}

const addRole = (arr) => {
    inquirer
    .prompt([
        {
            type: 'input',
            message: 'What is the name of the role?',
            name: 'addRole'
        },
        {
            type: 'input',
            message: 'What is the salary?',
            name: 'addSalary'
        },
        {
            type: 'list',
            message: 'What department does it belong to?',
            name: 'dept',
            choices: arr
        }

]).then((res) =>{
    const query =  
        `INSERT INTO role SET ?`
        connection.query(query, 
            {
                title: res.addRole,
                salary: res.addSalary,
                department_id: res.dept
            }
            , (err,res) =>{
            if(err)throw err;
            console.log('Your role has been added!');
            promptOne();
        })
});
}

const addDep = () => {
    inquirer
    .prompt([
        {
            type: 'input',
            message: 'What is the name of the department?',
            name: 'addDep'
        }
]).then((res) =>{
    const query =  
        `INSERT INTO department SET ?`
        connection.query(query, 
            {
                name: res.addDep,
            }
            , (err,res) =>{
            if(err)throw err;
            console.log('Your department has been added!');
            promptOne();
        })
});
}

const addEmpl = () => {
    console.log('Inserting a new employee');

    const query = 
    `SELECT r.id, r.title, r.salary
    FROM role r`

    connection.query(query, (err,res) =>{
        if(err)throw err;
        const arrRoles = res.map(data => ({ name: data.title, value: data.id }));
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
        choices: arrRoles
      },
    ]).then((res)=>{

        const query =  
        `INSERT INTO employee SET ?`
        connection.query(query, 
            {
                f_name: res.f_name,
                l_name: res.l_name,
                role_id: res.roleId,
                manager_id: null
            }
            , (err,res) =>{
            if(err)throw err;
            console.log('Your employee has been added!');
            promptOne();
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