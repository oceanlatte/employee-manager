const db = require('../db/connection');

// ADD: (X) first name | (X) last name | (X) role | (X) manager | (X) adds to DB
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
      else {
        console.log(`New employee ${this.fullName} added!`)
      }
    });
  };

  // UPDATE employee role
  // (X) selects employee to update (add as parameter) | (X) db is updated
  static updateEmployee(newRoleId, employeeId, name) {
    const sql = `UPDATE employee SET role_id = ? WHERE employee.id = ?`;
    const newInfo = [newRoleId, employeeId];

    db.query(sql, newInfo, (err) => {
      if (err) {
        console.log(err);
        return;
      }
      else {
        console.log(`${name}'s info has been updated.`);
      }
    });
  };

  // BONUS: () update employee manager
  // BONUS: () view employees by manager
  // BONUS: () view employees by department
  // BONUS: () delete employees
};

module.exports = Employee;