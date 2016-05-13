
/**
 * @ngdoc overview
 * @name fakeLunchHubApp
 * @description
 * # fakeLunchHubApp
 *
 * Main module of the application.
 */
var myApp = angular.module('myapplication', [
   // 'ngAnimate',
    // 'ngCookies',
    'ngResource',
    'ngRoute',
    // 'ngSanitize',
    // 'ngTouch',
    'ng-token-auth'
  ]);

myApp.config(function($authProvider) {
  $authProvider.configure({
    apiUrl: 'http://localhost:3000/',
    authProviderPaths: {
      github: '/api/auth/github' // <-- note that this is different than what was set with github
    }
  });
});
//Factory
myApp.factory('Users', ['$resource',function($resource){
  return $resource('/users.json', {},{
    query: { method: 'GET', isArray: true },
    create: { method: 'POST' }
  })
}]);

myApp.factory('User', ['$resource', function($resource){
  return $resource('/users/:id.json', {}, {
    show: { method: 'GET' },
    update: { method: 'PUT', params: {id: '@id'} },
    delete: { method: 'DELETE', params: {id: '@id'} }
  });
}]);

myApp.factory('Posts', ['$resource',function($resource){
  return $resource('/posts.json', {},{
    query: { method: 'GET', isArray: true },
    create: { method: 'POST' }
  })
}]);

myApp.factory('Post', ['$resource', function($resource){
  return $resource('/posts/:id.json', {}, {
    show: { method: 'GET' },
    update: { method: 'PUT', params: {id: '@id'} },
    delete: { method: 'DELETE', params: {id: '@id'} }
  });
}]);

//Controller
myApp.controller("UserListCtr", ['$scope', '$http', '$resource', 'Users', 'User', '$location', function($scope, $http, $resource, Users, User, $location) {

  $scope.users = Users.query();

  $scope.deleteUser = function (userId) {
    if (confirm("Are you sure you want to delete this user?")){
      User.delete({ id: userId }, function(){
        $scope.users = Users.query();
        $location.path('/');
      });
    }
  };
}]);

myApp.controller("UserSessionsCtrl", ['$scope', '$http', '$resource', '$location', '$auth', function($scope, $http, $resource, $location, $auth) {
  $scope.$on('auth:login-error', function(ev, reason) {
    $scope.error = reason.errors[0];
  });

  $scope.login_github = function() {
      $auth.authenticate('github', {
      params: {
        favorite_color: $scope.favoriteColor
      }
    });
  };


}]);



myApp.run(['$rootScope', '$location', function($rootScope, $location) {
  $rootScope.$on('auth:login-success', function() {
    $location.path('/users');
  });
  $rootScope.$on('auth:logout-success', function() {
    $location.path('/sign_in');
  });
}]);


myApp.controller('UserRegistrationsCtrl', ['$scope', '$location', '$auth', function ($scope, $location, $auth) {
  $scope.$on('auth:registration-email-error', function(ev, reason) {
    $scope.error = reason.errors.full_messages;
  });
  $scope.handleRegBtnClick = function() {
    $auth.submitRegistration($scope.registrationForm)
      .then(function() { 
        $auth.submitLogin({
          email: $scope.registrationForm.email,
          password: $scope.registrationForm.password
        });
      });
  };
}]);

myApp.controller("PostListCtr", ['$scope', '$http', '$resource', 'Posts', 'Post', '$location', function($scope, $http, $resource, Posts, Post, $location) {

  $scope.posts = Posts.query();

  $scope.deletePost = function (postId) {
    if (confirm("Are you sure you want to delete this post?")){
      Post.delete({ id: postId }, function(){
        $scope.users = Posts.query();
        $location.path('#/posts');
      });
    }
  };
}]);

myApp.controller("UserUpdateCtr", ['$scope', '$resource', 'User', '$location', '$routeParams', function($scope, $resource, User, $location, $routeParams) {
  $scope.user = User.get({id: $routeParams.id})
  $scope.update = function(){
    if ($scope.userForm.$valid){
      User.update({id: $scope.user.id},{user: $scope.user},function(){
        $location.path('/');
      }, function(error) {
        console.log(error)
      });
    }
  };
  
  $scope.addAddress = function(){
    $scope.user.addresses.push({street1: '', street2: '', city: '', state: '', country: '', zipcode: '' })
  }

  $scope.removeAddress = function(index, user){
    var address = user.addresses[index];
    if(address.id){
      address._destroy = true;
    }else{
      user.addresses.splice(index, 1);
    }
  };

}]);

myApp.controller("UserAddCtr", ['$scope', '$resource', 'Users', '$location', function($scope, $resource, Users, $location) {
  $scope.user = {addresses: [{street1: '', street2: '', city: '', state: '', country: '', zipcode: '' }]}
  $scope.save = function () {
    if ($scope.userForm.$valid){
      Users.create({user: $scope.user}, function(){
        $location.path('/');
      }, function(error){
        console.log(error)
      });
    }
  }

  $scope.addAddress = function(){
    $scope.user.addresses.push({street1: '', street2: '', city: '', state: '', country: '', zipcode: '' })
  }

  $scope.removeAddress = function(index, user){
    var address = user.addresses[index];
    if(address.id){
      address._destroy = true;
    }else{
      user.addresses.splice(index, 1);
    }
  };

}]);


myApp.controller("PostAddCtr", ['$scope', '$resource', 'Posts', '$location', function($scope, $resource, Posts, $location) {
  
  $scope.save_post = function () {
    $scope.post = {
      'name'  : $scope.postForm.title.$modelValue,
      'body'   : $scope.postForm.description.$modelValue
    };
    // $scope.post = [{title: $scope.postForm.title.$modelValue},{description: $scope.postForm.description.$modelValue}]
    if ($scope.postForm.$valid){
      Posts.create({post: $scope.post}, function(){
        $location.path('/posts');
      }, function(error){
        console.log(error)
      });
    }
  }

}]);


//Routes
myApp.config([
  '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/users',{
      templateUrl: '/templates/users/index.html',
      controller: 'UserListCtr'
    });
    $routeProvider.when('/users/new', {
      templateUrl: '/templates/users/new.html',
      controller: 'UserAddCtr'
    });
    $routeProvider.when('/users/:id/edit', {
      templateUrl: '/templates/users/edit.html',
      controller: "UserUpdateCtr"
    });
    $routeProvider.when('/posts/new', {
      templateUrl: '/templates/posts/new.html',
      controller: 'PostAddCtr'
    });
    $routeProvider.when('/posts',{
      templateUrl: '/templates/posts/index.html',
      controller: 'PostListCtr'
    });
    $routeProvider.when('/sign_in', {
      templateUrl: '/templates/user_sessions/new.html',
      controller: 'UserSessionsCtrl'
    })
    $routeProvider.when('/sign_up', {
      templateUrl: '/templates/user_registrations/new.html',
      controller: 'UserRegistrationsCtrl'
    })
    $routeProvider.otherwise({
      redirectTo: '/sign_in'
    });
  }
]);

