const http = require('http'),
      fs   = require('fs'),
      port = 3000

// Express server
const express = require('express'),
      app = express(),
      purecss = require('purecss')

app.use(express.static('public'))
app.use(express.json())

// CSS framework: normalize.css + purecss
app.use(express.static('node_modules/normalize.css'))
app.use(express.static('node_modules/purecss/build'))

// Database setup
const dotenv = require('dotenv').config(),
      uri = `${process.env.MONGODB_URI}`,
      { MongoClient, ObjectID } = require('mongodb'),
      client = new MongoClient(uri),
      databasename = 'sample_mflix',
      collectionname = 'comments',
      recipes = []
let nextindex = 0;

app.get('/allrecipes', async (req,res) => {
  res.send(JSON.stringify(recipes))
})

app.post( '/newrecipe', async (req,res) => {
  const newrecipe = req.body
  newrecipe.totaltime = newrecipe.preptime + newrecipe.cooktime
  newrecipe.index = nextindex
  nextindex++
  recipes.push(newrecipe)
  res.writeHead(200, {'Content-Type':'application/json'})
  res.end(JSON.stringify(newrecipe))
})

app.post( '/deleterecipe', async (req,res) => {
  console.log(req.body)
  index = req.body.index
  recipes.splice(index,1)

  res.writeHead(200, 'OK', {'Content-Type':'text/plain'})
  res.end('ok')
})

app.listen(process.env.PORT || port)
