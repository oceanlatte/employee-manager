const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');

const Department = require('./lib/Department');
const Role = require('./lib/Role');
const Employee = require('./lib/Employee');
const  { getAllDepartments, getAllEmployees, getAllRoles } = require('./utils/quieries');

const startMenu = () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'departments',
      message: 'Which department would you like to select?',
      choices: ['all', 'sales', 'customer service']
    }
  ])
  .then(data => {
    console.log(data, "data chosen from inquirer");
    if (data) {
      getAllDepartments();
    }
  })
};


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


// startMenu();