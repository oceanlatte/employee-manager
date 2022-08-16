const db = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');

const Department = require('./lib/Department');
// const { getAllDepartments, getAllEmployees, getAllRoles } = require('./utils/queries');
const { checkDepartment, checkRole } = require('./utils/queryChecks');


console.log(
  `
  ===================================================
      Welcome to the Employee Management System!
  ===================================================

  Please start with adding a deparment first.
  `
);

const startMenu = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'start',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee',
        'Quit'
      ]
    }
  ])
  .then(data => {
    switch(data.start) {
      case 'View all departments':
        getAllDepartments();
        break;
      case 'View all roles':
        getAllRoles();
        break;
      case 'View all employees':
        getAllEmployees();
        break;
      case 'Add a department':
        newDepartment();
        break;
      case 'Add a role':
        newRole();
        break;
      case 'Add an employee':
        // send to getManagerList first to get array of managers
        getManagerList();
        break;
      case 'Update an employee':
        getEmployeeToUpdate();
        break;
      case 'Quit':
        confirmQuit();
        break;
    }
  });
};

const getAllDepartments = () => {
  db.query(`SELECT * FROM department`, (err, results) => {
    if (err) {
      console.log(err);
    }
    else if (results.length == 0) {
      console.log(`
  Oh no! There are no departments listed yet. Please start there first!
          `);
      startMenu();
    }
    else {
      console.table(results);
      startMenu();
    }
  });
}

// ----ADD NEW: Dept, Role, Employee functions----
const newDepartment = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'dept',
      message: 'What is the new department name?'
    }
  ])
  .then(data => {
    const dept = new Department (data.dept);
    // spacing for better visibility on command line
    console.log(`
  New department ${data.dept} added!
    `);
    dept.insertToDepartment();
    startMenu();
  });
};

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
    else if (rows.length == 0) {
      console.log(`
  Oops, there are no roles listed yet!
          `);
      startMenu();
    }
    else {
      console.table(rows);
      startMenu();
    }
  });
}


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
    else if (rows.length === 0) {
      console.log(`
  Oops, there are no employees listed yet!
          `);
      startMenu();
    }
    else {
      console.table(rows);
      startMenu();
    }
  })
}; 

const newRole = () => {
  // get list of departments for choosing which dept role belongs to
  db.query({sql: `SELECT department_name FROM department`, rowsAsArray: true}, (err, results) => {
    if (err) {
      console.log(err);
    }
    else if (results.length === 0) {
      console.log(`
  Oh no, please add at least one department before adding a role!
          `);
      startMenu();
    }
    else {
      // results populate as array within array. flatMapped to get correct depth
      const deptArr = results.flatMap(index => index);
      
      inquirer.prompt([
        {
          type: 'input',
          name: 'roleName',
          message: 'What is the name of the new role?'
        },
        {
          type: 'input',
          name: 'salary',
          message: 'What is the salary for this role?'
        },
        {
          type: 'list',
          name: 'roleId',
          message: 'What department does this role belong to?',
          choices: deptArr
        },
        {
          type: 'confirm',
          name: 'managmentRole',
          message: 'Is this a managment position?'
        }
      ])
      .then(data => {
        if (data.managmentRole) {
          // send to  find index of selected role from dept table for Role constructor
          checkDepartment(data.roleName, data.salary, data.roleId, 1);

          // extra spacing for visibility on command line
          console.log(`
  New role ${data.roleName} added!
          `);


          startMenu();
        }
        else {
          checkDepartment(data.roleName, data.salary, data.roleId, 0);
          startMenu();
        }
      });
    }
  });
};

const getManagerList = () => {
  const query = 
  `SELECT 
    employee.id, employee.manager_id,
    CONCAT (employee.first_name, ' ' , employee.last_name) AS manager,
    role.title,
    role.managment_role
  FROM employee
  LEFT JOIN 
    role ON employee.role_id = role.id AND role.managment_role;`;

  db.query({sql: query, rowsAsArray: true}, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    // else if (result.length === 0) {
    //   const noManagers = ['None'];
    //   newEmployee(noManagers);
    // }
    else {
      // filter result to remove any manager_id that is null, then maps to get only names
      const managerFilter = result
        .filter(i => i[4] !== null)
        .map(i => i[2]);

        // adding option of no manager to array
        managerFilter.push('None');
      newEmployee(managerFilter);
    }
  });
};

const newEmployee = (managersNameArr)  => {

  // get list of departments for choosing which dept role belongs to
  db.query({sql: `SELECT title FROM role`, rowsAsArray: true}, (err, results) => {
    if (err) {
      console.log(err);
    }
    else if (results.length === 0) {
      console.log(`
  Oh no, make sure to add at least one role and one department before adding an employee!
          `);
      startMenu();
    }
    else {
      const rolesArr = results.flatMap(index => index);


      inquirer.prompt([
        {
          type: 'input',
          name: 'firstName',
          message: 'What is their first name?'
        },
        {
          type: 'input',
          name: 'lastName',
          message: 'What is their last name?'
        },
        {
          type: 'list',
          name: 'role',
          message: 'What is their role?',
          choices: rolesArr // roles gotten from db query above
        },
        {
          type: 'list',
          name: 'manager',
          message: 'Who is their manager?',
          choices: managersNameArr // array passed from managerList function
        }
      ])
      .then(data => {
        const { firstName, lastName, role, manager } = data;
        // new query to get the manager from DB that matches name chosen

        if (manager === 'None') {
          checkRole(firstName, lastName, role, manager);

          console.log(`
  New employee ${firstName} ${lastName} added!
          `);

          startMenu();
        }
        else {
        const sql = `SELECT * FROM employee
        WHERE CONCAT(first_name, ' ', last_name) = '${manager}'`;
        
        db.query(sql, (err, result) => {
          // get manager id number from the query to send to the constructor
          const managerId = result[0].id;
          // send to checkRole() to find the role index needed for Employee constructor
          checkRole(firstName, lastName, role, managerId);

          console.log(`
  New employee ${firstName} ${lastName} added!
          `);

          startMenu();
        });
      }
      });
    }
  });
};

const getEmployeeToUpdate = () => {
  const query = 
  `SELECT CONCAT(first_name, ' ', last_name) AS full_name
  FROM employee`; 

  db.query({sql: query, rowsAsArray: true}, (err, result) => {
    if (err) {
      console.log(err);
    }
    else if (result.length === 0) {
      console.log(`
      Ope, no employees found to update.
          `);
      startMenu();
    }
    else {
      // db query returns array, flatMap array to return only employee names
      const employeeArr = result.flatMap(i => i);

      inquirer.prompt([
          {
            type: 'list',
            name: 'employee',
            message: 'Which employee would you like to update?',
            choices: employeeArr
          }
      ])
      .then(data => {
        newRoleForUpdate(data.employee);
      });
    }
  });
};

const newRoleForUpdate = employee => {
  const query = `SELECT title FROM role`;

  db.query({sql: query, rowsAsArray: true}, (err, results) => {
    if (err) {
      console.log(err);
    }
    else {
      // db query returns array, then flatMap to get only names from array
      const rolesArr = results.flatMap(i => i);

      inquirer.prompt([
        {
          type: 'list',
          name: 'newRoleName',
          message: 'What is their new role?',
          choices: rolesArr
        }
      ])
      .then(data => {
        checkRole(null, null, data.newRoleName, null, employee);
        // spacing for better visibility on command line
        console.log(`
  ${employee}'s info has been updated.
        `);
        startMenu();
      })
    }
  });
};

const confirmQuit = () => {
  return inquirer.prompt([
    {
      type: 'confirm',
      name: 'quit',
      message: 'Are you sure you would like to quit the program?'
    }
  ])
  .then(data => {
    if (data.quit) {
      // if quit was true then say goodbye
      console.log(`
  Okay, goodbye!!
      `);
      return;
    }
    else {
      startMenu();
    }
  });
};

startMenu();
