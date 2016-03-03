angular.module('gaussHyrax.login', ['LoginServices'])

.controller('loginController', ['$scope', '$location','$window','UserFactory',
  function($scope, $location, $window, UserFactory) {

  $scope.showLoginError = false;
  //login page is loading
  //delete the token if exists
  $window.localStorage.removeItem('com.hyrax');
  //emit a logout event so that the family controller can delete the activeFamilyMember and data
  $scope.$emit('logout');

  $scope.saveUser = function() {

    $scope.showLoginError = false;

    if(!$scope.user || !$scope.user.userName || !$scope.user.password){
      $scope.showLoginError = true;
      $scope.errorMessage = "Please provide a username and password."
      return;
    }

    UserFactory.saveUser($scope.user).then(function(res){
      console.log(res);
      $window.localStorage.setItem('com.hyrax',res.data['_id']);

      //emit login event so familyController can fetch data
      $scope.$emit('login');

      $location.path('/dashboard');
    },function(err){
      $scope.showLoginError = true;
      $scope.errorMessage = "Cannot create. This user already exists."
      console.log('user create failed',err);
    });

  }

  $scope.verifyUser = function () {
    $scope.showLoginError = false;
    if(!$scope.user || !$scope.user.userName || !$scope.user.password){
      $scope.showLoginError = true;
      $scope.errorMessage = "Please provide a username and password."
      return;
    }
    UserFactory.verifyUser($scope.user).then(function(res){
      console.log(res);
      //save user id in local storage
      $window.localStorage.setItem('com.hyrax',res.data);

      if(res.data.length){
        //a user profile was returned, so forward them to their dashboard

        //emit login event so familyController can fetch data
        $scope.$emit('login');
        console.log('changing location')

        //emit an event to the parent familyController to display the usernaem on login
        $scope.$emit('userLoggedIn', $scope.user.userName);
        $location.path('/dashboard');
      }
      //else no user object was returned, so keep here

    },function(err){
      $scope.showLoginError = true;
      $scope.errorMessage = "Login failed!"
      console.log('login failed',err);
    });
  }

}]);
