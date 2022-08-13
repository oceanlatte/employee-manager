const db = require('../db/connection');

// ADD: (X) name of dept | (X) adds to DB
class Department {
  constructor(name) {
    this.name = name;
  }

  insertToDepartment() {
    const sql = `INSERT INTO department (department_name)
    VALUES (?)`;

    db.query(sql, this.name, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      else {
        console.log(`New department ${this.name} added!`);
        console.log(results);
      }
    })
  } 

  // BONUS: () remove department

  // BONUS: () view entire budget (total salaries) for a single dept
}

module.exports = Department;