angular.module('MainCtrl')

.factory('scanServSocketFactory',  ['$http', '$rootScope', '$timeout', '$interval', 'socket',  function($http, $rootScope, $timeout, $interval, socket) {
	'use strict';
	var allSockets = {};
	return {
		createSocket : function(id, path, scope) {
			socket.emit('createListener', {	'id' : id, 'path' : path })
			allSockets[id] = socket.on(id, function(obj) {
				var prop;
				delete allSockets[obj.id]
				for (prop in scope.vidget) {
					if (scope.vidget[prop].id === obj.id) {
						delete scope.vidget[prop]
						break;
					}
				}
				// scope.vidget
				$('#' + obj.id).remove()
			})
		},
		destroySocket : function(id) {
			socket.emit('destroyListener', {'id' : id})
			delete allSockets[id]
		}
	}
}]);