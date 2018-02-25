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
	startMenu();
});

function startMenu() {
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
				choices: ["View Product Sales By Department", "Create New Department", "Quit"],
				message: "What would you like to do?"
			}
			]).then(function(answer){
				switch(answer.userInput) {

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

};

function createDept() {

};

function runQuit(){
	console.log("\n* * * EXITING SUPERVISOR VIEW * * *\n")
	process.exit();
};