const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'password',
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
      db.query(`SELECT * FROM department`, (err, row) => {
        if (err) {
          console.log(err);
        }
        else {
          console.log(row);
        }
      })
    }
  })
};


// db query to display the DEPT NAME the role belongs to 
db.query(`SELECT role.*, department.department_name
FROM role
LEFT JOIN department
ON role.department_id = department.id;
`, (err, rows) => {
  if (err) {
    console.log(err);
  }
  else {
    console.log(rows);
    return rows;
  }
});


// start();