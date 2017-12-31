exports.sheet_list = function(req, res){
    var id = req.params.userId;
    req.getConnection(function(err,connection){ 
        var query = connection.query('SELECT * FROM time_sheet where user_id = ?',[id] ,function(err,rows){  
        if(err)
            console.log("Error Selecting : %s ",err );
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(rows));
         });
    });
};

exports.save = function(req,res){  
    var input = JSON.parse(JSON.stringify(req.body)); 
    req.getConnection(function (err, connection) {  
        var data = { 
            date    : input.date,
            option   : input.option,
            time  : input.time,
            updated_on : new Date(),
            user_id : input.user_id 
        };
       console.log('save request...', data);
        var query = connection.query("INSERT INTO time_sheet set ? ",[data], function(err, row)
        {
          if (err)
            console.log("Error inserting : %s ",err );
            res.setHeader('Content-Type', 'application/json');
            console.log(JSON.stringify(row), '-----------------');
            data.id = row.insertId;
            var result = {status:'success',response:data}
            res.send(JSON.stringify(result));   
        });
    });
};

