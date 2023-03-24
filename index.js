const inquirer = require('inquirer');
const db = require('./config/connection');

db.connect(err => {
    if (err) throw err;
    employeeTracker();
});

const employeeTracker = () => {
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
        const {prompt} = ans;

        if (prompt === 'View All Departments') {
            viewAllDepartments();
        }

        if (prompt === 'View All Roles') {
            viewAllRoles();
        }

        if (prompt === 'View All Employees') {
            viewAllEmployees();
        }

        if (prompt === 'Add a Department') {
            addDepartment();
        }

        if (prompt === 'Add a Role') {
            addRole();
        }

        if (prompt === 'Add an Employee') {
            addEmployee();
        }

        if (prompt === 'Update an Existing Employee') {
            updateEmployee();
        }

        if (prompt === 'Log Out') {
            db.end();
            console.log('Farewell!')
        }
    });
    
    
    const viewAllDepartments = () => {
        db.query(`SELECT * FROM department`, (err, result) => {
            if (err) throw err;
            console.log('Viewing All Departments: ');
            console.table(result);
            employeeTracker();
        });
    }


    const viewAllRoles = () => {
        db.query(`SELECT * FROM role`, (err, result) => {
            if (err) throw err;
            console.log('Viewing All Roles: ');
            console.table(result);
            employeeTracker();
        });
    }

    const viewAllEmployees = () => {
        db.query(`SELECT * FROM employee`, (err, result) => {
            if (err) throw err;
            console.log('Viewing All Employees: ');
            console.table(result);
            employeeTracker();
        });
    }
            
    const addDepartment = () => {
        inquirer.prompt([
            {
                name: 'newDepartment',
                type: 'input',
                message: 'What is the name of the department?',
                validate: departmentInput => {
                    if (departmentInput) {
                        return true;
                    } else {
                        console.log('Please add a department.');
                        return false;
                    }
                }
            }
        ]).then((ans) => {
            db.query(`INSERT INTO department (name) VALUES (?)`, [ans.newDepartment], (err, result) => {
                if (err) throw err;
                console.log(`Added ${ans.newDepartment} to the database.`)
                employeeTracker();
            });
        });
    }

    const addRole = () => {
        const departments = [];
        db.query(`SELECT * FROM DEPARTMENT`, (err, result) => {
          if (err) throw err;
      
          result.forEach(department => {
            let obj = {
              name: department.name,
              value: department.id
            }
            departments.push(obj);
          });
      
          inquirer.prompt([
            {
                name: 'newRole',
                type: 'input',
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
                name: 'salary',
                type: 'input',
                message: 'Enter the salary for this role.',
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
                name: 'department_id',
                type: 'list',
                message: 'Which department is this role in?',
                choices: departments
            }
          ]).then(response => {
            db.query(`INSERT INTO ROLE (title, salary, department_id) VALUES (?)`, [[response.newRole, response.salary, response.department]], (err, result) => {
              if (err) throw err;
              console.log(`Successfully added a new role!`);
              employeeTracker();
            });
          });
        });
    }


    const addEmployee = () => {
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
            }
        ]).then((ans) => {
            const build = [ans.firstName, ans.lastName];
            db.query(`SELECT role.id, role.title FROM role`, (err, result) => {
                if (err) throw err;
                const roles = result.map(({ id, title }) => ({ name: title, value: id }));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: "What is the employee's role?",
                        choices: roles
                    }
                ]).then(roleChoice => {
                    const role = roleChoice.role;
                    build.push(role);
                    db.query(`SELECT * FROM employee`, (err, result) => {
                        if (err) throw err;
                        const managers = result.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
                        inquirer.prompt([
                            {
                                type: 'list',
                                name: 'manager',
                                message: "Who is the employee's manager?",
                                choices: managers
                            }
                        ]).then(managerChoice => {
                            const manager = managerChoice.manager;
                            build.push(manager);
                            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, build, (err, result) => {
                                if (err) throw err;
                                console.log('Employee added.');
                                employeeTracker();
                            });
                        });
                    });
                });
            });
        });
    }

    const updateEmployee = () => {
        db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id"
        FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id`, (err, result) => {
            if (err) throw err;
            let employeeNamesArray = [];
            result.forEach((employee) => {employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`)});
            db.query(`SELECT role.id, role.title FROM role`, (err, result) => {
                if (err) throw err;
                let rolesArray = [];
                result.forEach((role) => {rolesArray.push(role.title)});

                inquirer.prompt([
                    {
                        name: 'chosenEmployee',
                        type: 'list',
                        message: 'Which employee do you want to update?',
                        choices: employeeNamesArray
                    },
                    {
                        name: 'chosenRole',
                        type: 'list',
                        message: 'What is their new role?',
                        choices: rolesArray
                    }
                ]).then((ans) => {
                    let newTitleId, employeeId;
                    result.forEach((role) => {
                        if (ans.chosenRole === role.title) {
                            newTitleId = role.id;
                        }
                    });
                    result.forEach((employee) => {
                        if (ans.chosenEmployee === `${employee.first_name} ${employee.last_name}`) {
                            employeeId = employee.id;
                        }
                    });
                    db.query(`UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`, [newTitleId, employeeId], (err, result) => {
                        if (err) throw err;
                        console.log('Employee role updated');
                        employeeTracker();
                    });
                });
            });
        });
    }
}