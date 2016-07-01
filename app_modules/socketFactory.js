
var sockets = {}
var createListener = function(obj, io, fs) {
	if (sockets[obj.id]) {
	}
	else {
		sockets[obj.id] = setInterval(function() {
			var path = obj.path.replace(/\//g, "\\")
			var pathExist = true;
			fs.access(path, fs.F_OK, function(err) {
				if (!err) {	} 
				else {
					// say client that catalog remove
					io.emit(obj.id, {'id':obj.id})
					//delete interval
					sockets[obj.id]
					clearInterval(sockets[obj.id])
					delete sockets[obj.id]
				}
			});
		},1000)
	}
}
var destroyListener = function(obj) {
	clearInterval(sockets[obj.id])
	delete sockets[obj.id]
}
module.exports = {
	'createListener' : createListener,
	'destroyListener' : destroyListener
}