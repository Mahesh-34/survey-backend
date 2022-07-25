const res = require("express/lib/response");
const db = require("../models");
const Admin = db.admins;
const User = db.users;
const Survey = db.surveys;
const CompeletdSurvey = db.completedsurveys;

exports.dashboard = (req, res) => {
  var data = hello();
  res.send(data);
};

const getdata = async () => {
  var mydata = [];
  var users;
    var admins;
    var surveys;
    var completedsurveys;
    await Survey.count()
      .then(data => {
        surveys = data;
      })
      await User.count()
      .then(data => {
        users = data;
      })
      await Admin.count()
      .then(data => {
        admins = data;
      })
      await CompeletdSurvey.count()
      .then(data => {
        completedsurveys = data;
      })

      mydata.users = users;
      mydata.admins = admins;
      mydata.surveys = surveys;
      mydata.completedsurveys = completedsurveys;

      console.log(mydata);  
      /*while (mydata.length == 4) {
      return hello;
    }*/

    return 'Hello';

      
}

function hello(){
  return getdata();
}