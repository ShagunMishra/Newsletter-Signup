//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https"); // a variable to get response from the mailchimp server

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html")
});

app.post("/", function(req, res) {

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us14.api.mailchimp.com/3.0/lists/4119d5f653";

  const options = {
    method: "POST",
    auth: "shagun:d8449a6b5a5d79eabb663e813f08340b-us14"
  }

  //in mailchimp api we could use basic authentication methods
  //in nodejs documentation http function :: auth <string> Basic authentication i.e. 'user:password' to compute an Authorization header.

  const request = https.request(url, options, function(response) { // to get response form the mailchimp Server

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData); // to parse the jsonData
  request.end(); //to end the request

});

app.post("/failure", function(req, res) { // failure route when any failure occur it will br at /failure route
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() { //process.env.PORT to deploy our project on the heroku server
  console.log("Server is running on port 3000");
});

// API Key
// d8449a6b5a5d79eabb663e813f08340b-us14

// List Id
// 4119d5f653
