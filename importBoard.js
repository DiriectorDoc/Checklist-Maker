(function(root, factory){
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['importBoard'], function (a) {
			return (root.amdWebGlobal = factory(a));
		});
	} else {
		// Browser globals
		root.importBoard = factory(root.importBoard);
	}
}(typeof window !== 'undefined' ? window : this, function(importBoard){

	importBoard = function(){
		if($("#board .list").length){
			if(confirm("Importing will override your existing board, is this okay?")){
				$("#board .list,.note").remove();
			} else {
				return;
			}
		}
		$('<input id="file-chooser" type="file" onchange="importBoard.read(this)" accept=".json, .txt" hidden/>')[0].click();
	}

	importBoard.read = function(input){
		let file = input.files[0];
		if(file){
			let reader = new FileReader();
			reader.onload = function (e) {
				createBoard(JSON.parse(e.target.result));
			};
			reader.readAsText(file);
		}
	}

	return importBoard;
}));