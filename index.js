const inquirer = require('inquirer');
const db = require('./config/connection');

db.connect(err => {
    if (err) throw err;
    employeeTracker();
});

const employeeTracker = function () {
    inquirer.prompt([{
        type: 'list',
        name: 'prompt',
        message: 'Hello! What would you like to do?',
        choices: [
                    'View All Departments',
                    'View All Roles',
                    'View All Employees',
                    'Add a Department',
                    'Add a Role',
                    'Add an Employee',
                    'Update an Existing Employee',
                    'Log Out',
                ]
    }]).then((ans) => {
        if (ans.prompt === 'View All Departments') {
            db.query(`SELECT * FROM department`, (err, result) => {
                if (err) throw err;
                console.log('Viewing All Departments: ');
                console.table(result);
                employeeTracker();
            });
        } else if (ans.prompt === 'View All Roles') {
            db.query(`SELECT * FROM role`, (err, result) => {
                if (err) throw err;
                console.log('Viewing All Roles: ');
                console.table(result);
                employeeTracker();
            });
        } else if (ans.prompt === 'View All Employees') {
            db.query(`SELECT * FROM employee`, (err, result) => {
                if (err) throw err;
                console.log('Viewing All Employees: ');
                console.table(result);
                employeeTracker();
            });
        } else if (ans.prompt === 'Add a Department') {
            inquirer.prompt([{
                type: 'input',
                name: 'department',
                message: 'What is the name of the department?',
                validate: departmentInput => {
                    if (departmentInput) {
                        return true;
                    } else {
                        console.log('Please add a department.');
                        return false;
                    }
                }
            }]).then((ans) => {
                db.query(`INSERT INTO department (name) VALUES (?)`, [ans.department], (err, result) => {
                    if (err) throw err;
                    console.log(`Added ${ans.department} to the database.`)
                    employeeTracker();
                });
            });
        } else if (ans.prompt === 'Add a Role') {
            inquirer.prompt([{
                type: 'input',
                name: 'role',
                message: 'What is the name of the role?',
                validate: roleInput => {
                    if (roleInput) {
                        return true;
                    } else {
                        console.log('Please add a role.');
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the salary for this role',
                validate: salaryInput => {
                    if (salaryInput) {
                        return true;
                    } else {
                        console.log('Please enter a salary.');
                        return false;
                    }
                }
            },
            {
                type: 'list',
                name: 'department',
                message: 'What department does this role belong to?',
                choices: () => {
                    let array = [];
                    for (let i = 0; i < result.length; i++) {
                        array.push(result[i].name);
                    }
                    return array;
                }
            }
        ]).then((ans) => {
            for (let i = 0; i < result.length; i++) {
                if (result[i].name === ans.department) {
                    let department = result[i];
                }
            }
            db.query(`INSERT INTO role (name) VALUES (?)`, [ans.role], (err, result) => {
                if (err) throw err;
                console.log(`Added ${ans.role} to the database.`)
                employeeTracker();
                });
            });
        } else if (ans.prompt === 'Add an Employee') {
            db.query(`SELECT * FROM employee, role`, (err, result) => {
                if (err) throw (err);
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'firstName',
                        message: 'Please enter the employees first name:',
                        validate: firstNameInput => {
                            if (firstNameInput) {
                                return true;
                            } else {
                                console.log('Please enter a first name.');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: 'Please enter the employees last name:',
                        validate: lastNameInput => {
                            if (lastNameInput) {
                                return true;
                            } else {
                                console.log('Please enter a last name.');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What is the employees role?',
                        choices: () => {
                            let array = [];
                            for (let i = 0; i < result.length; i++) {
                                array.push(result[i].title);
                            }
                            let newArray = [...new Set(array)];
                            return newArray;
                        }
                    },
                    {
                        type: 'input',
                        name: 'manager',
                        message: 'Who is the employees manager?',
                        validate: managerInput => {
                            if (managerInput) {
                                return true;
                            } else {
                                console.log('Please enter a manager.');
                                return false;
                            }
                        }
                    }
                ]).then((ans) => {
                    for (let i = 0; i < result.length; i++) {
                        if (result[i].title === ans.role) {
                            let role = result[i];
                        }
                    }
                    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [ans.firstName, ans.lastName, role.id, ans.manager.id,], (err, result) => {
                        if (err) throw err;
                        console.log(`Added ${ans.firstName} ${ans.lastName} to the database.`)
                        employeeTracker();
                    });
                })
            });
        } else if (ans.prompt === 'Update an Existing Employee') {
            db.query(`SELECT * FROM employee, role`, (err, result) => {
                if (err) throw err;
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'employee',
                        message: 'Which employee do you want to update?',
                        choices: () => {
                            let array = [];
                            for (let i = 0; i < result.length; i++) {
                                array.push(result[i].last_name);
                            }
                            let employeeArray = [...new Set(array)];
                            return employeeArray;
                        }
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What is their new role?',
                        choices: () => {
                            let array = [];
                            for (let i = 0; i < result.length; i++) {
                                array.push(result[i].title);
                            }
                            let newArray = [...new Set(array)];
                            return newArray;
                        }
                    }
                ]).then((ans) => {
                    for (let i = 0; i < result.length; i++) {
                        if (result[i].last_name === ans.employee) {
                            let name = result[i];
                        }
                    }
                    for (let i = 0; i < result.length; i++) {
                        if (result[i].title === ans.role) {
                            let role = result[i];
                        }
                    }
                    db.query(`UPDATE employee SET ? WHERE ?`, [{role_id: role}, {last_name: name}], (err, result) => {
                        if (err) throw err;
                        console.log(`Updated ${ans.employee} role to the database.`)
                        employeeTracker();
                    });
                })
            });
        } else if (ans.prompt === 'Log Out') {
            db.end();
            console.log('Farewell!');
        }
    })
};