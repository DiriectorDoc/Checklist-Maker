(function(root, factory){
	if (typeof define === "function" && define.amd) {
		// AMD. Register as an anonymous module.
		define(["exportBoard"], function (a) {
			return (root.amdWebGlobal = factory(a));
		});
	} else {
		// Browser globals
		root.exportBoard = factory(root.exportBoard);
	}
}(typeof window !== "undefined" ? window : this, function(exportBoard){

	exportBoard = function(board){
		if(board){
			let config = window.config || {encrypt:0,unloadWarning:1},
				name;
			if(typeof board == "object"){
				name = board.title;
				let jsonString = JSON.stringify(board, null, 4);
				board = config.encrypt ? Encryptor.encrypt(jsonString) : jsonString
			} else if(typeof board == "string"){
				name = (/"title":\s*"(.*)",?/g).exec(board)[1];
			}
			$("<a>").attr({
				download: name + (config.encrypt ? ".cmbenc" : ""),
				href: URL.createObjectURL(new Blob([board], {type: config.encrypt ? "text/plain" : "application/json"}))
			})[0].click();
			return;
		} else {
			board = {
				version: 0.03,
				title: $.trim($("#title").html()),
				lists: [],
				notes: [],
				config: config
			};

			$(".list").each(function(i, e){
				e = $(e)[0];
				let n = (/list-(\d+)/g).exec(e.id)[1] * 1;

				let newList = {
					name: $("#list-" + n + "-name span").html(),
					items: [],
					top: e.style.top,
					left: e.style.left,
					width: e.style.width,
					height: e.style.height
				},
					trs = $(e).find(".list-content tr");
				for(var i = 0; i < trs.length; i++){
					let tr = $(trs[i])
					newList.items.push({
						value: tr.find(".task").html(),
						checked: Boolean(tr.find(".check input:checked").length)
					})
				}

				board.lists.push(newList);
			})

			$(".note").each(function(i, e){
				e = $(e)[0];
				let n = (/note-(\d+)/g).exec(e.id)[1] * 1;

				board.notes.push({
					name: $("#note-" + n + "-name").html(),
					value: $(e).find("textarea").val(),
					top: e.style.top,
					left: e.style.left,
					width: e.style.width,
					height: e.style.height
				});
			})
			exportBoard(board);
		}
	}

	return exportBoard;
}));