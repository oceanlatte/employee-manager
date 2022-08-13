const db = require('../db/connection');

// add department
// -name of dept -add to DB
class Department {
  constructor(name) {
    this.name = name;
  }

  insertToDb() {
    const sql = `INSERT INTO department (department_name)
    VALUES (?)`;

    db.query(sql, this.name, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      else {
        console.log(results);
      }
    })
  } 
}

// add role
// name, salary, dept of role
// adds to db

// add an employee
// first name, last name, role, manager, adds to DB

// update employee role
// selects employee to update (add as parameter)
// db is updated

module.exports = Department;