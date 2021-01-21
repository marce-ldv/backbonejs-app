var express = require("express");
var path = require("path");
var fs = require("fs");
var uuid = require("node-uuid");

var app = express(),
  database = fs.readFileSync("./data.json").toString();

var data = JSON.parse(database);

app.use(express.static(path.join(__dirname, "public")));

// Add POST, PUT, DELETE methods to the app
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.methodOverride());

// http:localhost:4000
app.get("/", function (req, res) {
  res.sendfile(__dirname + "/index.html");
});

// API REST
app.get("/books", function (req, res) {
  res.send(data);
});

app.get("/books/:id", function (req, res, next) {
  var dato;

  for (var i = 0; i < data.length; i++) {
    var book = data[i];

    if (book.id === req.params.id) {
      dato = book;
    }
  }

  if (dato) {
    res.send(dato);
  } else {
    res.statusCode = 500;
    return res.send("Id not found.");
  }
});

app.post("/books", function (req, res) {
  req.body.id = uuid.v1(4);

  data.push(req.body);

  res.send(200, { id: req.body.id });
});

app.put("/books/:id", function (req, res) {
  var book;

  for (var i = data.length - 1; i >= 0; i--) {
    book = data[i];

    if (book.id === req.params.id) {
      data[i] = req.body;
    }
  }

  res.send(200);
});

app.delete("/books/:id", function (req, res) {
  var elementToDelete;

  for (var i = 0; i < data.length; i++) {
    var book = data[i];

    if (book.id === req.params.id) {
      elementToDelete = i;
    }
  }

  data.splice(elementToDelete, 1);

  res.send(200);
});

app.listen(4000);
