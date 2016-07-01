

angular.module('MainCtrl',[])

.controller('mainCtrl', ['$http', '$scope', 'mainFactory', 'socket', 'mainUrl', function($http, $scope, mainFactory, socket, mainUrl) {
	$scope.nameNewDirExperiment = undefined;
	$scope.validBtnAddNewDir = true;
	$scope.userMessage = "только латинские без пробелов";
	$scope.arrNameNewDirExperiment = [];
	mainFactory.getStartFileStructure(mainUrl.url, $scope)
	$scope.addNewDirExperiment = function() {
		if ($scope.nameNewDirExperiment) {
			$scope.nameNewDirExperiment.toLowerCase()
			if ($scope.arrNameNewDirExperiment.indexOf($scope.nameNewDirExperiment) < 0) {
				$scope.validBtnAddNewDir = true;
				$scope.arrNameNewDirExperiment.push($scope.nameNewDirExperiment)
				$http.post(mainUrl.url + '/addNewDir', {'nameNewDir' : $scope.nameNewDirExperiment})
					.success(function(result) {
						$scope.nameNewDirExperiment = undefined;
					})
					.error(function(err) {
						console.log(err)
					})
				}
		}
		else {
			$scope.userMessage = "только латинские без пробелов"
		}
	}
	$scope.deleteDir = function(id, path, event) {
		var parentUl;
		var childrens;
		parentUl = $('#' + id).parent()

		$('#' + id).remove()
		childrens = parentUl.find('li')
		if (childrens.length == 0) { parentUl.remove() }
		// console.log(childrens.length)
		delete $scope.arrNameNewDirExperiment;
		$scope.arrNameNewDirExperiment = []
		// console.log(event.target)
		$http.post(mainUrl.url + '/deleteDir', {'id' : id, 'path' : path})
			.success(function(result) {
				$scope.nameNewDirExperiment = undefined;
			})
			.error(function(err) {
				console.log(err)
			})
	}
	$scope.validValNameDir = function() {
		var bool;
		bool = /^[a-zA-Z]+$/.test($scope.nameNewDirExperiment)
		if (bool) {
			$scope.validBtnAddNewDir = false;
			$scope.userMessage = undefined;
		}
		else {
			$scope.validBtnAddNewDir = true;
			$scope.userMessage = "только латинские без пробелов"
		}
	}
}]);


