var Table= require("cli-table");
var mysql = require("mysql");
var inquirer = require("inquirer");
var chalk = require("chalk");

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
	console.log("\n\n" + chalk.bold("* * * ENTERING SUPERVISOR VIEW * * *")+"\n\n")	
	purchaseProduct();
});


// prints table representing the bamazon.products table and prompt user for item purchase
function purchaseProduct(){
	connection.query("SELECT * FROM products ORDER BY department_name ASC, product_name ASC", function(err, results) {
    	if (err) throw err;
    	// instantiate
    	var table = new Table({
    		head: [chalk.bold.redBright('item_id'), chalk.bold.redBright('product_name'),chalk.bold.redBright('department_name'), chalk.bold.redBright('price'),chalk.bold.redBright('stock_quantity')]
  			, colWidths: [10, 20, 20, 10, 20]
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
				message:"What is the ID of the item you would like to purchase? [Quit with Q]",
				validate: function(value) {
					if (value > results.length || value < 1){
						console.log("\n\n * * * Invalid item ID * * *\n\n")
						return false;
					}
					if (isNaN(value) === false) {
						return true;
					}
					if(value === "Q" || value ==="q"){
						runQuit();
					}
					return false;
				}
			},
			{
				name: "userQuantity",
				type: "input",
				message: "How many would you like? [Quit with Q]",
				validate: function(value) {
					if (value < 0){
						console.log("\n\n* * * We don't want your handouts ("+chalk.bold.black("enter a positive number")+") * * *\n\n")
						return false;
					}
					if(isNaN(value) === false) {
						return true;
					}
					if(value === "Q" || value === "q") {
						runQuit();
					}
					return false;
				}
			}
		]).then(function(answer){
			connection.query("SELECT product_name, price, stock_quantity, product_sales FROM products WHERE ?", [{item_id: answer.userItem}], function(err, res) {
				if (err) throw err;
				if(res[0].stock_quantity < answer.userQuantity) {
					console.log("\n\n"+chalk.bold.redBright("* * * INSUFFICIENT QUANTITY * * *"),
								"\nUnfortunately, we only have", res[0].stock_quantity,"units of that item available.\n\n")
					continueShopping();
				}

				else{
					var newStockQuantity = res[0].stock_quantity - answer.userQuantity;
					var productCost = res[0].price * answer.userQuantity;
					var newProductSales = res[0].product_sales + productCost;
					connection.query("UPDATE products SET ? WHERE ?",
						[
							{
								stock_quantity: newStockQuantity,
								product_sales: newProductSales
							},
							{
								item_id: answer.userItem
							}
						],
						function(error){
							if (error) throw err;
							console.log("\n\n"+chalk.bold("* * * THANK YOU * * *")+
										"\nYour total cost is $" + productCost +
										"\nYou have successfully "+chalk.bold("PURCHASED ")+ answer.userQuantity + " unit(s) of "+ res[0].product_name+"\n\n");
							continueShopping();
						});
				}
			})
		});
	});

};

// prompts user to select whether they would like to exit app or continue shopping
function continueShopping() {
	inquirer.prompt([
		{
			name: "userInput",
			type: "list",
			choices: ["Yes", "No"],
			message: "Would you like to continue shopping?"
		}
		]).then(function(ans){
			if(ans.userInput === "Yes"){
				return purchaseProduct();
			}
			else{
				runQuit();
			}
		})
}

function runQuit(){
	console.log("\n\n"+chalk.bold("* * * EXITING CUSTOMER VIEW * * *")+"\n")
	process.exit();
};
