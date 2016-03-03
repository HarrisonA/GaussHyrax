angular.module('LoginServices', [])

.factory('UserFactory', ['$http', function($http) {
  var userFactory = {}


  userFactory.saveUser = function(userObj) {
    return $http({
      method : 'POST',
      url : '/api/user',
      data : userObj  // {userName:"Nick",password:"123"}
    });

  }

  userFactory.verifyUser = function(userObj) {
    return $http({
      method : 'GET',
      url : '/api/user/' + userObj.userName + '/' + userObj.password,
    });

  }

return userFactory;

}])
