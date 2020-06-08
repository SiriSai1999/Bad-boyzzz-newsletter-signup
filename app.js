// jshint esversion: 6

const express = require("express");
const request = require("request");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const fName = req.body.firstName;
  const lName = req.body.lastName;
  const email = req.body.inputEmail;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: fName,
        LNAME: lName
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us10.api.mailchimp.com/3.0/lists/50e0d4f45f";

  const options = {
    auth: 'Sai:d3b6f1ac5f3c8391391640daa08defd5-us10',
    method: 'POST'
  };

  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    res.on("data", function(data) {
      console.log(JSON.parse(data), res.statusCode);
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure",function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on 3000");
});
