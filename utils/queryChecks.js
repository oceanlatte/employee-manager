const db = require('../db/connection');

const Role = require('../lib/Role');
const Employee = require('../lib/Employee');


// --------- Check Functions to find Indexes -------------

// find department index that matches selected role
const checkDepartment = (name, salary, dept, mangRole) => {
  const query = 
  `SELECT * FROM department WHERE department_name = '${dept}'`;

  db.query({sql: query, rowsAsArray: true}, (err, results) => {
    if (err) {
      console.log(err)
    }
    else {
      const deptIdArr = results.flatMap(index => index);
      if (deptIdArr[0]) {
        const role = new Role(name, salary, deptIdArr[0], mangRole);
        role.insertToRole();
      }
    }
  });
}

// select role.title from table in order to grab role ID number
const checkRole = (first, last, title, managerId, fullName) => {
  const query = 
  `SELECT * FROM role WHERE title = '${title}'`;

  db.query({sql: query, rowsAsArray: true}, (err, results) => {
    if (err) {
      console.log(err);
    }
    else {
      const rolesArr = results.flatMap(i => i);

      // if sent to checkRole WITH a manager Id than it is to add new Employee
      if (managerId !== null) {
        // if manager id was 'None', then send to Employee constructor as null
        if(managerId === 'None'){
          const employee = new Employee(first, last, rolesArr[0], null);
          employee.insertToEmployee();
        }
        else {
          const employee = new Employee(first, last, rolesArr[0], managerId);
          employee.insertToEmployee();
        }
      }
      // if sent WITHOUT manager ID than it was to get employeeID
      else {
        checkEmployeeId(fullName, rolesArr[0]);
      }
    }
  });
};

// used to get employee ID to update the correct employee info
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

      if (selectedEmployeeArr[0]) {
        Employee.updateEmployee(role, selectedEmployeeArr[0], name);
      }
    }
  });
};

module.exports = {
  checkDepartment,
  checkRole,
  checkEmployeeId
}