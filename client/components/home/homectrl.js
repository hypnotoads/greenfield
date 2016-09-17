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

  $scope.fakeComments = [];
  $scope.fakeInbox = [];

  checkUser.userStatus().success(data => $scope.headerUser = data[0]);
  // this is repeated in another controller. is there a way we can refactor?

  $scope.addComment = function (id, title, comment) {
    let newComment = {
      postid: id,
      title: title,
      comment: comment,
      userid: $scope.headerUser.id,
      likes: 0,
      dislikes: 0

    }
    $scope.fakeComments.push(newComment)
  }
  $scope.showComments = function () {

  }

  $scope.emailLink = function (id, name, email) {
    // do we want to add some sort of validation to make sure "email" is a valid email address?
    let newEmail = {
      recipientName: name,
      recipientEmail: email,
      senderName: $scope.headerUser.name,
      senderEmail: $scope.headerUser.email
    }
    $scope.fakeInbox.push(newEmail)
  }
}]);
