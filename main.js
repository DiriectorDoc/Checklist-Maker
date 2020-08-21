const getID = (l,r) => "#list-" + l + (r || r === 0 ? "-row-" + r:""),
	  defaultBoard = {
		  version: 0.03,
		  title: "Checklist",
		  lists: [
			  {
				  name: "New List",
				  items: [
					  {
						  value: "",
						  checked: false
					  },
					  {
						  value: "",
						  checked: false
					  },
					  {
						  value: "",
						  checked: false
					  },
					  {
						  value: "",
						  checked: false
					  },
					  {
						  value: "",
						  checked: false
					  }
				  ],
				  top: "100px",
				  left: "15px",
				  width: "350px",
				  height: "223px"
			  }
		  ],
		  notes: [
			  {
				  name: "New Note",
				  value: "Edit me!",
				  top: "100px",
				  left: "400px",
				  width: "350px",
				  height: "223px"
			  }
		  ]
	  }
let nextPlacement = {
	top: 100,
	left: 15,
	width: 350,
	height: 223
}


/*
**	Major functions
*/
/* This function creates the board in its entirty */
function createBoard(save){
	if(save.version >= 0.0106){
		$("#title").html(save.title);
		$("#title-text").val(save.title);
		$("head title").html(save.title);
	}
	save.lists.forEach(function(e){
		addList(e);
	});
	if(save.version >= 0.0107){
		save.notes.forEach(function(e){
			addNote(e);
		});
	}
	if(save.version >= 0.03 && save.config){
		window.config = save.config;
		if(!window.config.unloadWarning && typeof window.config.unloadWarning !== "undefined"){
			$(window).off("beforeunload");
		}
	}
}

function addList(list){
	let i = $("#board").attr("list-counter") * 1,
		useDefaultSave = !list;
	if(useDefaultSave){
		list = defaultBoard.lists[0];
	}
	$("#board").attr("list-counter", i + 1);

	let id = getID(i);

	$("#board").append('<div id="list-' + i + '" class="list">');
	$("#list-" + i).css(useDefaultSave ? getNextPlacement() : {
		top: list.top,
		left: list.left,
		width: list.width,
		height: list.height
	});

	$(id)
		.append('<div id="list-' + i + '-header" class="list-header">')
		.append('<table id="list-' + i + '-table" class="list-content">')
		.append('<div id="list-' + i + '-footer" class="list-footer">');

	$(id + "-header").append("<table>");
	$(id + "-header table").append("<tr>");

	$(id + "-header table tr")
		.append('<td id="list-' + i + '-name" class="name">')
		.append('<td class="header-drag-handler">')
		.append('<td id="list-' + i + '-X" class="X">');

	$(id + "-header td.name")
		.append('<input class="text hidden" type="text" placeholder="List ' + i + '" />')
		.append('<span onclick="hideSpan(\'' + id + '-header table tr td.name\')">');
	$(id + "-header td.name span").html(list.name);
	$(id + "-header td.name input").val(list.name);
	addKeyListener(id + "-header table tr td.name");
	
	$(id + "-header td.header-drag-handler").append('<div id="list-' + i + '-header-drag-handler-img" class="header-drag-handler-img grab">');
	$("#header-drag-handler-src svg").clone().appendTo(id + "-header-drag-handler-img");
	
	$("#X-src svg").clone().appendTo(id + "-X");

	for(var j = 0; j < list.items.length; j++){
		createRow(i, j);

		let val = list.items[j].value;
		if(val){
			$(id + "-row-" + j + "-task span")
				.html(val)
				.addClass("task")
				.removeClass("hidden");
			$(id + "-row-" + j + "-task input")
				.val(val)
				.addClass("hidden");
		} else {
			hideSpan(i, j);
		}

		$(id + "-row-" + j + " td.check input").attr("checked", list.items[j].checked);
	}

	$(id + "-footer")
		.append('<div class="list-footer-left">')
		.append('<div class="progress-bar-shell">');

	$(id + "-footer .list-footer-left").append('<div class="plus-img" onclick="addRow(' + i + ')">');
	$(id + "-footer .progress-bar-shell").append('<div id="list-' + i + '-progress-bar" class="inner" />');

	$("#plus-src svg").clone().appendTo(id + "-footer .plus-img");

	/* Technical variables, reset upon refresh */
	$(id).attr({
		"counter": list.items.length,
		"total-rows": list.items.length,
		"content-height": 0
	});

	/* Adding css to various elements */
	updateProgressBar(i);
	setListHeight(i);
	$(id + "-table tbody tr:even").addClass("even-row");

	/* Listener for when the list is resized */
	new ResizeSensor($(id)[0], function() {
		for(var i = 0; i < $(id + " .list-content span").length; i++){
			let span = $($(id + " .list-content span")[i]);
			span.width(span.parent().width() * .9);
		}
	});

	/* Listener for when the X is clicked */
	$(id + " .X svg").click(function(){
		$(this)
			.closest(".list")
			.remove();
	});

	bindTableDnD(i);
	dragElement($(id)[0]);
}

function addNote(note){
	let i = $("#board").attr("list-counter") * 1,
		useDefaultSave = !note;
	if(useDefaultSave){
		note = defaultBoard.notes[0];
	}
	$("#board").attr("list-counter", i + 1);

	let id = "#note-" + i;

	$("#board").append('<div id="note-' + i + '" class="note">');
	$("#note-" + i).css(useDefaultSave ? getNextPlacement() : {
		top: note.top,
		left: note.left,
		width: note.width,
		height: note.height
	});

	$(id)
		.append('<div id="note-' + i + '-header" class="note-header">')
		.append('<div id="note-' + i + '-content" class="note-content">');

	$(id + "-header").append("<table>");
	$(id + "-header table").append("<tr>");

	$(id + "-header table tr")
		.append('<td id="note-' + i + '-name" class="name">')
		.append('<td class="header-drag-handler">')
		.append('<td id="note-' + i + '-X" class="X">');

	$(id + "-header td.name")
		.append('<input class="text hidden" type="text" placeholder="Note ' + i + '" />')
		.append('<span onclick="hideSpan(\'' + id + '-header table tr td.name\')">');
	$(id + "-header td.name span").html(note.name);
	$(id + "-header td.name input").val(note.name);
	addKeyListener(id + "-header td.name");
	
	$(id + "-header td.header-drag-handler").append('<div id="note-' + i + '-header-drag-handler-img" class="header-drag-handler-img grab">');
	$("#header-drag-handler-src svg").clone().appendTo(id + "-header-drag-handler-img");

	$("#X-src svg").clone().appendTo(id + "-X");

	$(id + "-content").append('<textarea></textarea>');
	$(id + " textarea").val(note.value);

	/* Listener for when the X is clicked */
	$(id + " .X svg").click(function(){
		$(this)
			.closest(".note")
			.remove();
	});

	dragElement($(id)[0]);
}

function createRow(list, row){
	let rowID = getID(list, row);
	$(getID(list) + "-table").append('<tr id="list-' + list + "-row-" + row + '">');

	$(rowID)
		.append('<td class="row-drag-handler">')
		.append('<td id="list-' + list + "-row-" + row + '-task">')
		.append('<td class="check">')
		.append('<td class="trash">');

	$(rowID + " td.row-drag-handler").append('<div class="row-drag-handler-img grab">');
	$("#row-drag-handler-src svg").clone().appendTo(rowID + " .row-drag-handler-img");

	$(rowID + "-task")
		.append('<input class="text" type="text" placeholder="Task ' + (row + 1) + '" />')
		.append('<span class="hidden" onclick="hideSpan(' + list + ', ' + row + ')">');
	$(rowID + "-task input").blur(function(){
		let input = $(rowID + "-task input");
		
		$(rowID + "-task span")
			.html($.trim(input.val()) || input.attr("placeholder"))
			.removeClass("hidden")
			.addClass("task")
		input.addClass("hidden");
	})

	$(rowID + " td.check").append('<input type="checkbox" onclick="updateProgressBar(' + list + ')" />');
	$(rowID + " td.trash").append('<div class="trash-img" onclick="deleteRow(' + list + ', ' + row + ')">');

	$("#trash-src svg").clone().appendTo(rowID + " .trash-img");

	/* Adding a listeniner for the enter key */
	addKeyListener(list, row, true);
}

function addRow(list){
	let listID = getID(list),
		oldHeight = $(listID).height(),
		newRow = $(listID).attr("counter") * 1; // $.attr("...") returns a string. Multiplying by one converts string into an arithmetic-ready number.

	createRow(list, newRow);
	addKeyListener(list, newRow, true);

	$(listID).attr({
		"total-rows": $(listID).attr("total-rows") * 1 + 1,
		"counter": newRow + 1
	});

	updateProgressBar(list);
	setListHeight(list, oldHeight);

	$(listID + "-table tr").removeClass("even-row");
	$(listID + "-table tr:even").addClass("even-row");

	$(getID(list, newRow) + "-task input").focus();

	$(listID + "-table").tableDnDUpdate()
}

function deleteRow(list, row){
	let listID = getID(list),
		oldHeight = $(listID).height();

	$(getID(list, row)).remove();

	$(listID + "-table tr").removeClass("even-row");
	$(listID + "-table tr:even").addClass("even-row");

	updateProgressBar(list);
	setListHeight(list, oldHeight);

	// element.html() returns a string. Multiplying by one to convert string to an arithmetic-ready number.
	$(listID).attr("total-rows", $(listID).attr("total-rows") * 1 + 1);
}

function setTextareaHeight(note){
	let area = $("#note-" + note + " textarea");
	area.height(area.parent().height());
}

function dragElement(elmnt) {
	let [pos1, pos2, pos3, pos4] = [0, 0, 0, 0];

	$("#" + elmnt.id + "-header-drag-handler-img")[0].onmousedown = dragMouseDown;

	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		// get the mouse cursor position at startup:
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = function(){
			/* stop moving when mouse button is released:*/
			document.onmouseup = null;
			document.onmousemove = null;
		};
		// call a function whenever the cursor moves:
		document.onmousemove = function(e){
			e = e || window.event;
			e.preventDefault();
			// calculate the new cursor position:
			pos1 = pos3 - e.clientX;
			pos2 = pos4 - e.clientY;
			pos3 = e.clientX;
			pos4 = e.clientY;

			// the element's new co-ordinates:
			let newX = elmnt.offsetLeft - pos1,
				newY = elmnt.offsetTop - pos2;

			// newX + $(elmnt).width() is the co-ordinate of the rightmost edge (+4 for the border, 2px on each side)
			if(newX + $(elmnt).width() + 4 < $(window).width() && newX > 0){
				$(elmnt).css("left", "min(" + newX + "px , calc(100vw - 4px - " + $(elmnt).width() + "px))");
			}
			if(newY + $(elmnt).height() + 4 < $(window).height() && newY > $("#header").height() + 21){
				$(elmnt).css("top", "min(" + newY + "px , calc(100vh - 5px - " + $(elmnt).height() + "px))");
			}
		};
	}
}

function addKeyListener(list, row, taskClass){
	let elem = $(typeof list === "string" ? list:(getID(list, row) + "-task"));
	elem.find("input").on("keydown", function(e){
		// if the enter key is pressed and the text box isn't blank
		if ((e.keyCode || e.which) == 13) {
			let span = elem.find("span"),
			input = elem.find("input"),
			field = $.trim(input.val()) || input.attr("placeholder");
			
			span
				.html(field)
				.removeClass("hidden")
			if(taskClass){
				span.addClass("task");
			}
			input.addClass("hidden");
		}
	});
}

function bindTableDnD(list){
	let listID = getID(list);
	$(listID + "-table").tableDnD({
		onDragClass: "picked-up grabbed",
		onDrop: function(){
			$(listID + "-table tr").removeClass("even-row");
			$(listID + "-table tr:even").addClass("even-row");
			$(listID + " .row-drag-handler-img").removeClass("grabbed");
		},
		dragHandle: ".row-drag-handler",
		onDragStart: function(table, row) {
			$(listID + " .row-drag-handler-img").addClass("grabbed");
		}
	});
}

function hideSpan(list, row){
	if(typeof list === "string"){
		$(list + " span").addClass("hidden");
		$(list + " input")
			.removeClass("hidden")
			.focus();
	} else {
		$(getID(list, row) + "-task span")
			.addClass("hidden")
			.removeClass("task");
		$(getID(list, row) + "-task input")
			.removeClass("hidden")
			.focus();
	}
}

function updateProgressBar(list){
	let ratio = $(getID(list) + " input:checked").length / $(getID(list) + " input[type=checkbox]").length;
	$(getID(list) + "-progress-bar")
		.width(ratio*100 + "%")
		.css("background-color", "hsl(" + ratio*120 + ", 100%, 50%)");
}

/* This function sets the list height and the scroll height. It was a pain to perfect as evident by the quantity of if() statements */
function setListHeight(list, oldHeight){
	let listE = $(getID(list)),
		
		newHeight = $(getID(list) + "-header").height() + $(getID(list) + "-table").height() + $(getID(list) + "-footer").height(),
		contentHeight = listE.attr("content-height") * 1;

	listE.attr("content-height", newHeight);

	if(contentHeight === 0){
		listE.css("min-height", newHeight + "px");
	}
	if(oldHeight >= contentHeight){
		listE.css("height", (newHeight + oldHeight - contentHeight) + "px");
		if(oldHeight == contentHeight){
			listE.attr("content-height", listE.height());
		}
	} else if(newHeight < oldHeight){
		listE.css("height", newHeight + "px");
	}
	if(newHeight > contentHeight){
		listE.scrollTop(listE[0].scrollHeight);
	}
}

function getNextPlacement(){
	let next = {};
	
	Object.keys(nextPlacement).forEach(key => {
		next[key] = nextPlacement[key] + "px";
	});
	
	if(nextPlacement.left + 736 < $("#board").width()){
		nextPlacement.left += 385;
		return next;
	} else {
		while(nextPlacement.left > 100){
			nextPlacement.left -= 385;
		}
		if (nextPlacement.left < 0){
			nextPlacement.left *= -1;
		}
	}
	if(nextPlacement.top + 482 < $(window).height()){
		nextPlacement.top += 258;
		return next;
	} else {
		while(nextPlacement.top > 200){
			nextPlacement.top -= 223;
		}
		nextPlacement.left += 35;
		nextPlacement.top += 35;
		if (nextPlacement.top < 100){
			nextPlacement.top += 100;
		}
	}
	
	return next;
}


/*
**	Switch functions
*/
function expand(){
	$("#changelog").animate({
		"height": "30vh",
		"width": "30vw"
	}, 250)
	$("#changelog-img").css({
		"bottom": "30vh",
		"right": "30vw"
	})
	$("#changelog-img circle").css({
		"fill": "rgba(0, 0, 0, 1)"
	})
	$('#changelog-img path[hover-action="show"]').css({
		"stroke": "rgba(255, 255, 255, 1)"
	})
	$("#changelog-img").attr("onclick", "retract()")
}
function retract(){
	$("#changelog").animate({
		"height": "0",
		"width": "0"
	}, 250)
	$("#changelog-img").css({
		"bottom": "3px",
		"right": "3px"
	})
	$("#changelog-img circle").css({
		"fill": "rgba(0, 0, 0, 0)"
	})
	$('#changelog-img path[hover-action="show"]').css({
		"stroke": "rgba(255, 255, 255, 0)"
	})
	$("#changelog-img").attr("onclick", "expand()")
}

function openConfig(){
	$("#toolbar .file-img.gear svg").css({
		"fill": "#000",
		"stroke": "#000",
		"-webkit-transform": "rotate(90deg)",
		"-moz-transform": "rotate(90deg)",
		"transform": "rotate(90deg)"
	})
	$('input[config-setting="encrypt"]').prop("checked", window.config.encrypt)
	$('input[config-setting="unloadWarning"]').prop("checked", window.config.unloadWarning)
	$("#config-menu").css("display", "initial")
}
function closeConfig(){
	$("#toolbar .file-img.gear svg").removeAttr("style")
	$('#config-menu input[type="checkbox"]').each(function(i, e){
		window.config[$(e).attr("config-setting")] = $(e).prop("checked");
	})
	$("#config-menu").css("display", "none")
	if(!window.config.unloadWarning){
		$(window).off("beforeunload");
	}
}

/*


Abamndoned feature that never worked. This was suppoese to determine where a new list could be placed, but it would have taken too much work and a new approach was taken.



/*
**	These functions are all used to determine where a new list/note can be placed
* /
/* Math function. Gets the determinatnt of a matrix. * /
function determinant(m){ // m for matrix
	return m[0][0]*(m[1][1]*m[2][2] - m[2][1]*m[1][2]) - m[0][1]*(m[1][0]*m[2][2] - m[2][0]*m[1][2]) + m[0][2]*(m[1][0]*m[2][1] - m[2][0]*m[1][1])
}

/* Gets area of triange from a matrix containing 3 points and a few 1s * /
function area(m){ // m for matrix
	return Math.abs(determinant(m))/2
}

function getPoints(){
	let assortedPoints = [
		{
			id: "board",
			tl: [0, $("#header").height() + 21],
			bl: [0, window.innerHeight],
			tr: [window.innerWidth, $("#header").height() + 21],
			br: [window.innerWidth, window.innerHeight]
		}
	];
	$(".list,.note").each(function(i, e){
		e = $(e);
		let pos = e.position();
		assortedPoints.push({
			id: e[0].id,
			tl: [pos.left - 2, pos.top - 2],
			bl: [pos.left - 2, pos.top + e.height() + 2],
			tr: [pos.left + e.width() + 2, pos.top - 2],
			br: [pos.left + e.width() + 2, pos.top + e.height() + 2]
		});
	});
	return assortedPoints;
}

function getPlacement(){
	let assortedPoints = getPoints(),
		points = [],
		areas = [];
	
	for(var i = 0; i < assortedPoints.length; i++){
		points.push(
			assortedPoints[i].tr,
			assortedPoints[i].tl,
			assortedPoints[i].br,
			assortedPoints[i].bl
		)
	}
	
	for(var i = 0; j < assortedPoints.length-2; i++){
		for(var j = i+1; j < assortedPoints.length-1; j++){
			for(var k = j+1; k < assortedPoints.length; k++){
				let matrix = [
					[points[i][0], points[i][1], 1],
					[points[j][0], points[j][1], 1],
					[points[k][0], points[k][1], 1]
				];
				areas.push([area(matrix), i, j, k]);
			}
		}
	}
	
	return shellsort(points);
}

function shellsort(arr){
	for(var g = Math.floor(arr.length/2); g > 0; g = Math.round(g/2 - .25)){
		for(var i = g; i < arr.length; i++){
			let temp = arr[i],
				j;
			/*
			**	The comparison  arr[j-g][0] > temp[0]  is asuming the list is two dimentional, which it will be,
			**	but it's important to note because this is not typically what you'll see in a regular shellsort
			* /
			for(j = i; j >= g && arr[j-g][0] > temp[0]; j -= g){
				arr[j] = arr[j-g];
			}
			arr[j] = temp;
		}
	}
	return arr;
};

*/