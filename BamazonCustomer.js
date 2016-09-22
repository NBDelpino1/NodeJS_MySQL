var mysql = require('mysql');
var inquirer = require('inquirer');

//---------------------------------------------------------------------------------------------------------------------------------------------

//1.set up connection to db
var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root", //username
    password: "root", //password
    database: "Bamazon"
});

//2.connect to db
connection.connect(function(err) {
    if (err) throw err; //if problem with connection, throw error
    console.log("connected as id " + connection.threadId); //if not, print connection details
});

//3.get list of products from db so we can display them to the user
connection.query('SELECT * FROM `Products` LIMIT 15', function(err, results) { 
    if (err) {
        throw err; //if problem with results from db, throw error
    }
    for (var i = 0; i < results.length; i++) { //if not, loop through results and print requirements to console
        console.log(results[i].id + " | " + results[i].ProductName + " | " + results[i].DepartmentName + " | " + results[i].Price);
    }
    console.log("-------------------------------------------------------------------") //seperator
    start();//kick start user interaction (prompts etc)
});

//4.provide prompts so user can select what they want to buy
var start = function() { 

    inquirer.prompt([{
            type: 'input',
            name: 'id', //take in the id of the product the user selected
            message: 'What is the product ID#? '
        }, {
            type: 'input',
            name: 'StockQuantity', //take in the quantity of the product the user previously selected
            message: 'How many would you like to purchase?',
        }]).then(function(answer) { 

//5.store user selection so we can check if we have it in stock later
            var idEntered = answer.id; 
            var quantityEntered = answer.StockQuantity;
            console.log("prompt values" + idEntered, quantityEntered); //quick test to make sure values stored in variables match user input 
            
//6.query user selection in db
            connection.query('SELECT * FROM Products WHERE id =' + idEntered, function(err, response) { 

                if (err) throw err; //if problem with results from db, throw error
 
                console.log(response[0].ProductName); //test to make sure data correlates, shows user product name if the id they seletced
                
//7.determine if we have user selection in stock      
                compare(response, quantityEntered); 
            }); //end connection query 

        }) //end of then function

}; //end of start function


//---------------------------------------------------------------------------------------------------------------------------------------------

//function that checks stock
function compare(response, quantityEntered) { //used to compare db response to user input to see if available
        console.log("compare values" + response, quantityEntered); //actual comparison done here
        if (response[0].StockQuantity >= quantityEntered) {
            console.log("good to go!!!!");
            //now you need to remove the quantity entered son from the db
            //look uop delete or remove statmenmt MYSQL
        } else {
            console.log("sorry buddy");
        }
    }
    // connection.end()