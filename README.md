# Bamazon

An Amazon-like storefront node application that utilizes MySQL to store data. 

The application has three interfaces:
 * Customer View
	* Users can submit orders which deplete stock from the store's inventory.
 * Manager View
	* Users can track product sales across Bamazon's departments, view items with a low inventory, add quantities to selected inventories, and add new products to the database within department parameters created within the Supervisor View.
 * Supervisor View
	* Users can view the highest-grossing departments in the store (total sales and profits by item department) and create departments within Bamazon.

## Setup
* Clone the repository.
* Install Javascript packages: 

	Navigate to the file in your terminal and confirm whether or not the package.json file is in the folder with the required dependencies. If the package.json file is there, run:

  ```
  npm install
  ```

  Otherwise, install each package as follows:

  ```
  npm install chalk cli-table mysql inquirer
  ```


* You will now be able to run the corresponding .js files for the three interfaces as described above using command line inputs:
  ```
  node bamazonCustomer.js
  ```
  
  ```
  node bamazonManager.js
  ```

  ```
  node bamazonSupervisor.js
  ```

## Usage

### Bamazon Customer

![alt text](assets/images/bamazonCustomer.gif "Bamazon Customer Demo")

### Bamazon Manager

![alt text](assets/images/bamazonManager.gif "Bamazon Manager Demo")

## Technology Used
- Javascript
- Node.js 
- Node Packages:
  - Chalk
  - CLI Table
  - Inquirer
  - MySQL
- MySQL

