registerController("CabinetController", ['$api', '$scope', function($api, $scope) {

	$scope.userDirectory = '';
	$scope.currentDirectory = '/';
	$scope.directoryContents = [];
	$scope.editFile = {name: "", path: "", content: ""};
	$scope.deleteFile = {name: "", path: "", directory: false};
	$scope.newFolder = {name: "", path: $scope.currentDirectory};

	$scope.submitChangeDirectory = function(directory) {
		console.log(directory);
	}

	$scope.getDirectoryContents = function(dir) {
		$api.request({
			module: "Cabinet",
			action: "getDirectoryContents",
			directory: dir
		}, function(response) {
			if (response.success == true) {
				$scope.currentDirectory = response.directory;
				$scope.directoryContents = [];
				for (var i = 0; i < response.contents.length; i++) {
					$scope.directoryContents.unshift({name: response.contents[i].name, directory: response.contents[i].directory, path: response.contents[i].path});
				}
			}
		});
	}

	$scope.goToParentDirctory = function() {
		$api.request({
			module: "Cabinet",
			action: "getParentDirectory",
			directory: $scope.currentDirectory
		}, function(response) {
			if (response.success == true) {
				parent = response.parent;
				$scope.getDirectoryContents(parent);
			}
		});
	}

	$scope.requestDeleteFile = function(file) {
		$scope.deleteFile.name = file.name;
		$scope.deleteFile.path = file.path;
		$scope.deleteFile.directory = file.directory;
		console.log($scope.deleteFile);
	}

	$scope.sendDeleteFile = function() {
		$api.request({
			module: "Cabinet",
			action: "deleteFile",
			file: $scope.deleteFile.path
		}, function(response) {
			$scope.deleteFile = {};
			$scope.getDirectoryContents($scope.currentDirectory);
		});
	}

	$scope.requestEditFile = function(file) {
		$api.request({
			module: "Cabinet",
			action: "getFileContents",
			file: file.path
		}, function(response) {
			if (response.success == true) {
				$scope.editFile = {name: file.name, path: file.path, content: response.content};
			}
		});
	}

	$scope.sendEditFile = function() {
		$api.request({
			module: "Cabinet",
			action: "editFile",
			file: $scope.currentDirectory + "/" + $scope.editFile.name,
			contents: $scope.editFile.content
		}, function(response) {
			console.log(response.success);
			$scope.editFile = {};
			$scope.getDirectoryContents($scope.currentDirectory);
		});
	}

	$scope.createFolder = function() {
		$api.request({
			module: "Cabinet",
			action: "createFolder",
			name: $scope.newFolder.name,
			directory: $scope.currentDirectory
		}, function(response) {
			$scope.newFolder = {};
			$scope.getDirectoryContents($scope.currentDirectory);
		});
	}

	$scope.getDirectoryContents($scope.currentDirectory);


}]);