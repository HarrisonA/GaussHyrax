angular.module('gaussHyrax.action', [])

// Injecting $window and $timeout so they can be used
.controller('actionController',['$scope', '$http', '$window', '$timeout', function($scope, $http, $window, $timeout){

  // Default values
  $scope.actionArray = [];
  $scope.selectedAction = "Click an action";
  $scope.points = 0;
  $scope.singleNote = "";  // Keep the note field blank by default
  $scope.selectedAction = null;

  // Using moment to convert date into a simpler format
  $scope.dateEntered = moment(new Date()).format('MMM DD YYYY');

  // get the user ID from the window local storage
  var userId = $window.localStorage.getItem('com.hyrax');

  // $scope.member._id is set in the family.html (from familyView)
  // This is the id of the family member of the current action view
  var famMemberId = $scope.member._id;


  // Sets the action based on the user click
  $scope.setAction = function(anAction, pts){
    $scope.selectedAction = anAction;
    $scope.points = pts;
    $scope.noActionYet = "";  //remove noAction msg
    $scope.actionSaved = "";  //remove previous "Saved!" msg
  }


  // When an action is clicked, this function is invoked and that action will get highlighted
  // in the action.html
  $scope.setSelected = function (actionClicked) {
    $scope.selectedAction = actionClicked;
  };

  // Invoked when the actionView submit button is clicked
  $scope.saveAction = function(someAction, pointValue, dateOccured, someNote){
    if (someAction === null){
      $scope.noActionYet = "No action selected."
      return
    }
    $scope.noActionYet = "";

    var actionObj = {
      action: someAction,
      points: pointValue,
      date: dateOccured,
      notes: someNote
    };

    $scope.singleNote = "";  // Clear the notes field after submission

    // Post this action to the history of the current family member's action view
    $http({
      method : 'POST',
      url : '/api/history/' + userId + "/" + famMemberId,
      data : actionObj,
      headers: {'Content-Type': 'application/json'}
    })
    .then(function(res) {

      $scope.actionSaved = "Saved!";  // {{actionSaved}} will be displayed

      // using Angular's version of setTimeOut, erase the message after 3 seconds
      $timeout(function (){
        $scope.actionSaved = "" }, 3000);

      // this will put the action in the notes field in summary view
      $scope.member.history.push(res.data.historyItem);

      // action was submitted, so update the nextContactDate
      $scope.member.nextContactDate = moment(res.data.nextContactDate).format("MMM DD YYYY");

      // Call the changeActionColor (which is in the family controller)
      // This will set the border-left color bar of the family member
      $scope.changeOneActionColor($scope.member);

      // This is to signify that the graph needs to be updated
      // The summaryController is listening for this event
      $scope.$emit('historyUpdateEvent', famMemberId, res.data.historyItem);
    })

  };

}]);

