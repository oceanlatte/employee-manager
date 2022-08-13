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
        console.log('add department chosen');
        break;
      case 'Add a role':
        console.log('add role chosen');
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
  const dept = new Department ('NewDept');
  dept.insertToDb()
  getAllDepartments;
}

const newRole = () => {
  const role = new Role('Customer Service Rep II', 30000.00, 4);
  role.insertToRole();
  getAllRoles();
}

const newEmployee = () => {
  const employee = new Employee('Ron', 'Weasley', 5, 8);
const db = require('../db/connection');
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