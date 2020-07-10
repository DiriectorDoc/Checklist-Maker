(function(root, factory){
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['exportBoard'], function (a) {
			return (root.amdWebGlobal = factory(a));
		});
	} else {
		// Browser globals
		root.exportBoard = factory(root.exportBoard);
	}
}(typeof window !== 'undefined' ? window : this, function(exportBoard){

	exportBoard = function(board){
		if(board){
			let name;
			if(typeof board === "object"){
				name = board.title;
				board = JSON.stringify(board, null, 4)
			} else if(typeof board === "string"){
				name = (/"title":\s*"(.*)",?/g).exec(board)[1];
			}
			$("<a>").attr({
				download: name,
				href: URL.createObjectURL(new Blob([board], {type : 'application/json'}))
			})[0].click();
			return;
		} else {
			board = {
				version: 0.0107,
				title: "Checklist",
				lists: [],
				notes: []
			};

			$(".list").toArray().forEach(function(e){
				e = $(e)[0];
				let n = (/list-(\d+)/g).exec(e.id)[1] * 1;

				let newList = {
					name: $("#list-" + n + "-name").html(),
					items: [],
					top: e.style.top,
					left: e.style.left,
					width: e.style.width,
					height: e.style.height
				}

				let trs = $(e).find(".list-content tr");
				for(var i = 0; i < trs.length; i++){
					let tr = $(trs[i])
					newList.items.push({
						value: tr.find(".task").html(),
						checked: Boolean(tr.find(".check input:checked").length)
					})
				}

				board.lists.push(newList);
			})

			$(".note").toArray().forEach(function(e){
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