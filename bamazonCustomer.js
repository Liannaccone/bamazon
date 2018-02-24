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
});

purchaseProduct();

// prints table representing the bamazon.products table
function purchaseProduct(){
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
	inquirer
		.prompt([
			{
				name: "userItem",
				type: "input",
				message:"What is the ID of the item you would like to purchase? [Quit with Q]",
				validate: function(value) {
					if (isNaN(value) === false) {
						return true;
					}
					if(value === "Q" || value ==="q"){
						console.log("\n\nCome back soon!");
						process.exit();
					}
					return false;
				}
			},
			{
				name: "userQuantity",
				type: "input",
				message: "How many would you like? [Quit with Q]",
				validate: function(value) {
					if(isNaN(value) === false) {
						return true;
					}
					if(value === "Q" || value === "q") {
						console.log("\n\nCome back soon!");
						process.exit();
					}
					return false;
				}
			}
		]).then(function(answer){
			connection.query("SELECT stock_quantity FROM products WHERE ?", [{item_id: answer.userItem}], function(err, res) {
				
				if(res[0].stock_quantity < answer.userQuantity) {
					console.log("\n\n* * * INSUFFICIENT QUANTITY * * *",
								"\nUnfortunately, we only have", res[0].stock_quantity,"units of that item available.\n\n")
					continueShopping();
				}
			})
		});
	});

};


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
				console.log("\n\nCome back soon!\n\n")
				process.exit();
			}
		})
}



// function purchaseItem() {
// 	inquirer
// 		.prompt([
// 			{
// 				name: "userItem",
// 				type: "input",
// 				message:"What is the ID of the item you would like to purchase? [Quit with Q]"
// 				// validate: function(value) {
// 				// 	if (isNaN(value) ===false || "Q") {
// 				// 		return true;
// 				// 	}
// 				// 	return false;
// 				// }
// 			},
// 			{
// 				name: "userQuantity",
// 				type: "input",
// 				message: "How many would you like? [Quit with Q]"
// 			}
// 		]).then(function(answer){
// 			console.log("You have purchased "+ answer.userQuantity + " of item " + userItem)
// 		})
// }
 
