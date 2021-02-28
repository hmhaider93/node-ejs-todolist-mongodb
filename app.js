//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB",{useUnifiedTopology:true,useNewUrlParser:true});

const itemsSchema = {
    name: String
};

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List",listSchema);

const Item = mongoose.model("Item",itemsSchema)

const item1 = new Item({
    name: "Buy Food"
});

const item2 = new Item({
    name:"Cook Food"
});

const item3 = new Item({
    name: "Eat Food"
});

var dayOfWeek = "";




app.get('/', (req, res) => {

    var today = new Date();
    var currentDay = today.getDay();
    dayOfWeek = "";

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

    Item.find(function(error,items){
        if(error) console.log(error);
        else{
            if(items.length === 0){
                    Item.insertMany([item1,item2,item3],function(error){
                    if(error) console.log(error);
                    else console.log("Successfully added items");
                });
            }else{
                res.render("list",{nameOfList:dayOfWeek,listOfItems : items});
            }
        }
    })
   

    

    // res.sendFile(__dirname + "/index.html");
});

app.post('/',function(req,res){
    var itemToAdd = req.body.task;
    var listName = req.body.button.trim();
    console.log(dayOfWeek + " " + listName);
    if(listName === dayOfWeek){
        if(itemToAdd !== ""){
            const newItem = new Item({
                name: itemToAdd
            });
            newItem.save()
        }
        
        res.redirect('/');
    }else{
        console.log(listName);
        List.findOne({name:listName},(err,list)=>{
            console.log(list);
            const newItem = new Item({
                name: itemToAdd
            });
            list.items.push(newItem);
            list.save();
            res.redirect('/'+listName)
        })
    }
    
})


app.post('/delete',(req,res)=>{
    const itemId = req.body.checkbox.trim(); 
    const listName = req.body.listName.trim();
    console.log(listName);
    if(listName === dayOfWeek){
        Item.findByIdAndRemove(itemId,(err)=>{
            if(err) console.log(err);
            else {console.log("successfully deleted item");
            res.redirect('/')}
        })
    }else{
        console.log("Going to try to delete : " + itemId);
        List.findOneAndUpdate({name: listName},{$pull:{items:{_id:itemId}}},function(err,foundList){
            if(err) console.log(err);
            else {
                console.log("Match found and deleted item from list: " + foundList);
                res.redirect('/' + listName);
            }
        });
    }
    
});

app.get('/favicon.ico' ,(req,res)=>{
    console.log("Favicon was called and ignored");
})

app.get('/:listName',function(req,res){
    const listName = req.params.listName.trim();
    console.log("List Name: " + listName);
    

    List.findOne({name:listName},function(err,list) {
        if(err) console.log(err);
        else {
            if(list !== null){
                console.log("list Exists");
                List.findOne({name:listName},function(error,list){
                    console.log(list.items);
                    res.render("list",{nameOfList:listName,listOfItems : list.items});
                })
                
            }else{
                console.log("List doesn't exist");
                console.log("Want to create new list: " + listName);
                const list = new List({
                    name: listName,
                    items: [item1,item2,item3]
                });
                list.save().then(function(){
                    res.redirect('/' + listName);
                });
                
                } 
        }
    })

    




})





app.listen(port, () => console.log(`Example app listening on port port!`));