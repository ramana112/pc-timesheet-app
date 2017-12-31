exports.list = function(req, res){
  req.getConnection(function(err,connection){
        var query = connection.query('SELECT * FROM user',function(err,rows){
            if(err)
            console.log("Error Selecting : %s ",err );
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(rows));
         });
    });
};

exports.checkLogin = function(req,res){
    var input = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function (err, connection) {
        var data = {
            login   : input.login,
            pwd  : input.pwd 
        };
        console.log('Login request...', data);
        var query = connection.query("SELECT * from user  where loginId=? && pwd=? ",[data.login,data.pwd], function(err, rows){
            if (err){
                console.log("Error checking : %s ",err );
                res.send("Problem with server.");
            }
            res.setHeader('Content-Type', 'application/json');
            var result = {};
            if(rows.length > 0){
                result.status= 'success';
                result.response = rows[0];
            }else{
                result.status= 'Failed';
                result.message='Enter Valid Credentials';
                result.response = rows[0];
            }                
            res.send(JSON.stringify(result));
        });
    });
};