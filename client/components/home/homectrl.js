'use strict'

var app = angular.module('nList.home', []);

app.controller('homeCtrl',['$scope','links','checkUser',($scope, links, checkUser) => {
  let user;
  checkUser.userStatus().success(data =>  user = data[0]);

  $scope.posts = links.links; //Array of all links from database
  $scope.languages = links.languages; //Array of all main languages
  $scope.sortType = 'date_added';
  $scope.sortReverse = false;
  $scope.searchFinish = '';
  // Below user id is passed in, so a vote can be logged in user_vote table, to prevent dupe voting
  $scope.incrementLike = post => {
    post.uid = user.id;
    links.upvote(post);
  };

  $scope.incrementDislike = post => {
    post.uid = user.id;
    links.downvote(post);
  };

  $scope.setFilter = (type, value) => {
    $scope[type+'Filter'] = {};
    $scope[type+'Filter'][type] = value;
  };

  $scope.deletePost = post => {
    links.delete(post)
  }

}]);
