const inquirer = require("inquirer");
const fs = require("fs");
const mysql = require("mysql2");
const consoleTable = require("console.table");
require('dotenv').config()

let connection = mysql.createConnection({
    host: "localhost",
    user: " root",
    pasword: process.env.PASSWORD,
    database: "payroll_db"
})