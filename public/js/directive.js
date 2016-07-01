angular.module('MainCtrl')

.directive('itemDir',['$http', '$compile', 'mainFactory', 'mainUrl', 'socket', 'scanServSocketFactory', function($http, $compile, mainFactory, mainUrl, socket, scanServSocketFactory){
	return{
		restrict: 'A',
		scope: false,
		templateUrl : './../../template/directive.html',
		link: function(scope, element, attrs){
			scope.parent = undefined;
			function createNewListElement(idParent, scope, objNewElement) {
				'use strict';
				var newElementString;
				var key;
				var allElementsString;
				var classElem;
				var ngClick;
				var icon;
				var id;
				var triggerFolderExperiments;
				var buttonDelete;
				// test - this is folder for experiments?
				if (idParent.substr(idParent.length - 20) === 'FOLDERFOREXPERIMENTS') {
					triggerFolderExperiments = true;
				}
				for (key in objNewElement) {
					//create element
					id = "id = '" + objNewElement[key].id + "'";
					classElem = "class = '" + ((objNewElement[key].type === 'file')? '' : 'click_element') + "' ";
					ngClick = " ng-click = 'showChild(\"" + objNewElement[key].path + "\", \"" + objNewElement[key].type + "\", \"" + objNewElement[key].id + "\", $event)"; 
					icon = "<i ng-class='typeIcon(\"" + objNewElement[key].type + "\")' aria-hidden='true'></i>";
					if (triggerFolderExperiments) {
						buttonDelete = "<button ng-click ='deleteDir(\"" + objNewElement[key].id + "\", \"" + objNewElement[key].path + "\"); $event.stopPropagation();'>delete</button>"
						newElementString = 	"<li " +  id + " " + classElem + ngClick + "'>" + icon + "<span>" + objNewElement[key].name + "</span>" + buttonDelete + "</li>";						
					}
					else {
						newElementString = 	"<li " +  id + " " + classElem + ngClick + "'>" + icon + "<span>" + objNewElement[key].name + "</span>" + "</li>";						
					}
					if (!allElementsString) {
						allElementsString = newElementString
					}
					else {
						allElementsString += newElementString
					}
					//create watcher
					scanServSocketFactory.createSocket(objNewElement[key].id, objNewElement[key].path, scope)
				}
				return "<ul class = '" + idParent + "-child-wrap wrap_for_child'>" + allElementsString + "</ul>"
			}		
			scope.showChild = function(path, type, id, event) {
				'use strict';
				var newElement;
				var currentElement;
				var triggerShowChildrens;
				var removeElementsWrap;
				var removeElements;
				var removeElementsLength
				var idElements;
				var i;
				var thisId;
				idElements = [];
				event.stopPropagation();
				event.preventDefault();
				if (type === 'dir') {
					currentElement = event.currentTarget
					$('li').removeClass('current_dir');
					$(currentElement).addClass('current_dir')
					triggerShowChildrens = $(currentElement).find("ul." + id + "-child-wrap").attr('class');
					//close dir remove elements and destroy watchers
					if (triggerShowChildrens) {
						removeElementsWrap = $(currentElement).children("ul");
						removeElements = $(removeElementsWrap).find('li')
						removeElementsLength = removeElements.length
						for (i = 0; i < removeElementsLength; i++) {
							thisId = $(removeElements[i]).attr('id')
							scanServSocketFactory.destroySocket(thisId)
						}
						removeElementsWrap.remove()
					}
					// create child element + create watchers
					else {
						scope[id] = undefined;
						$http.post(mainUrl.url + '/getCurrentElementChildrens', {"path" : path})
							.success(function(result) {
								// emptyDir
								if (result.emptyDir) {
									$("#" + id).find('b').remove()
									$("#" + id).append('<b> директория пустая</b>')
								}
								// full dir
								else {
									scope[id] = result;
									scope.vidget = result;
									newElement = $compile( createNewListElement(id, scope, result) )( scope ) 
									angular.element(currentElement).append(newElement)
								}
							})
							.error(function(err) {
								console.log(err)
							})		
					}
				}		
			}
			scope.typeIcon = function(type) {
				if (type === 'file') {
					return 'fa fa-file'
				}
				else {
					return 'fa fa-folder-o'
				}
			}
		}
	}
}]);
