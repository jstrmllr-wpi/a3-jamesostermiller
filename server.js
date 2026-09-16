const http = require('http'),
      fs   = require('fs'),
      port = 3000

// Express server
const express = require('express'),
      app = express(),
      purecss = require('purecss')

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// CSS framework: normalize.css + purecss
app.use(express.static('node_modules/normalize.css'))
app.use(express.static('node_modules/purecss/build'))

// Database setup
const dotenv = require('dotenv').config(),
      uri = `${process.env.MONGODB_URI}`,
      { MongoClient, ObjectId } = require('mongodb'),
      client = new MongoClient(uri),
      dbname = 'recipe-website',
      recipecollection = 'recipes'
      usercollection = 'users'
      recipes = [],
      recipedb = client.db(dbname).collection(recipecollection)
      userdb = client.db(dbname).collection(usercollection)
let nextindex = 0;

app.use( (req,res,next) => {
  if(recipedb !== null) {
    next()
  }else{
    res.status(503).send()
  }
})

app.get('/allrecipes', async (req,res) => {
  const result = await recipedb.find({}).toArray()
  console.log('Served recipe list');
  res.json(result)
})

app.post( '/createaccount', async (req,res) => {
  const newuser = req.body
  const preexisting = await userdb.findOne({username:newuser.username})
  console.log('preexisting: '+  preexisting)
  if(preexisting){
    res.redirect('createaccount.html')
    console.log('Account not created')
  }
  else{
    const acknowledgement = await userdb.insertOne(newuser)
    console.log('Account created with username "' + newuser.username + '"');
    res.redirect('index.html')
  }
  // const newrecipe = req.body
  // newrecipe.totaltime = newrecipe.preptime + newrecipe.cooktime
  // const acknowledgement = await recipedb.insertOne(newrecipe)
  // console.log(id)
  // const result = await recipedb.findOne({_id:id})
})

app.post( '/newrecipe', async (req,res) => {
  const newrecipe = req.body
  newrecipe.totaltime = newrecipe.preptime + newrecipe.cooktime
  const acknowledgement = await recipedb.insertOne(newrecipe)
  id = acknowledgement.insertedId
  const result = await recipedb.findOne({_id:id})
  console.log('Recipe "' + newrecipe.name + '" added (id ' + id + ')');
  res.json(result)
})

app.post( '/deleterecipe', async (req,res) => {
  id = new ObjectId(req.body.id)
  const result = await recipedb.deleteOne({_id:id})
  console.log('Recipe ' + id + ' deleted: ' + (result.deletedCount === 1))
  res.json(result)
})

app.listen(process.env.PORT || port)
