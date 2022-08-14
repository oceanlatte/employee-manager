const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');

const Department = require('./lib/Department');
const Role = require('./lib/Role');
const Employee = require('./lib/Employee');
const  { getAllDepartments, getAllEmployees, getAllRoles } = require('./utils/queries');

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
        console.log('UPDATE employee chosen');
        break;
      case 'Quit':
        console.log('add quit fuction');
        break;
    }
  });
};

// CREATE SEPARATE FUNCTION for:
// {
//   type: 'list',
//   name: 'departments',
//   message: 'Which department would you like to select?',
//   choices: ['all', 'sales', 'customer service']
// }


// -----ADD NEW: Dept, Role, Employee functions-----
// NEED TO ADD PARAMETERS FROM INQUIRER QUESTIONS
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

// find department index that matches selected role
const checkDepartment = (name, salary, dept) => {
  const query = 
  `SELECT * FROM department WHERE department_name = '${dept}'`;

  db.query({sql: query, rowsAsArray: true}, (err, results) => {
    if (err) {
      console.log(err)
    }
    else {
      const flattenedDeptId = results.flatMap(index => index);
      if (flattenedDeptId[0]) {
        const role = new Role(name, salary, flattenedDeptId[0]);
        role.insertToRole();
        // startMenu();
      }
    }
  });
}

const checkRole = (first, last, title, manager) => {
  const query = 
  `SELECT * FROM role WHERE title = '${title}'`;

  db.query({sql: query, rowsAsArray: true}, (err, results) => {
    if (err) {
      console.log(err);
    }
    else {
      const flattenedRoles = results.flatMap(i => i);
      console.log(flattenedRoles, 'flattened roles row');
      if (flattenedRoles[0]) {
        const employee = new Employee(first, last, flattenedRoles[0], manager);
        employee.insertToEmployee();
        // startMenu();
      }
    }
  });
};


const newRole = () => {
  // get list of departments for choosing which dept role belongs to
  db.query({sql: `SELECT department_name FROM department`, rowsAsArray: true}, (err, results) => {
    if (err) {
      console.log(err);
    }
    else {
      const flattenedArr = results.flatMap(index => index);
      
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
          choices: flattenedArr
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

// getAllDepartments();
// getAllRoles();
getAllEmployees();

// newDepartment();
// newRole();
// newEmployee();


// startMenu();