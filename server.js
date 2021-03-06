const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");
require("dotenv").config();

let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "payroll_db"
});

//add for terminate employee
 initPrompt = () => {
     inquirer
     .prompt({
        type: 'list',
        name: 'choice',
        message: "Which would you like to access?",
        choices:[
        "End session",
        "Add an employee",
        "Add a department",
        "Add a role",
        "Veiw employees",
        "Veiw departments",
        "Veiw roles and salarys",
        "Update employee",
         ],
         default:"Veiw employees"
  })

.then(answer => {
    console.log("You have selected", answer.choice);
    switch(answer.choice) {
        case "End session": return terminateApp();
        case "Add an employee": return addEmployee();
        case "Add a department": return addDepartment();
        case "Add a role": return addRole();
        case "Veiw employees": return viewTable("employees");
        case "Veiw departments": return viewTable("departments");
        case "Veiw roles and salarys": return viewTable("roles");
        case "Update employee": return updateEmployee();
      
    }
});
}


// viewtable function
const viewTable = (tableName) => {
    let query = `SELECT * FROM ${tableName}`;
    connection.query(query,(err,result)=> {
        if(err) throw err;
        const table = consoleTable.getTable(result);
        console.log(table);
        initPrompt();
    });
};

const viewJoinedTable = () => {
    let query= `SELECT employees.*, roles.title AS role_name 
    FROM employees
    INNER JOIN roles
    ON employees.role_id = roles.id
    `
    connection.query(query,(err,result)=> {
        if(err) throw err;
        console.log(consoleTable.getTable(result))
        initPrompt()
    })
    
}
/// add employee



function addEmployee() {
    inquirer
    .prompt([
        {
            type: 'input',
            message: 'Enter employee first name',
            name: 'firstname'
        },
        {
            type: 'input',
            message: 'Enter employee last name',
            name: 'lastname'
        },
        {
            type: 'input',
            message: 'What is the employees role id',
            name: 'rolesID'
        },
        {
            type: 'input',
            message: 'What is the employees manager id',
            name: 'managerID'
        }
    ])
    .then(function(answer) {
        connection.query(
            'INSERT INTO employees SET ?',
            {
                first_name: answer.firstname,
                last_name: answer.lastname,
                role_id: answer.rolesID,
                manager_id: answer.managerID
            },
            function(err, answer) {
                if (err) {
                    throw err;
                }
                
                viewTable('employees');
            }
        );
        viewJoinedTable();
    });
}
// add role
const addRole = () => {
    let query = "SELECT (name) FROM departments";
    let deptNames = [];
    connection.query(query,(err,result) => {
        if(err) throw err;
        deptNames = result.map(element => element.name);
        roleQuestion(deptNames)
    })
}
const roleQuestion = (deptNames) => {
    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "What is the role name?",
            required: "true",
            default: "default-role"
          },
          {
            type: "input",
            name: "salary",
            message: "What is the yearly salary for the role",
            required: "true",
            default: "0"
          },
          {
            type: "list",
            name: "department_id",  
            message: "Select a department",
            choices: deptNames,
            required: "true",
          }

    ])
    .then(answers => {
        let query = `SELECT id FROM departments WHERE name = ? `;
        connection.query(query,[answers.department_id], (err,result) => {
            if(err) throw err;
            answers.salary = parseFloat(answers.salary);
            answers.department_id = result[0].id;
            addToTable(answers, "roles");

        })
    })
    .then(()=> viewJoinedTable())
}
//add department
const addDepartment = () => {
    inquirer.prompt({
      type: "input",
      name: "name",
      message: "What is the name of the department you would like to add?",
      required: "true",
      default: "nothing"
    })
    .then(answer => {
      addToTable(answer, "departments");
    })
    .then(() => initPrompt());
  };
  // update employee
  const updateEmployee = () => {
     
    inquirer
    .prompt({
      name: "id",
      type: "input",
      message: "Enter employee id",
    })
    .then(function (answer) {
      var id = answer.id;

      inquirer
        .prompt({
          name: "roleId",
          type: "input",
          message: "Enter role id",
        })
        .then(function (answer) {
          var roleId = answer.roleId;

          var query = "UPDATE employee SET roles_id=? WHERE id=?";
          connection.query(query, [roleId, id], function (err, res) {
            if (err) {
              console.log(err);
            }
            viewJoinedTable();
          });
        });
    });
}
  

  


// add to table function
const addToTable = ((answers,tableName)=> {
    let query = `INSERT INTO ${tableName} SET ?`;
  connection.query(query, answers, (err,result) => {
      if(err) throw err;
  });
});
addToTable.catch = err => {
    console.log("ERROR in addToTable()");
  }
/// function to terminate app
const terminateApp = () => {
    console.log("Thank you, Goodbye");
    connection.end();
    process.exit(0);
};


const initLog = () => {
    
    console.log(`

     /$$$$$$$                     /$$$$$$$            /$$ /$$
    | $$__  $$                   | $$__  $$          | $$| $$
    | $$  \ $$ /$$$$$$  /$$   /$$| $$  \ $$  /$$$$$$ | $$| $$
    | $$$$$$$/|____  $$| $$  | $$| $$$$$$$/ /$$__  $$| $$| $$
    | $$____/  /$$$$$$$| $$  | $$| $$__  $$| $$  \ $$| $$| $$
    | $$      /$$__  $$| $$  | $$| $$  \ $$| $$  | $$| $$| $$
    | $$     |  $$$$$$$|  $$$$$$$| $$  | $$|  $$$$$$/| $$| $$
    |__/      \_______/ \____  $$|__/  |__/ \______/ |__/|__/
                        /$$  | $$                            
                       |  $$$$$$/                            
                        \______/                             
              /$$$$$$     /$$      /$$      /$$$$$$          
             /$$__  $$   | $$$    /$$$     /$$__  $$         
            | $$  \__/   | $$$$  /$$$$    | $$  \__/         
     /$$$$$$| $$         | $$ $$/$$ $$    |  $$$$$$          
    |______/| $$         | $$  $$$| $$     \____  $$         
            | $$    $$   | $$\  $ | $$     /$$  \ $$         
            |  $$$$$$//$$| $$ \/  | $$ /$$|  $$$$$$/         
             \______/|__/|__/     |__/|__/ \______/          
                                                             
                                                             
                                                             `)
};

initLog();

 viewJoinedTable();
