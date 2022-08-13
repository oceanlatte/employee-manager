const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    // unique password, not used for anything else
    password: 'h0tch33tos',
    database: 'directory'
  },
  console.log('Connected to employee database.'),
);

const start = () => {
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
  db.query(`SELECT * FROM department`, (err, row) => {
    if (err) {
      console.log(err);
    }
    else {
      console.table(row);
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
} 

// getAllDepartments();
// getAllRoles();
getAllEmployees();



// start();