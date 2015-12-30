//angular demo
//
angular.module('demo', ['ionic'])

.config(function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('signin', {
			url: '/sign-in',
			templateUrl: 'templates/sign-in.html',
			controller: 'SignInCtrl'
		})
		.state('tabs', {
			url: '/tab', 
			abstract: true,
			templateUrl: 'templates/tabs.html'
		})
		.state('tabs.home', {
			url: '/home',
			views: {
				'home-tab': {
					templateUrl: 'templates/home.html',
					controller: 'HomeTabCtrl'
				}
			}
		})
		.state('tabs.about', {
			url: '/about',
			views: {
				'about-tab': {
					templateUrl: 'templates/about.html',
				}
			}
		});

	$urlRouterProvider.otherwise('/sign-in');
})
.controller('SignInCtrl', function($scope, $state, $http, $ionicPopup){
	$scope.signIn = function(user){
		if(user.username.trim() == "" || user.password.trim() == "")
			$ionicPopup.alert({
				title: '提示',
				template: '请输入用户名及密码'
			});
		else{
			var login_data = "grant_type=password" + "&username=" + user.username + "&password=" + user.password;
			console.log(login_data);
			$http.post('http://101.201.150.228/api/token', login_data, { 
					headers:  { 
						'Content-Type': 'application/x-www-form-urlencoded' 
					}
				})
				.then(function(data){
					//still need to add code to store login information
					//angular service may be used
					//

					$state.go('tabs.home');
				}, function(error){
					if(error)
						console.log(error);

					$ionicPopup.alert({
						title: '登录失败',
						template: '用户不存在或密码错误'
					});
				});
		}
	};
})
.controller('HomeTabCtrl', function($scope){
});
