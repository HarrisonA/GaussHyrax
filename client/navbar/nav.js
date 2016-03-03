angular.module('gaussHyrax.nav', [])

.controller('navCtrl', ['$scope', function($scope){

  // Reload event to re render the summary view
  $scope.reload = function(){
    // Sends reload up to the parent controller to reload the summary view
    $scope.$emit('reload');
  };
}])
