(function(root, factory){
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['importList'], function (a) {
            return (root.amdWebGlobal = factory(a));
        });
    } else {
        // Browser globals
        root.importList = factory(root.importList);
    }
}(typeof window !== 'undefined' ? window : this, function(importList){
    
	importList = function(){
		if($("#board .list").length){
			if(confirm("Importing will override your existing board, is this okay?")){
				$("#board .list").remove();
			} else {
				return;
			}
		}
		$('<input id="file-chooser" type="file" onchange="importList.read(this)" accept=".json, .txt" hidden/>')[0].click();
	}
	
	importList.read = function(input){
		let file = input.files[0];
		if(file){
			let reader = new FileReader();
			reader.onload = function (e) {
                createBoard(JSON.parse(e.target.result));
            };
            reader.readAsText(file);
		}
	}
	
    return importList;
}));