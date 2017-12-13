var app = angular.module("myApp",['ngRoute']);
app.config(function($routeProvider) {
  
  $routeProvider.when('/',{
        templateUrl :"../html/login.html",
        controller: "userCtrl"
    }).when('/sheet',{
        templateUrl: "../html/sheet.html",
        controller: "sheetCtrl"
    }).when('/add_customer',{
        templateUrl: "../html/add_customer.html",
        controller: "sheetCtrl"
    }).when('/task',{
        templateUrl: "../html/tasks.html",
        controller: "taskCtrl"
    }).when('/edit_task/:operation/:customerId',{
        templateUrl: "../html/edit_task.html",
        controller: "taskCtrl"
  });
});
app.controller('userCtrl',function( $rootScope,$scope, $http, $location, $routeParams,$filter){
    $rootScope.isLoggedin=false;
  
    
    $scope.doLogin = function(user){
          $http({
              method:"POST",
              url:" http://localhost:4300/users/doLogin",
              data: JSON.stringify(user)
          }).then(function successCallback(res){
              if(res.data.status === 'success'){
                $rootScope.userId=res.data.response.id;
                $rootScope.isLoggedin=true;
                $location.path("/task");
              }else{
                  $scope.errorMsg=res.data.message;
              }
          }, function failureCallback(res){
              $scope.errorMsg="Wrong Credentials!";
          });
        };  
});
app.controller('sheetCtrl',function($scope, $rootScope, $http, $location, $routeParams){
    $rootScope.currentPage='sheet';
    $scope.init = function(){
        if($rootScope.userId){
           var userId = $rootScope.userId;
           $scope.getSheetList(userId); 
       }else{
           $location.path('/');
       }
    };
  $scope.getSheetList = function(userId){

    $http({
          method:"GET",
          url:" http://localhost:4300/sheet/list/"+userId,
      }).then(function successCallback(res){
          $scope.sheetList = res.data;
      }, function failureCallback(res){
          $scope.errorMsg=res.statusText;
      });

  };
 
   $scope.togglepopup=function(){
       $scope.showpopup=!$scope.showpopup;
   }
  $scope.addSheet = function(student){
    student.user_id=$rootScope.userId;
    $http({
          method:"POST",
          url:" http://localhost:4300/sheet/add",
          data: JSON.stringify(student)
      }).then(function successCallback(res){
          if(res.data === 'success'){
            $location.path("/sheet");
          }
      }, function failureCallback(res){
          $scope.errorMsg=res.statusText;
      });

  };  
  
  $scope.init();

});

app.controller('taskCtrl',function($rootScope,$scope, $http, $location, $routeParams,$filter,){
    $rootScope.currentPage='task';
    $scope.tasksListObj ={};

    $scope.presentPage = 0;
    $scope.pageSize = 20;
    $scope.totalPages = 0;
    $scope.pagedData = [];

    $scope.pageButtonDisabled = function(dir) {
    	if (dir == -1) {
			return $scope.presentPage == 0;
    	}
		return $scope.presentPage >= dataFactory.data.length/$scope.pageSize - 1;
    }
    $scope.paginate = function(nextPrevMultiplier) {
    	$scope.presentPage += (nextPrevMultiplier * 1);
    	$scope.pagedData = dataFactory.data.slice($scope.presentPage*$scope.pageSize);
    }

    $scope.init = function(){
        $scope.editIndex= undefined;
        if($rootScope.userId){
            var userId = $rootScope.userId;
            $scope.getTasksListByUser(userId); 
        }else{
            $location.path('/');
        }
     };  
    $scope.getTasksListByUser = function(userId){
            $http({
                method:"GET",
                url:" http://localhost:4300/tasks/list/"+userId,
            }).then(function successCallback(res){
                $scope.tasksListObj = res.data;
            }, function failureCallback(res){
                $scope.errorMsg=err.statusText;
            });
        };
        $scope.togglepopup=function(){
            $scope.showpopup=!$scope.showpopup;
        }
        $scope.addTask = function(task){
            task.user_id=$rootScope.userId;
                $http({
                      method:"POST",
                      url:" http://localhost:4300/tasks/save",
                      data: JSON.stringify(task)
                  }).then(function successCallback(res){
                      if(res.data.status === 'success'){
                        task.id = res.data.id;
                        $scope.tasksListObj.push(task); 
                        $scope.togglepopup();
                      }
                  }, function failureCallback(res){
                      $scope.errorMsg=res.statusText;
                  });
            
              };
        
        $scope.editTask = function(id,index,event){
            $scope.editIndex=index;
            event.preventDefault();
                $http({
                      method:"GET",
                      url:" http://localhost:4300/tasks/edit/"+id
                  }).then(function successCallback(res){
                      if(res.data.status === 'success'){
                          $scope.task = res.data.response;
                          $scope.task.date = $filter("date")(Date.now($scope.task.date), 'dd-MMM-yyyy');
                          $scope.togglepopup();
                      }
                  }, function failureCallback(res){
                      $scope.errorMsg=res.statusText;
                  });
            
              };
             
              $scope.updateTask = function(task){
                     $http({
                           method:"POST",
                          url:" http://localhost:4300/tasks/update",
                          data: JSON.stringify(task)
                      }).then(function successCallback(res){
                         if(res.data.status === 'success'){
                            event.preventDefault();
                            $scope.tasksListObj[$scope.editIndex] = angular.copy(task);
                            $scope.clearForm();
                            $scope.togglepopup();
                          }
                       }, function failureCallback(res){
                           $scope.errorMsg=res.statusText;
                       });

                  };
           
    $scope.clearForm = function(){
        $scope.editIndex=undefined;
        $scope.task = {};
    }     
     $scope.init();

});