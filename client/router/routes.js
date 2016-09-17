angular.module('nList', ['nList.services', 'nList.home', 'nList.main','ui.router', 'nList.links', 'nList.profile'])

.config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) => {

  $urlRouterProvider.otherwise('/home');

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'components/home/home.html',
      controller: 'homeCtrl',
      resolve: {
        linkPromise : ['links', (links) => {
          return links.getAll();
        }],
        languagePromise : ['links', (links) => {
          return links.getLanguages();
        }],
        commentPromise : ['links', (links) => {
          return links.getAllComments();
        }]
      }
    })
    .state('links', {
      url:'/links',
      templateUrl: 'components/links/links.html',
      controller: 'linksCtrl',
      resolve: {
        checkUser : ['checkUser',(checkUser) => {
          return checkUser.userStatus();
        }]
      }
    })
    .state('profile', {
        url: '/profile',
        templateUrl: 'components/profile/profile.html',
        controller: 'ProfileController',
        resolve: {
          checkUser : ['checkUser', (checkUser) => {
            return checkUser.userStatus();
          }]
        }
    })
    .state('about',{
      url: '/about',
      templateUrl: 'components/about/about.html'
    })

}]);
