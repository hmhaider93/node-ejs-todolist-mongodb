//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

var items = ["Buy Food","Cook Food", "Eat Food"];

app.get('/', (req, res) => {

    var today = new Date();
    var currentDay = today.getDay();
    var dayOfWeek = "";

    // if(currentDay === 6 || currentDay ===0){
    //     res.write("Yay today is a holiday !");
    // }else{
    //     res.write("<h1>Boo ! I have to work today 😩 </h1>");
    // }

    switch (currentDay) {
        case 0:
            dayOfWeek = "Sunday";
            break;
        case 1:
            dayOfWeek = "Monday";
            break;
        case 2: 
            dayOfWeek = "Tuesday";
            break;
        case 3:
            dayOfWeek = "Wednesday";
            break;
        case 4:
            dayOfWeek = "Thursday";
            break;
        case 5:
            dayOfWeek = "Friday";
            break;
        case 6:
            dayOfWeek = "Sunday";
            break;
    
        default:
            break;
    }

    res.render("list",{nameOfDay:dayOfWeek,listOfItems : items});

    // res.sendFile(__dirname + "/index.html");
});

app.post('/',function(req,res){
    var itemToAdd = req.body.task;
    items.push(itemToAdd);
    res.redirect('/');
})

app.listen(port, () => console.log(`Example app listening on port port!`));