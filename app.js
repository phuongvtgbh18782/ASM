const express = require('express')
const hbs = require('hbs')
const mongodb = require('mongodb')
const app = express();
app.set('view engine','hbs');
hbs.registerPartials(__dirname +'/views/partials')

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb+srv://truongsonic:truongsonic@cluster0.vezb1.mongodb.net/test';
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'))

app.get('/',async (req,res)=>{
    let client = await mongodb.MongoClient.connect(url);
    let dbo = client.db("ProductDB2");
    let results = await dbo.collection("users").find({}).toArray();
    res.render('login',{model:results})
})

app.get('/home',(req,res)=>{
    res.render('index');
})

app.post('/doLogin', async (req,res)=>{
    let nameI = req.body.txtNameUs;
    let passwordI = req.body.txtPasswordUs;
    let client = await MongoClient.connect(url);
    let dbo = client.db("ProductDB2");

    let results = await dbo.collection("users").findOne({userName:nameI,password:passwordI});
    if(!results){
        res.end('User account or password incorrect')
    }
    else{
        res.render('index',{model:results})
    }
})

app.get('/exit',(req,res)=>{
    res.render('login')
})

app.get('/logout',(req,res)=>{
    res.render('login')
})

app.get('/viewUser', async (req,res)=>{
    let client = await mongodb.MongoClient.connect(url);
    let dbo = client.db("ProductDB2");
    let results = await dbo.collection("users").find({}).toArray();
    res.render('viewUser',{model:results})
})

app.get('/view', async (req,res)=>{
    let client = await mongodb.MongoClient.connect(url);
    let dbo = client.db("ProductDB2");
    let results = await dbo.collection("products").find({}).toArray();
    res.render('viewProduct',{model:results})
})

app.get('/insert',(req,res)=>{
    res.render('newProduct');
})

app.use(bodyParser.urlencoded({extended: false}));
app.post('/doInsert',async (req,res)=>{
    let nameInput = req.body.txtName;
    let sizeInput = req.body.txtSize;
    let amountInput = req.body.txtAmount;
    let priceInput = req.body.txtPrice;
    let client = await MongoClient.connect(url);
    let dbo = client.db("ProductDB2");
    let newProduct = {productName: nameInput,size: sizeInput, amount: amountInput, price: priceInput};
    await dbo.collection("products").insertOne(newProduct);

    res.redirect('/viewProduct');

})

app.post('/doSearch',async(req,res)=>{
    let nameInput = req.body.txtName;
    let client = await MongoClient.connect(url);
    let dbo = client.db("ProductDB2");
    let results = await dbo.collection("products").find({productName:nameInput}).toArray();
    res.render('viewProduct',{model:results})

})

app.get('/delete',async (req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};
    let client = await MongoClient.connect(url);
    let dbo = client.db("ProductDB2");
    await dbo.collection('products').deleteOne(condition);
    res.redirect('/viewProduct');
})

app.get('/Edit',async(req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let client = await MongoClient.connect(url);
    let dbo = client.db("ProductDB2");
    let result = await dbo.collection("products").findOne({"_id" : mongodb.ObjectID(id)});
    res.render('editProduct',{model:result});
})

app.post('/doEdit',async(req,res)=>{
    let id = req.body.id;
    let InputName = req.body.txtName;
    let InputSize = req.body.txtSize;
    let InputAmount = req.body.txtAmount;
    let InputPrice = req.body.txtPrice;
    let newValues = {$set : {productName: InputName, size: InputSize, amount: InputAmount, price: InputPrice}};
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};

    let client = await MongoClient.connect(url);
    let dbo = client.db("ProductDB2");
    await dbo.collection("products").updateOne(condition,newValues);
    let results = await dbo.collection("products").find({}).toArray();
    res.render('viewProduct',{model:results});
    
})

app.get('/newU',(req,res)=>{
    res.render('newUser');
})

app.post('/doAddU',async (req,res)=>{
    let nameU = req.body.txtNameU;
    let passwordU = req.body.txtPassword;
    let client = await MongoClient.connect(url);
    let dbo = client.db("ProductDB2");
    let newProduct = {userName: nameU, password: passwordU};
    await dbo.collection("users").insertOne(newProduct);

    res.redirect('/viewUser');

})

app.get('/EditUser',async(req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let client = await MongoClient.connect(url);
    let dbo = client.db("ProductDB2");
    let result = await dbo.collection("users").findOne({"_id" : mongodb.ObjectID(id)});
    res.render('editUser',{model:result});
})

app.post('/doEditUser',async(req,res)=>{
    let id = req.body.id;
    let nameU = req.body.txtName;
    let passwordU = req.body.txtPassword;
    let newValues = {$set : {userName: nameU, password: passwordU}};
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};

    let client = await MongoClient.connect(url);
    let dbo = client.db("ProductDB2");
    await dbo.collection("users").updateOne(condition,newValues);
    let results = await dbo.collection("users").find({}).toArray();
    res.render('viewUsers',{model:results});
    
})

app.get('/deleteU',async (req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};
    let client = await MongoClient.connect(url);
    let dbo = client.db("ProductDB2");
    await dbo.collection('users').deleteOne(condition);
    res.redirect('/viewUser');
})

var PORT = process.env.PORT || 2999
app.listen(PORT)
console.log("Server is running!")