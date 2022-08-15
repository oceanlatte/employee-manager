const db = require("../db/connection");

// ADD: (X) name | (X) salary | (X) dept of role | (X)adds to db
class Role { 
  constructor(name, salary, department, managment) {
    this.name = name;
    this.salary = salary;
    this.department = department;
    this.managment = managment;
    this.array = [this.name, this.salary, this.department, this.managment];
  }

  insertToRole() {
    const sql = `INSERT INTO role (title, salary, department_id, managment_role)
    VALUES (?,?,?,?)`;

    console.log(this.array, 'ARRAY LOGGED IN ROLE CONSTRUCTOR')

    db.query(sql, this.array, (err, rows) => {
      if (err) {
        console.log(err);
        return;
      }
      else {
        console.log(`New role ${this.name} added!`);
      }
    })
  }

  // BONUS: () remove role
}

module.exports = Role;