const db = require('../db/connection');

class Employee {
  constructor(firstName, lastName, roleId, managerId) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.roleId = roleId;
    this.managerId = managerId;
    this.array = [this.firstName, this.lastName, this.roleId, this.managerId];
    this.fullName = `${this.firstName} ${this.lastName}`;
  }

  insertToEmployee() {
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES (?,?,?,?)`;

    db.query(sql, this.array, (err) => {
      if (err) { 
        console.log(err);
        return;
      }
    });
  };

  static updateEmployee(newRoleId, employeeId, name) {
    const sql = `UPDATE employee SET role_id = ? WHERE employee.id = ?`;
    const newInfo = [newRoleId, employeeId];

    db.query(sql, newInfo, (err) => {
      if (err) {
        console.log(err);
        return;
      }
    });
  };

  // BONUS: () update employee manager
  // BONUS: () view employees by manager
  // BONUS: () view employees by department
  // BONUS: () delete employees
};

module.exports = Employee;