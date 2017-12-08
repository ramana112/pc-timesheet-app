var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "timesheet"
});

con.connect(function(err) {
  if (err){
    throw err;
  } else {
    console.log(" Connected!");
    con.query("SELECT * FROM sheet", function (err, result, fields) {
      if (err) throw err;
        console.log(result);
        result.forEach(function(element) {
          console.log(element.id+' '+element.date+' '+element.option+' '+element.time);
        }, this);
    });
  }
  
});


