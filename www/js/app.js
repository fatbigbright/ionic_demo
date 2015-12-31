//angular demo
//
//

angular.module('demo', ['ionic'])
.constant('API', {
	//url: 'http://localhost:8100/api' // use this setup when running in browser
	url: 'http://101.201.150.228/api' // use this setup when running on emulator
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider){
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
.controller('SignInCtrl', function($scope, $state, $http, $ionicPopup, API){
	$scope.signIn = function(user){
		if(user.username.trim() == "" || user.password.trim() == "")
			$ionicPopup.alert({
				title: '提示',
				template: '请输入用户名及密码'
			});
		else{
			var login_data = "grant_type=password" + "&username=" + user.username + "&password=" + user.password;
			console.log(login_data);
			//$http.post('http://101.201.150.228/api/token', login_data, { 
			$http.post(API.url + '/token', login_data, { 
					headers:  { 
						'Content-Type': 'application/x-www-form-urlencoded' 
					}
				})
				.then(function(data){
					//still need to add code to store login information
					//angular service may be used
					//

					window.localStorage['access_token'] = data.data['access_token'];
					window.localStorage['token_type'] = data.data['token_type'];

					//$http.defaults.headers.common['Authorization'] = data.data['token_type'] + ' ' + data.data['access_token'];

					console.log(JSON.stringify(data));
					$state.go('tabs.home');
				}, function(error){
					if(error)
						console.log(error);

					$ionicPopup.alert({
						title: '登录失败',
						template: '用户不存在或密码错误: ' + error.Message
					});
				});
		}
	};
})
.controller('HomeTabCtrl', function($scope, $http, $ionicPopup, API){
	$scope.permissions = ["获取权限ing...."];
	//$scope.permissions = ["无权限", "或获取权限异常"];

	$http({
		method: 'GET',
		url: API.url + '/User/Current',
		headers: {
			'Authorization': window.localStorage['token_type'] + ' ' + window.localStorage['access_token']
			//'Content-Type': 'application/x-www-form-urlencoded' 
		},
	})
	//$http.get(API.url + '/User/Current')
		.then(function(data){
			console.log(data.data);

			if(data.data.code != 0){
				$ionicPopup.alert({
					title: '获得数据失败',
					template: data.data.Message || 'API返回错误'
				});
				return;
			}
			$scope.permissions = data.data.data.permissions || ["无权限", "或获取权限异常"];
		}, function(error){
			console.log(error || error.error || error.Message);
			$scope.permissions = ["无权限", "或获取权限异常"];
			$ionicPopup.alert({
				title: '获取数据失败',
				template: error.Message || '获取当前用户信息失败'
			});
		});
});
	//url: 'http://localhost:8100/api'
