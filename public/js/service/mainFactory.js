
angular.module('MainCtrl')

.factory('mainFactory',  ['$http', '$rootScope', '$timeout', '$interval', 'socket',  function($http, $rootScope, $timeout, $interval, socket) {
	'use strict';

	return {
		getStartFileStructure : function(url, scope) {
			$http.get(url + '/getStartFileStructure')
				.success(function(result) {
					scope.parent = result
				})
				.error(function(err) {
					console.log(err)
				})
		}
	}
}]);

