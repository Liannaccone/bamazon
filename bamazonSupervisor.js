var Table= require("cli-table");
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "bamazon"
});
 
connection.connect(function(err){
	if (err) throw err;
	console.log("connected as id " + connection.threadId);
	console.log("\n\n* * * ENTERING SUPERVISOR VIEW * * *\n\n")	
	startMenuWithTable();
});

function startMenuWithTable() {
	connection.query("SELECT * FROM products ORDER BY department_name ASC, product_name ASC", function(err, results) {
    	if (err) throw err;
    	// instantiate
    	var table = new Table({
    		head: ['item_id', 'product_name','department_name', 'price','stock_quantity', 'product_sales']
  			, colWidths: [20, 20, 20, 20, 20,20]
			});

    	for( i = 0; i < results.length; i++){
			table.push(
			    [results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity, results[i].product_sales]
			 );
		}
		console.log(table.toString());
	inquirer.
		prompt([
			{
				name: "userInput",
				type: "list",
				choices: ["View Products for Sale","View Product Sales By Department", "Create New Department", "Quit"],
				message: "What would you like to do?"
			}
			]).then(function(answer){
				switch(answer.userInput) {

					case "View Products for Sale":
						return startMenuWithTable();

					case "View Product Sales By Department":
						return viewSalesByDept();

					case "Create New Department":
						return createDept();

					case "Quit":
						return runQuit();
				}
			})	
	})	
}

function viewSalesByDept(){
	connection.query("SELECT department_id, departments.department_name, over_head_costs, SUM(products.product_sales) AS product_sales, product_sales - over_head_costs AS total_profit FROM departments INNER JOIN products ON departments.department_name = products.department_name GROUP BY department_id", function(err, results) {
    	if (err) throw err;
    	// instantiate
    	var table = new Table({
    		head: ['department_id', 'department_name','over_head_costs', 'product_sales', 'total_profit']
  			, colWidths: [20, 20, 20, 20, 20]
			});

    	for( i = 0; i < results.length; i++){
			table.push(
			    [results[i].department_id, results[i].department_name, results[i].over_head_costs, results[i].product_sales, results[i].total_profit]
			 );
		}
		console.log(table.toString());
		showMenu();
	});
};

function createDept() {
	inquirer.
		prompt([
			{
				name: "userDeptName",
				type: "input",
				message: "What is the name of the deparment?"
			},
			{
				name: "userOverheadCost",
				type: "input",
				message: "What is the overhead cost of the department?",
				validate: function(value) {
					if (value < 0) {
						console.log("\n\n * * * enter a positive number * * *\n\n");
						return false;
					}
					if(isNaN(value) === false) {
						return true;
					}
					return false;
				}
			}
			]).then(function(answer){
				connection.query("INSERT INTO departments SET ?",
				{
					department_name: answer.userDeptName,
					over_head_costs: answer.userOverheadCost
				},
				function(err) {
					if (err) throw err;
					console.log("\n" + answer.userDeptName + " department created in Bamazon!\n\n")
					showMenu();
				})
			})
			
};

function showMenu() {
	inquirer.
		prompt([
			{
				name: "userInput",
				type: "list",
				choices: ["View Products for Sale", "View Product Sales By Department", "Create New Department", "Quit"],
				message: "What would you like to do?"
			}
			]).then(function(answer){
				switch(answer.userInput) {

					case "View Products for Sale":
						return startMenuWithTable();

					case "View Product Sales By Department":
						return viewSalesByDept();

					case "Create New Department":
						return createDept();

					case "Quit":
						return runQuit();
				}
			})	
}

function runQuit(){
	console.log("\n* * * EXITING SUPERVISOR VIEW * * *\n")
	process.exit();
};