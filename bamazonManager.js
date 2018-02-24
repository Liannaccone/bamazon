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
	startMenu();
});

function startMenu() {
	console.log("\n\n* * * ENTERING MANAGER VIEW * * *\n\n")
	inquirer.
		prompt([
			{
				name: "userInput",
				type: "list",
				choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"],
				message: "What would you like to do?"
			}
			]).then(function(answer){
				switch(answer.userInput) {

					case "View Products for Sale":
						return viewProducts();

					case "View Low Inventory":
						return viewLowInventory();

					case "Add to Inventory":
						return addInventory();

					case "Add New Product":
						return addProduct();

					case "Quit":
						return runQuit();
				}
			})		
}



function viewProducts(){
	connection.query("SELECT * FROM products", function(err, results) {
    	if (err) throw err;
    	// instantiate
    	var table = new Table({
    		head: ['item_id', 'product_name','department_name', 'price','stock_quantity']
  			, colWidths: [20, 20, 20, 20, 20]
			});

    	for( i = 0; i < results.length; i++){
			table.push(
			    [results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]
			 );
		}
		console.log(table.toString());
	});
};

function viewLowInventory(){

};

function addInventory(){

};

function addProduct(){

};

function runQuit(){
	console.log("\n* * * EXITING MANAGER VIEW * * *\n")
	process.exit();
};

