var app = angular.module("myApp",['ngRoute']);
app.config(function($routeProvider) {
  
  $routeProvider.when('/',{
         templateUrl :"../html/login.html",
         controller: "customerCtrl"
  }).when('/desktop/:pageName',{
    templateUrl: "../html/tasks_list.html",
   controller: "customerCtrl"
}).when('/sheet',{
    templateUrl: "../html/sheet.html",
   controller: "customerCtrl"
})
  .when('/add_customer',{
         templateUrl: "../html/add_customer.html",
        controller: "customerCtrl"
  }).when('/tasks',{
    templateUrl: "../html/tasks.html",
   controller: "customerCtrl"
})
  /*.when('/edit_customer/:operation/:customerId',{
     templateUrl: "../html/edit_customer.html",
    controller: "customerCtrl"
  })*/
  /*.when('/delete_customer/:operation/:customerId',{
     templateUrl: "../html/edit_customer.html",
    controller: "customerCtrl"
  });*/

});

app.controller('customerCtrl',function($scope, $http, $location, $routeParams){
  $scope.customers = [];  
  //$scope.customerToEdit ={};
  $scope.tasksListObj ={};  
  $scope.doLogin = function(details){
    
        $http({
            method:"POST",
            url:" http://localhost:4300/customers/doLogin",
            data: JSON.stringify(details)
        }).then(function successCallback(res){
            if(res.data === 'success'){
              $location.path("/desktop/tasksListPage");
            }else{
                $scope.errorMsg="Wrong Credentials!";
            }
        }, function failureCallback(res){
            $scope.errorMsg=err.statusText;
        });
      };


      $scope.tasksList = function(){
        
            $http({
                method:"GET",
                url:" http://localhost:4300/tasks",
            }).then(function successCallback(res){
                $scope.tasksListObj = res.data;
            }, function failureCallback(res){
                $scope.errorMsg=err.statusText;
            });
          };
      
  $scope.getCustomers = function(){

    $http({
          method:"GET",
          url:" http://localhost:4300/customers"
      }).then(function successCallback(res){
          $scope.customers = res.data;
      }, function failureCallback(res){
          $scope.errorMsg=res.statusText;
      });

  };
   $scope.togglepopup=function(){
       $scope.showpopup=!$scope.showpopup;
   }
  $scope.addCustomers = function(student){

    $http({
          method:"POST",
          url:" http://localhost:4300/customers/add",
          data: JSON.stringify(student)
      }).then(function successCallback(res){
          if(res.data === 'success'){
            $location.path("/customers");
          }
      }, function failureCallback(res){
          $scope.errorMsg=res.statusText;
      });

  };

   /*$scope.getCustomerById = function(id){

    $http({
          method:"GET",
          url:" http://localhost:4300/customers/edit/"+id,
      }).then(function successCallback(res){
            $scope.customerToEdit =  res.data[0];
           console.log('get Customer Info', $scope.customerToEdit );
      }, function failureCallback(res){
          $scope.errorMsg=res.statusText;
      });

  };*/

  /*$scope.updateCustomer = function(customerToEdit){

    $http({
          method:"POST",
          url:" http://localhost:4300/customers/edit/"+customerToEdit.id,
          data: JSON.stringify(customerToEdit)
      }).then(function successCallback(res){
            $location.path("/");
      }, function failureCallback(res){
          $scope.errorMsg=res.statusText;
      });

  };*/

   /*$scope.deleteCustomer = function(customerId){

    $http({
          method:"GET",
          url:" http://localhost:4300/customers/delete/"+customerId
      }).then(function successCallback(res){
            $location.path("/");
      }, function failureCallback(res){
          $scope.errorMsg=res.statusText;
      });

  };*/


  /*$scope.cancelAdd = function(){
      $location.path("/");
  }*/

  $scope.init = function(){
     
     var customerId = $routeParams.customerId;
     var operation = $routeParams.operation;
     var pageName = $routeParams.pageName;
     //$scope.getCustomers();
     if(pageName === 'tasksListPage'){
        $scope.tasksList(); 
    }
     /*if(operation === 'edit'){
        $scope.getCustomerById(customerId);
     }else if(operation === 'delete'){
        $scope.deleteCustomer(customerId);
     }else{
        $scope.getCustomers();
     }*/
    
  };

  $scope.init();

});
