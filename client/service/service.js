var app = angular.module('nList.services', []);

app.factory('links', ['$http', ($http) => {
  var n = {
    links: [],
    languages: [],
    comments: [],
    users: [],
    userReputation: {},
    bookmarks: []
  };

  n.getAll = function() {
    return $http.get('/resources')
      .success(function(data) {
      angular.copy(data, n.links);
      });
  };

  n.getAllUsers = function() {
    return $http.get('/users')
      .success(function(data) {
      angular.copy(data, n.users);
      });
  };

  n.getAllComments = function() {
    return $http.get('/comments')
      .success(function(data) {
      angular.copy(data, n.comments);
      });
  };

  n.getLanguages = function() {
    return $http.get('/langResources')
      .success(function(data) {
      angular.copy(data, n.languages);
      });
  };

  n.addOne = function(post) {
    return $http.post('/resources', post)
      .success(function(data) {
        n.links.push(data);
        n.getAll();
      });
  };

  n.addOneComment = function(post) {
  return $http.post('/comments', post)
    .success(function(data) {
      n.comments.push(data);
      n.getAllComments();
    });
  };

  n.upvote = function(post) {
    post.vote = 1; //1 = upvote
    return $http.put('/resources', post)
    .success(function(data) {
      n.getAll().then(function () {
        n.retrieveReputations();
      })
    });
  };


  n.downvote = function(post) {
    post.vote = 0; //0 = downvote
    return $http.put('/resources', post)
      .success(function(data) {
        n.getAll().then(function () {
          n.retrieveReputations();
        })
      });
  };

  n.delete = function (post) {
    let url = '/resources/' + post.id;
    console.log("deleting", url)
    return $http.delete(url)
    .success(function (data) {
      n.getAll();
    })
  }


  n.retrieveReputations = function () {
    for (var i = 0; i < n.users.length; i++) {
      n.userReputation[n.users[i].id] = 0;
      for (var j = 0; j < n.links.length; j++) {
        if (n.links[j].id_users === n.users[i].id) {
          n.userReputation[n.users[i].id] += n.links[j].likes;
          n.userReputation[n.users[i].id] -= n.links[j].dislikes;
        }
      }
    }
  }

  n.emailOne = function (post) {
    const url = `/resources/${post.id}`;
    console.log('post', post);
    return $http.post(url, post)
      .success(function (data) {
        n.getAll();
      });
  };

  n.getAllSaved = function() {
    return $http.get('/bookmarks')
      .success(function(data) {
      angular.copy(data, n.bookmarks);
      });
  };

  n.saveOne = function (post) {
    return $http.post('/bookmarks', post)
      .success(function(data) {
        n.bookmarks.push(data);
        n.getAllSaved();
      });
  }
  return n;

}]);


//  USERS FACTORY FOR CHECKING WHETHER A USER IS LOGGED IN

  app.factory('checkUser',['$http', '$window', ($http, $window) => {
    var checkUser = {
      currUser: false
    };

  checkUser.userStatus = () => {
    return $http.get('/updateUser')
    .success(data => {
      checkUser.currUser = data[0];
    }).error((res, status) => { //Allow not logged in users to stay on home page or about page
      if(window.location.href !== window.location.origin+'/#/home' && window.location.href !== window.location.origin+'/#/about' && status === 401){
        $window.location.href="/login";
      }
    });
  };

  checkUser.signout = () => {
    return $http.post('/logout')
    .success(data => {
      $window.location.href="/login";
    });
  };

  return checkUser;

}]);
