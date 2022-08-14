const inquirer = require('inquirer');
const db = require('./db/connection');

const Department = require('./lib/Department');
const { getAllDepartments, getAllEmployees, getAllRoles } = require('./utils/queries');
const { checkDepartment, checkRole, checkEmployeeId } = require('./utils/queryChecks');


console.log(
  `
  ============================================
   Welcome to the Employee Management System!
  ============================================
  `
);

const startMenu = () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'start',
      message: 'What would you like to do today?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee',
        'Quit'
      ]
    }
  ])
  .then(data => {
    switch(data.start) {
      case 'View all departments':
        getAllDepartments();
        break;
      case 'View all roles':
        getAllRoles();
        break;
      case 'View all employees':
        getAllEmployees();
        break;
      case 'Add a department':
        newDepartment();
        break;
      case 'Add a role':
        newRole();
        break;
      case 'Add an employee':
        newEmployee();
        break;
      case 'Update an employee':
        getEmployeeToUpdate();
        break;
      case 'Quit':
        confirmQuit();
        break;
    }
  });
};

// ----ADD NEW: Dept, Role, Employee functions----
const newDepartment = () => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'dept',
      message: 'What is the new department name?'
    }
  ])
  .then(data => {
    const dept = new Department (data.dept);
    dept.insertToDepartment();
    // startMenu();
  });
};


const newRole = () => {
  // get list of departments for choosing which dept role belongs to
  db.query({sql: `SELECT department_name FROM department`, rowsAsArray: true}, (err, results) => {
    if (err) {
      console.log(err);
    }
    else {
      const deptArr = results.flatMap(index => index);
      
      inquirer.prompt([
        {
          type: 'input',
          name: 'roleName',
          message: 'What is the name of the new role?'
        },
        {
          type: 'input',
          name: 'salary',
          message: 'What is the salary for this role?'
        },
        {
          type: 'list',
          name: 'roleId',
          message: 'What department does this role belong to?',
          choices: deptArr
        }
      ])
      .then(data => {
        // send to  find index of selected role from dept table for Role constructor
        checkDepartment(data.roleName, data.salary, data.roleId);
       
        // startMenu();
      });
    }
  });
};


const newEmployee = () => {
  // get list of departments for choosing which dept role belongs to
  db.query({sql: `SELECT title FROM role`, rowsAsArray: true}, (err, results) => {
    if (err) {
      console.log(err);
    }
    else {
      const flattenedArr = results.flatMap(index => index);
      inquirer.prompt([
        {
          type: 'input',
          name: 'firstName',
          message: 'What is their first name?'
        },
        {
          type: 'input',
          name: 'lastName',
          message: 'What is their last name?'
        },
        {
          type: 'list',
          name: 'role',
          message: 'What is their role?',
          choices: flattenedArr
        },
        {
          type: 'list',
          name: 'manager',
          message: 'Who is their manager?',
          // !!! NEED TO ADD MANAGER
          choices: [1, 2, 3]
        }
      ])
      .then(data => {
        // send to checkRole() to find the role index needed for Employee constructor
        checkRole(data.firstName, data.lastName, data.role);
        // startMenu();
      });
    }
  });
};

const getEmployeeToUpdate = () => {
  const query = 
  `SELECT CONCAT(first_name, ' ', last_name) AS full_name
  FROM employee`; 

  db.query({sql: query, rowsAsArray: true}, (err, result) => {
    if (err) {
      console.log(err);
    }
    else {
      const employeeArr = result.flatMap(i => i);

      inquirer.prompt([
          {
            type: 'list',
            name: 'employee',
            message: 'Which employee would you like to update?',
            choices: employeeArr
          }
      ])
      .then(data => {
        newRoleForUpdate(data.employee);
      });
    }
  });
};

const newRoleForUpdate = employee => {
  const query = `SELECT title FROM role`;

  db.query({sql: query, rowsAsArray: true}, (err, results) => {
    if (err) {
      console.log(err);
    }
    else {
      const rolesArr = results.flatMap(i => i);

      inquirer.prompt([
        {
          type: 'list',
          name: 'newRoleName',
          message: 'What is their new role?',
          choices: rolesArr
        }
      ])
      .then(data => {
        checkRole(null, null, data.newRoleName, null, employee);
      })
    }
  });
};

const confirmQuit = () => {
  return inquirer.prompt([
    {
      type: 'confirm',
      name: 'quit',
      message: 'Are you sure you would like to quit the program?'
    }
  ])
  .then(data => {
    if (data.quit) {
      // if quit was true then say goodbye
      console.log('Okay, goodbye!!');
      return;
    }
    else {
      // else send back to startMenu
      startMenu();
    }
  });
};

// getAllDepartments();
// getAllRoles();
// getAllEmployees();

// newDepartment();
// newRole();
// newEmployee();
// getEmployeeToUpdate();


startMenu();