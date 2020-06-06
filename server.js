const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");
require("dotenv").config();

let connection = mysql.createConnection({
    host: "localhost",
    user: " root",
    password: process.env.PASSWORD,
    database: "payroll_db"
});

//add for terminate employee
initPrompt = () => {
     inquirer
     .prompt({
        type: 'list',
        name: 'choice',
        message: "Which would you like to access?",
        choices:["End session","Add an employee","Add a department","Add a role","Veiw employees","Veiw departments","Veiw roles and salarys","Change an employees role",
        new inquirer.Separator()
    ],
    default:"Veiw employees"
    })
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

/// add employee

const addEmployee = () => {
    let query = `SELECT (title) FROM roles`;
    let roles = [];
    connection.query(query,(err,result) => {
        if(err) throw err;
        roles = result.map(element => element.title);
    });
    // get managers
    let managerQuery = `SELECT first_name,last_name FROM employees`
    let managers = [];
    connection.query(managerQuery,(err,result) => {
        if(err) throw err;
        managers = result.map(element => `${element.first_name} ${element.last_name}`);
        employeeQuestion(roles,managers) 
    });
};
const employeeQuestion = (roles, managers) => {
    inquirer.prompt([
        {
            type:"input",
            name: "first_name",
            message: "What is the employee's first name?",
            required: "true",
            default:"."
        },
        {
            type:"input",
            name:"last_name",
            message:"What is the employee's last name?",
            required:"true",
            default: "Unknown"

        },
        {
            type: "list",
            name: "role_id", 
            message: "Select the employee's role",
            choices: roles,
            required: "true",   
        },
        {
            type: "list",
            name: "manager_id",
            message: "Select the employee's manager",
            choices: managers,
            required: "true",
            default: "unknown"  
        }
    ]).then(answers => {
        let roleQuery = `SELECT id FROM roles WHERE title = ? `;
        connection.query(roleQuery,[answers.role_id], (err,role_id_result) => {
            if(err) throw err;
            answer.role_id =role_id_result[0].id;
         let mngIdQuery = `SELECT id FROM employees WHERE first_name = ? AND last_name = ?  `;
         connection.query(mngIdQuery, [answers.manager_id], (err,emp_id_result) => {
             if(err) throw err;
             answers.manager_id = emp_id_result[0].id;
             addToTable(answers, "employees");
         });
        });
    })
    .then(() => initPrompt() );
};
// add role
const addRole = () => {
    let query = "SELECT (name) FROM departments";
    let deptName = [];
    connection.query(query,(err,result) => {
        if(err) throw err;
        deptName = result.map(element => element.name);
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
        connection.query(query,[answers.department-id], (err,result) => {
            if(err) throw err;
            answers.salary = parseFloat(answers.salary);
            answers.department_id = result[0].id;
            insertIntoTable(answers, "roles");

        })
    })
    .then(()=> initPrompt())
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
      insertIntoTable(answer, "departments");
    })
    .then(() => initPrompt());
  };
  


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
initPrompt()
.then(answer => {
    console.log("You have selected", answer.choice);
    switch(answer.choice) {
        case "End session": return terminateApp();
        case "Add and employee": return addEmployee();
        case "Add a department": return addDepartment();
        case "Add a role": return addRole();
        case "Veiw employees": return viewTable("employees");
        case "Veiw departments": return viewTable("departments");
        case "Veiw roles and salarys": return viewTable("roles");
        case "Change an employees role": return changeEmployeeRole();
      
    }
});
