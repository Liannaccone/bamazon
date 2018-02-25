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
	console.log("\n\n* * * ENTERING MANAGER VIEW * * *\n\n")	
	startMenu();
});

function startMenu() {
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
	connection.query("SELECT * FROM products ORDER BY department_name ASC, product_name ASC", function(err, results) {
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
		startMenu();
	});
};

function viewLowInventory(){
	connection.query("SELECT * FROM products WHERE stock_quantity < 5 ORDER BY department_name ASC, product_name ASC", function(err, results) {
    	if (err) throw err;
    	if (results.length < 1){
    		console.log("\nThere are no items with an inventory count less than 5.\n")
    		startMenu();
    	}
    	else{
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
			startMenu();
		}
	});
};

function addInventory(){
	connection.query("SELECT * FROM products ORDER BY department_name ASC, product_name ASC", function(err, results) {
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
	inquirer
		.prompt([
			{
				name: "userItem",
				type: "input",
				message:"What is the ID of the item you would like to add more inventory to? [Enter R to return to menu]",
				validate: function(value) {
					if (value > results.length || value < 1){
						console.log("\n\n * * * Invalid item ID * * *\n\n")
						return false;
					}
					if (isNaN(value) === false) {
						return true;
					}
					if(value === "R" || value ==="r"){
						startMenu();
					}
					return false;
				}
			},
			{
				name: "userQuantity",
				type: "input",
				message: "How many would you like to add? [Enter R to return to menu]",
				validate: function(value) {
					if (value < 0){
						console.log("\n\n* * * Are you trying to steal from Bamazon? (enter a positive number) * * *\n\n")
						return false;
					}
					if(isNaN(value) === false) {
						return true;
					}
					if(value === "R" || value === "R") {
						console.log("\n\nCome back soon!");
						process.exit();
					}
					return false;
				}
			}
		]).then(function(answer){
			connection.query("SELECT product_name, price, stock_quantity FROM products WHERE ?", [{item_id: answer.userItem}], function(err, res) {
				if (err) throw err;
				var newStockQuantity = res[0].stock_quantity +answer.userQuantity;
				connection.query("UPDATE products SET ? WHERE ?",
					[
						{
							stock_quantity: newStockQuantity
						},
						{
							item_id: answer.userItem
						}
					],
					function(error){
						if (error) throw err;
						console.log("\n\n* * * INVENTORY ADDED * * *"+
									"\nYou have successfully added "+ answer.userQuantity + " unit(s) of "+ res[0].product_name +"\n\n");
						startMenu();
					})
				}
			);
		});
	});
};

function addProduct(){
	connection.query("SELECT department_name FROM products GROUP BY department_name", function(err, results) {
		inquirer
			.prompt([
			{
				name: "productName",
				type: "input",
				message: "What is the name of the product you would like to add?"
			},
			{
				name: "productDepartment",
				type: "list",
				message: "Which department does this product fall into?",
				choices: function() {
					var choiceArr = [];
					for(i = 0; i < results.length; i++) {
						choiceArr.push(results[i].department_name);
					}
					return choiceArr;
				}
			},
			{
				name: "productPrice",
				type: "input",
				message: "How much does it cost?",
				validate: function(value) {
					if(value < 1) {
						console.log("\n\n * * * We don't give things out for free here... (enter a positive number) * * *\n\n");
						return false;
					}
					if(isNaN(value) === false) {
						return true;
					}
					return false;
				}
			},
			{
				name: "productStockQuantity",
				type: "input",
				message: "How many do we have?",
				validate: function(value) {
					if(value < 0) {
						console.log("\n\n * * * Enter a positive number * * *\n\n");
						return false;
					}
					if(isNaN(value) === false) {
						return true;
					}
					return false;
				}
			}
			]).then(function(ans){
				connection.query("INSERT INTO products SET ?",
				{
					product_name: ans.productName,
					department_name: ans.productDepartment,
					price: ans.productPrice,
					stock_quantity: ans.productStockQuantity
				},
				function(err) {
					if (err) throw err;
					console.log("\n"+ ans.productName+ " added to Bamazon.\n")
					startMenu();
				})
			})
	});
};

// 
function runQuit(){
	console.log("\n* * * EXITING MANAGER VIEW * * *\n")
	process.exit();
};


