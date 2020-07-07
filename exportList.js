(function(root, factory){
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exportList'], function (a) {
            return (root.amdWebGlobal = factory(a));
        });
    } else {
        // Browser globals
        root.exportList = factory(root.exportList);
    }
}(typeof window !== 'undefined' ? window : this, function(exportList){
    
	exportList = function(list){
		if(list){
			let name;
			if(typeof list === "object"){
				name = list.title;
				list = JSON.stringify(list, null, 4)
			} else if(typeof list === "string"){
				name = (/"title":\s*"(.*)",?/g).exec(list)[1];
			}
			$("<a>").attr({
				download: name,
				href: URL.createObjectURL(new Blob([list], {type : 'application/json'}))
			})[0].click();
			return;
		} else {
			list = {
				version: 0.0106,
				title: "Checklist",
				lists: []
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
				
				list.lists.push(newList);
			})
			
			exportList(list);
		}
	}
	
    return exportList;
}));