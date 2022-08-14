const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');

const Department = require('./lib/Department');
const Role = require('./lib/Role');
const Employee = require('./lib/Employee');
const  { getAllDepartments, getAllEmployees, getAllRoles } = require('./utils/quieries');

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
        console.log('add employee chosen');
        break;
      case 'Update an employee':
        console.log('UPDATE employee chosen');
        break;
      case 'Quit':
        console.log('add quit fuction');
        break;
    }
  })
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
        startMenu();
      }
    }
  })
}


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
        // send to query to find index of selected role from dept table
        checkDepartment(data.roleName, data.salary, data.roleId);
       
        // getAllDepartments();
      });
    }
  });
};


const newEmployee = () => {
  const employee = new Employee('Ron', 'Weasley', 5, 8);
  employee.insertToEmployee();
  // employee.updateEmployee(6, 10);
  getAllEmployees();
}

// getAllDepartments();
// getAllRoles();
// getAllEmployees();

// newDepartment();
// newRole();
// newEmployee();


startMenu();