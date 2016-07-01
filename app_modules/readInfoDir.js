module.exports = function(res, fs, startPath, io, socketFactory) {
	'use strict'
	var objDir;
	var files;
	var numberDirInArr;
	var path;
	function readInfo() {
		'use strict';
		path = startPath + '\\' + files[numberDirInArr];
		fs.stat(path, function(err, stats) {
			if (err) throw err;
			objDir[files[numberDirInArr]] = {
				'name' : files[numberDirInArr],
				'path' : path.replace(/\\/g, "/"),
				'id' : path.replace(/[^A-Za-zА-Яа-яЁё]/g, "")
			}
			if (stats.isFile()) {
				objDir[files[numberDirInArr]].type = 'file';
			}
			if (stats.isDirectory()) {
				// give the objekt property id for set this obj in scope
				objDir[files[numberDirInArr]].type = 'dir';
			}
			//create socket
			if (numberDirInArr) {
				numberDirInArr--
				readInfo()
			}
			else {
				res.send(objDir)
			}
		})
	}
	objDir = {}
	files = fs.readdirSync(startPath);
	// if dir not empty
	if (files.length != 0) {
		numberDirInArr = files.length - 1;
		readInfo()
	}
	// if dir empty
	else {
		res.send({'emptyDir' : true})
	}
}