exports.task_list = function(req, res){
    var id = req.params.userId;
      req.getConnection(function(err,connection){        
            var query = connection.query('SELECT * FROM task where user_id = ?',[id],function(err,rows)
            {    
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
                task   : input.task,
                status  : input.status,
                user_id : input.user_id
            };
           console.log('save request...', data);
    
            var query = connection.query("INSERT INTO task set ? ",[data], function(err, row)
            {
              if (err)
                  console.log("Error inserting : %s ",err );
                res.setHeader('Content-Type', 'application/json');
                console.log(JSON.stringify(row), '-----------------');
            
               // var response = {status:'success',id:row.insertId}
                res.send(JSON.stringify(row));  
            });
        });
    };
    exports.edit = function(req,res){  
        var id = req.params.id; 
        req.getConnection(function (err, connection) {  
           console.log('Edit request...', id);
            var query = connection.query("select * from task where id = ? ",id, function(err, row)
            {
              if (err)
                  console.log("Error Fetching : %s ",err );
                res.setHeader('Content-Type', 'application/json');
                var responseObj = {status:'success',response:row[0]}
                res.send(JSON.stringify(responseObj));
              
            });
        });
    };
    
    exports.update = function(req,res){ 
        var input = JSON.parse(JSON.stringify(req.body));
        var id = input.id;
        req.getConnection(function (err, connection) {  
            var data = {    
                date    : input.date,
                task   : input.task,
                status   : input.status ,
                user_id : input.user_id 
            };
            connection.query("UPDATE task set ? WHERE id = ? ",[data,id], function(err, rows)
            {
              if (err)
                  console.log("Error Updating : %s ",err );
                  res.setHeader('Content-Type', 'application/json');
                  var responseObj = {status:'success',response:rows};
                  res.send(JSON.stringify(responseObj));
            });
        
        });
    };

    exports.delete = function(req,res){
        
   var id = req.params.id;
  
   req.getConnection(function (err, connection) {
      
      connection.query("DELETE FROM task  WHERE id = ? ",[id], function(err, rows)
      {
          
           if(err)
               console.log("Error deleting : %s ",err );
      });
      
   });
};