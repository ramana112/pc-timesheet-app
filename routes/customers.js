
/*
 * GET users listing.
 */

exports.list = function(req, res){

  req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT * FROM sheet',function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
            //console.log(rows);
            //res.render('customers',{page_title:"Customers - Node.js",data:rows});
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(rows));
            //res.end(JSON.stringify(rows));  
           
         });
         
         //console.log(query.sql);
    });
  
};

/*exports.edit = function(req, res){
    
    var id = req.params.id;
    
    req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT * FROM customer WHERE id = ?',[id],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
     
           // res.render('edit_customer',{page_title:"Edit Customers - Node.js",data:rows});
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(rows));   
           
         });
         
         //console.log(query.sql);
    }); 
};
*/
/*Save the customer*/
exports.save = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            date    : input.date,
            //address : input.address,
            option   : input.option,
            time  : input.time 
        
        };
       console.log('save request...', data);

        var query = connection.query("INSERT INTO sheet set ? ",[data], function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
          //res.redirect('/customers');
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify('success'));
          
        });
        
       // console.log(query.sql); get raw query
    
    });
};

exports.checkLogin = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            //date    : input.date,
            //address : input.address,
            login   : input.login,
            pwd  : input.pwd 
        
        };
       console.log('save request...', data);

        var query = connection.query("SELECT * from login  where loginId=? && pwd=? ",[data.login,data.pwd], function(err, rows)
        {
  
          if (err){
              console.log("Error inserting : %s ",err );
              res.send("enter valid credentials");
          }
          //res.redirect('/customers');
          
            res.setHeader('Content-Type', 'application/json');
            if(rows.length > 0){
                res.send(JSON.stringify("success"));
            }else{
                res.send(JSON.stringify("failed"));
            }                
           // res.sendFile(__dirname + "./html/customers.html"); 
        });
        
       // console.log(query.sql); get raw query
    
    });
};


/*exports.save_edit = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            name    : input.name,
            address : input.address,
            email   : input.email,
            phone   : input.phone 
        
        };
        
        connection.query("UPDATE customer set ? WHERE id = ? ",[data,id], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/customers');
          
        });
    
    });
};

*/
/*
exports.delete_customer = function(req,res){
          
     var id = req.params.id;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM customer  WHERE id = ? ",[id], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/customers');
             
        });
        
     });
};

*/
