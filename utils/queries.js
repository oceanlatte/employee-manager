const db = require('../db/connection');
const cTable = require('console.table');

// get all departments
const getAllDepartments = () => {
  db.query(`SELECT * FROM department`, (err, results) => {
    if (err) {
      console.log(err);
    }
    else {
      console.table(results);
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


// (X) job titles | (X) departments | (X) salaries | !! () managers name
const getAllEmployees = () => {
  const sql = 
  `SELECT 
  employee.id, employee.first_name, employee.last_name, employee.manager_id,
    role.title, 
    role.salary, 
    department.department_name,
    CONCAT (manager.first_name, ' ' , manager.last_name) AS manager
  FROM employee 
  LEFT JOIN 
    role ON employee.role_id = role.id AND role.salary
  LEFT JOIN department ON role.department_id = department.id
  LEFT JOIN employee manager ON employee.manager_id = manager.id;`
  
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err)
    }
    else {
      console.table(rows);
    }
  })
}; 

module.exports = {
  getAllDepartments,
  getAllRoles,
  getAllEmployees
};