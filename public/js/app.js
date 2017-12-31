var app = angular.module("myApp",['ngRoute']);
app.config(function($routeProvider) {
  
  $routeProvider.when('/',{
        templateUrl :"../html/login.html",
        controller: "userCtrl"
    }).when('/sheet',{
        templateUrl: "../html/sheet.html",
        controller: "sheetCtrl"
    }).when('/task',{
        templateUrl: "../html/tasks.html",
        controller: "taskCtrl"
    })
});


app.controller('userCtrl',function( $rootScope,$scope, $http, $location, $routeParams,$filter){
    $rootScope.isLoggedin=false;
    $rootScope.menuExpanded=false;
    $rootScope.toggleMenu=function(){
        $rootScope.menuExpanded=!$rootScope.menuExpanded;
    }
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

app.controller('sheetCtrl',function($scope, $rootScope, $http, $location, $routeParams,pagerService){
    $rootScope.currentTab='sheet';
    $scope.sheetList ={};
    $scope.init = function(){
        $scope.pager = {};
        $scope.setPage = setPage;
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
          if($scope.sheetList.length){
            $scope.setPage(1);
        }
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
        if(res.data.status === 'success'){
            $scope.sheetList.push(res.data.response); 
            $scope.togglepopup();
            setPage($scope.pager.currentPage);
          }
      }, function failureCallback(res){
          $scope.errorMsg=res.statusText;
      });
  }; 

  function setPage(page) {
    if (page < 1 || page > $scope.pager.totalPages) {
        return;
    }
    $scope.pager = pagerService.GetPager($scope.sheetList.length, page);
    $scope.items =$scope.sheetList.slice($scope.pager.startIndex, $scope.pager.endIndex + 1);
  }

  $scope.init();

});

app.controller('taskCtrl',function($rootScope,$scope, $http, $location, $routeParams,$filter,pagerService){
    $rootScope.currentTab='task';
    $scope.tasksListObj ={};
    $scope.init = function(){
        $scope.pager = {};
        $scope.setPage = setPage;
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
            if($scope.tasksListObj.length){
                $scope.setPage(1);
            }
        }, function failureCallback(res){
            $scope.errorMsg=err.statusText;
        });
    };

    $scope.togglepopup=function(){
        $scope.showpopup=!$scope.showpopup;
    }

    $scope.addTask = function(task){
        task.user_id=$rootScope.userId;
        if(task.status=='started' && !task.endat){
            task.endat=0;
        }
        $http({
                method:"POST",
                url:" http://localhost:4300/tasks/save",
                data: JSON.stringify(task)
            }).then(function successCallback(res){
                if(res.data.status === 'success'){
                    $scope.tasksListObj.push(res.data.response); 
                    $scope.togglepopup();
                    setPage($scope.pager.currentPage);
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
            $scope.items[$scope.editIndex] = angular.copy(task);
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
    function setPage(page) {
        if (page < 1 || page > $scope.pager.totalPages) {
            return;
        }
        $scope.pager = pagerService.GetPager($scope.tasksListObj.length, page);
        $scope.items =$scope.tasksListObj.slice($scope.pager.startIndex, $scope.pager.endIndex + 1);
    }
    $scope.init();
});

 app.factory('pagerService', function(){
    var service = {}; 
    service.GetPager = GetPager;
    return service;
    function GetPager(totalItems, currentPage, pageSize) {
        currentPage = currentPage || 1;
        pageSize = pageSize || 10;
        var totalPages = Math.ceil(totalItems / pageSize);
        var startPage, endPage;
        if (totalPages <= 10) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }
        var startIndex = (currentPage - 1) * pageSize;
        var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
        var pages = _.range(startPage, endPage + 1);
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }
});
