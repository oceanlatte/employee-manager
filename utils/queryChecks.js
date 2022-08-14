const db = require('../db/connection');

const Role = require('../lib/Role');
const Employee = require('../lib/Employee');


// --------- Check Functions to find Indexes -------------

// find department index that matches selected role
const checkDepartment = (name, salary, dept) => {
  const query = 
  `SELECT * FROM department WHERE department_name = '${dept}'`;

  db.query({sql: query, rowsAsArray: true}, (err, results) => {
    if (err) {
      console.log(err)
    }
    else {
      const deptIdArr = results.flatMap(index => index);
      if (deptIdArr[0]) {
        const role = new Role(name, salary, deptIdArr[0]);
        role.insertToRole();
        // startMenu();
      }
    }
  });
}

const checkRole = (first, last, title, manager, fullName) => {
  const query = 
  `SELECT * FROM role WHERE title = '${title}'`;

  db.query({sql: query, rowsAsArray: true}, (err, results) => {
    if (err) {
      console.log(err);
    }
    else {
      const rolesArr = results.flatMap(i => i);

      if (manager !== null) {
        const employee = new Employee(first, last, rolesArr[0], manager);
        employee.insertToEmployee();
        // startMenu();
      }
      else {
        console.log(fullName, rolesArr[0], 'else statment info')
        checkEmployeeId(fullName, rolesArr[0]);
      }
    }
  });
};


const checkEmployeeId = (name, role) => {
  const query = 
  `SELECT * FROM employee
  WHERE CONCAT(first_name, ' ', last_name) = '${name}'`;

  db.query({sql: query, rowsAsArray: true}, (err, results) => {
    if (err) {
      console.log(err);
    }
    else {
      const selectedEmployeeArr = results.flatMap(i => i);
      console.log(selectedEmployeeArr, 'employee array from checkEmployeeId');

      if (selectedEmployeeArr[0]) {
        Employee.updateEmployee(role, selectedEmployeeArr[0], name);
        // startMenu();
      }
    }
  });
}

module.exports = {
  checkDepartment,
  checkRole,
  checkEmployeeId
}