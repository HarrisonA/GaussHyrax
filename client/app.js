angular.module('gaussHyrax', ['ngAnimate', 'ui.router',
'gaussHyrax.login',
'gaussHyrax.family',
'gaussHyrax.newFamilyMember',
'gaussHyrax.action',
'gaussHyrax.summary',
'gaussHyrax.nav',
])

.config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('dashboard', {
      // abstract: true,
      url: '/dashboard',
      templateUrl: '/dashboard/dashboard.html',
      controller: 'navCtrl',
    })

    // .state('dashboard.summary,', {
    //   url:'',
    //   template: 'summaryView/summary.html',
    //   controller: 'summaryCtrl'
    // })

    .state('login', {
      url: '/login',
      templateUrl: '/login/login.html',
      controller: 'loginController',
    });

  $urlRouterProvider.otherwise('/login');

});
