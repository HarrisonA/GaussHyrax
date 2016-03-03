angular.module('gaussHyrax.family', ['FamilyServices'])

.controller('familyController', ['$scope', '$window', 'FamilyFactory',
  function($scope, $window, FamilyFactory){
    var everybody = {
      firstName:"Everybody"
    }
    $scope.familyData;
    //$scope.activeFamilyMember;
    $scope.activeFamilyMember = {
      firstName:"Everybody"
    }

    // open modal
    $scope.plusNewMember = function(){
      $scope.toggleModal();
      $scope.$broadcast('addThisGuy');
    };

    //edit a user receievd from the SummaryView, pass it down to the newFamilyMemberController
    $scope.$on('editMe', function(event){
      $scope.$broadcast('editThisGuy');
    })

    //edit history recievd from the ActionViewContoller, broadcast this event down to the summary view
    $scope.$on('historyUpdateEvent',function(event,famMemberId,historyEvent){
       $scope.$broadcast('updateGraph',famMemberId,historyEvent);
    });

    $scope.$on('logout',function(event,data){
      $scope.familyData = [];
      $scope.activeFamilyMember = undefined;
    });

    // Recieving the points from the Summary View Controller, using $scope.$emit
    $scope.$on('points', function(event, totalPoints) {
      // console.log("Here are the Points from the Summary Controller: ", totalPoints);
      // The family controller, loads on the login page. If this check is not put, here
      // familyData will be pulled on the login page and will get a 404 deined, without logging in.
      if(!$scope.familyData){
        return;
      }

      // Add a property of points when, the familyData is valid
      // Set the property of Points fromt the totalPoints, which comes from the Summary Controller
      for (var i = 0; i < $scope.familyData.length; i++) {
        for (var key in totalPoints) {
          if (key === $scope.familyData[i]._id){
            // Set the property of points on the familyData to be the totalPoints
            $scope.familyData[i].points = totalPoints[key] || 0;
          }
        }
      }
    });

    //on login, get family data
    $scope.$on('login',function(event,id){
      getFamilyData($window.localStorage.getItem('com.hyrax'));
    });

    angular.forEach(['summaryCtrlLoaded','addedFam','reload'], function(value){
      $scope.$on(value, function(event){
         $scope.activeFamilyMember = {
           firstName:"Everybody"
         };
         $scope.$broadcast('familyChange',$scope.familyData);
      });
    });

    $scope.$on('removeFam',function(event,id){
      console.log('removing user from familyData');
      //remove user from the list so it does not show in the UI
      for (var i = 0; i < $scope.familyData.length; i++) {
        if($scope.familyData[i]._id === id){
          console.log('deleting',id);
          $scope.familyData.splice(i, 1);

        }
      }
      //tell the graph to update
      $scope.$broadcast('familyChange',$scope.familyData);
    });

    // Listen for an emit Event from the login Controller (Child Scope)
    $scope.$on('userLoggedIn', function(event, data){
       $scope.login = data;
    });

    // Make a function, that gets all the family Data, using the id, in the local Storage
    function getFamilyData(id){

     // If there's no id provided, exit the function.
     if(!id){
      return;
     }

     // Use the function from the Family Factory from the Family Services using a promise
     // Set the data equal to familyData, which is the object on the DOM, which is an array
     // of Objects.
     FamilyFactory.getAllFamilyMembers(id)
      .then(function(res) {
        $scope.familyData = res.data;

        // Add color borders to all the familyData
        _.each($scope.familyData, $scope.changeOneActionColor)

        // Calculate the total Points from the Family History Action Points Property
        // The points are not currently coming from the Summary View.
        _.each($scope.familyData, function(eachFamilyMember, index) {
          eachFamilyMember.totalPoints = _.reduce(eachFamilyMember.history, function(total, action) {
            total += action.points;
            return total;
          }, 0);
        });

        // let the summaryView know that there are new things to graph
        console.log('new family data loaded');

        // Broadcast an event to the Summary Controller, to listen for "familyChange"
        $scope.$broadcast('familyChange',$scope.familyData);

      });
    }

    // On controller load (page refresh), get family data using the $window.localStorage
    getFamilyData($window.localStorage.getItem('com.hyrax'));


    // Make a function, that codes the Family Members, based on when you last contacted them.
    $scope.changeOneActionColor = function(eachFamilyMember, index) {

             // Format eachFamilyMember using Moment (MMM DD YYYY)
             eachFamilyMember.nextContactDate = moment(eachFamilyMember.nextContactDate).format('MMM DD YYYY');

             if(moment.duration(moment(eachFamilyMember.nextContactDate).diff(eachFamilyMember.date)).days() < 3 ){
                console.log("Change the border on loading color");
                eachFamilyMember.urgency = '#D62728;';  // RED COLOR
             } else if (moment.duration(moment(eachFamilyMember.nextContactDate).diff(eachFamilyMember.date)).days() < 10 &&
                        moment.duration(moment(eachFamilyMember.nextContactDate).diff(eachFamilyMember.date)).days() >= 3) {
                eachFamilyMember.urgency = "#FF7F0E"; // ORANGE COLOR

            } else {
                eachFamilyMember.urgency = "#2CA02C"; // GREEN COLOR
            }
    };


    // Modal controller
    $scope.modalShown = false;
    $scope.toggleModal = function() {
      $scope.modalShown = !$scope.modalShown;
    };

    // When the user clicks the Family Member, we want to update the Summary View, to show the
    // interactions with that family Member and show the individual Graph, Points and Donut Graph.
    $scope.singleFamilyMemberInfo = function(familyMemberObj) {
      console.log(familyMemberObj);
      //change the $scope.activeFamilyMember so that a $watch event will fire
      $scope.activeFamilyMember = familyMemberObj;
    }

    // sort the familyMembers using this function 'orderBy:- 'sortByFamilyMember: true'.
    $scope.sortFamilyMembers = function(member) {
      var date = new Date(member.nextContactDate);
      return date;
    };

}])

// creates the modal dialog box

.directive('modalDialog', function() {
  return {
   restrict: 'E',
   scope: {
     show: '='
   },
   replace: true, // Replace with the template below
   transclude: true, // we want to insert custom content inside the directive
   link: function(scope, element, attrs) {
     scope.dialogStyle = {};
     if (attrs.width)
       scope.dialogStyle.width = attrs.width;
     if (attrs.height)
       scope.dialogStyle.height = attrs.height;
     scope.hideModal = function() {
       scope.show = false;
     };
   },
   template: "<div class='ng-modal' ng-show='show'> <div class='ng-modal-overlay' ng-click='hideModal()'></div> <div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-close' ng-click='hideModal()'>X</div><div class='ng-modal-dialog-content' ng-transclude></div></div></div>" // See below
 };
})
