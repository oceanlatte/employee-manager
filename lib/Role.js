const db = require("../db/connection");

// ADD: (X) name | (X) salary | (X) dept of role | (X)adds to db
class Role { 
  constructor(name, salary, department) {
    this.name = name;
    this.salary = salary;
    this.department = department;
  }

  insertToRole() {
    const sql = `INSERT INTO role (title, salary, department_id)
    VALUES (?,?,?)`;

    db.query(sql, [this.name, this.salary, this.department], (err, results, rows) => {
      if (err) {
        console.log(err);
        return;
      }
      else {
        console.log(`New role ${this.name} added!`);
      }
    })
  }
}

module.exports = Role;