const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const url =
  "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.4";
const client = new MongoClient(url);
const database = "crud";
var app = express();
var response;

async function getData() {
  console.log("Getting data");
  let connection = await client.connect();
  let db = connection.db(database);
  let collection = db.collection("simple");
  response = await collection.find({}).toArray();
  console.log("end of getting data");
  return response;
}
app.get("/display", function (req, res) {
  getData().then((data) => {
    res.render("index.ejs", { response: data });
  });
});
////////////////////////////////////////////////////////////////////////////////////
async function addData(nm, em, ps, sp) {
  console.log("Adding data");
  let connection = await client.connect();
  let db = connection.db(database);
  let collection = db.collection("simple");
  collection.insertOne({
    name: nm,
    password: ps,
    email: em,
    superpower: sp,
  });
  response = await collection.find({}).toArray();
  console.log("DATA added");
  return response;
}

app.get("/addData", function (req, res) {
  console.log(req.query.name);
  console.log(req.query.email);
  console.log(req.query.password);
  console.log(req.query.superpower);

  let name = req.query.name;
  let email = req.query.email;
  let password = req.query.password;
  let superpower = req.query.superpower;
  addData(name, email, password, superpower).then((data) => {
    res.render("index.ejs", { response: data });
  });
});

app.get("/add", function (req, res) {
  res.render("add.ejs", {});
});
/////////////////////////////////////////////////////////////////////

async function deleteData(nm) {
  console.log("Data deleted");
  let connection = await client.connect();
  let db = connection.db(database);
  let collection = db.collection("simple");
  collection.deleteOne({
    name: nm,
  });
  response = await collection.find({}).toArray();
  console.log("DATA added");
  return response;
}

app.get("/dD", function (req, res) {
  console.log(req.query.name);
  let name = req.query.name;
  deleteData(name).then((data) => {
    res.render("delete.ejs", { response: data });
  });
});
////////////////////////////////////////////////////////////////

app.listen(8088);
