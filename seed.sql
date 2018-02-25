USE bamazon;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 	("Banana", "Food and Drink", 1, 200), 
		("Beanie", "Apparel", 13, 50), 
		("Socks", "Apparel", 8, 80), 
		("Toothbrush", "Necessities", 5, 25), 
		("Sapiens", "Books", 25, 20),
		("The Odyssey", "Books", 25, 20),
		("Lagavulin", "Food and Drink", 65, 15),
		("Water", "Food and Drink", 1, 500),
		("The Godfather", "Films", 15, 20),
		("Casablanca", "Films", 10, 20),
		("Lamp", "Household Goods", 30, 20);


INSERT INTO departments (department_name)
SELECT DISTINCT department_name 
FROM products
ORDER BY department_name ASC;
