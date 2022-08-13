const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');

const Department = require('./lib/Department');
const Role = require('./lib/Role');

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

// get all departments
const getAllDepartments = () => {
  db.query(`SELECT * FROM department`, (err, results) => {
    if (err) {
      console.log(err);
    }
    else {
      console.table(['ID', 'Name'], results);
      console.log(results);
    }
  });
}

// db query to display the DEPT NAME the role belongs to 
const getAllRoles = () => {
  const sql = `SELECT role.*, department.department_name
  FROM role
  LEFT JOIN department
  ON role.department_id = department.id`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
    }
    else {
      console.table(rows);
      return rows;
    }
  });
}

// (X) job titles | (X) departments | (X) salaries | () managers name
const getAllEmployees = () => {
  const sql = 
  `SELECT 
    employee.*, 
    role.title, 
    role.salary, 
    department.department_name
  FROM employee
  LEFT JOIN 
    role ON employee.role_id = role.id AND role.salary
  LEFT JOIN department ON role.department_id = department.id;`
  
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err)
    }
    else {
      console.table(rows);
    }
  })
}; 

// const newDepartment = () => {
//   const dept = new Department ('NewDept');
//   dept.insertToDb()
//   getAllDepartments;
// }

const newRole = () => {
  const role = new Role('Customer Service Rep II', 30000.00, 4);
  role.insertToRole();
  getAllRoles();
}

// getAllDepartments();
// getAllRoles();
getAllEmployees();

// newDepartment();
newRole();


// startMenu();