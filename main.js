/* This function creates the board in its entirty */
function createBoard(save){
	if(save.version >= 0.0106){
		$("#title").html(save.title);
		$("head title").html(save.title);
	}
	for(var i in save.lists){
		addList(save.lists[i])
		
	}
}

function addList(list){
	let counter = $("#container info-data list-counter"),
		i = counter.html() * 1;
	if(!list){
		list = defaultBoard.lists[0];
	}
	
	let id = "#list-" + i;
	
	counter.html(i + 1);

	$("#board").append('<div id="list-' + i + '" class="list" style="top: '+list.top+'; left: '+list.left+'; width: '+list.width+'; height: '+list.height+';">');

	$(id).append('<div id="list-' + i + '-header" class="list-header">');
	$(id).append('<table id="list-' + i + '-table" class="list-content">');
	$(id).append('<div id="list-' + i + '-footer" class="list-footer">');
	$(id).append('<info-data>');

	$(id + "-header").append('<table>');
	$(id + "-header table").append('<tr>');

	$(id + "-header table tr").append('<td id="list-' + i + '-name" class="name">');
	$(id + "-header table tr").append('<td class="header-drag-handler">');
	$(id + "-header table tr").append('<td id="list-' + i + '-X" class="X">');

	$(id + "-header table tr td.name").html(list.name);
	$(id + "-header table tr td.header-drag-handler").append('<div id="list-' + i + '-header-drag-handler-img" class="header-drag-handler-img grab">');

	$("#header-drag-handler-src svg").clone().appendTo(id + "-header-drag-handler-img");
	$("#X-src svg").clone().appendTo(id + "-X");

	for(var j = 0; j < list.items.length; j++){
		createRow(i, j);

		if(list.items[j].value){
			$(id + "-row-" + j + "-task span").html(list.items[j].value).addClass("task").removeClass("hidden");
			$(id + "-row-" + j + "-task input").val(list.items[j].value).addClass("hidden");
		} else {
			hideSpan(i, j);
		}

		$(id + "-row-" + j + " td.check input").attr("checked", list.items[j].checked);
	}

	$(id + "-footer").append('<div class="list-footer-left">');
	$(id + "-footer").append('<div class="progress-bar-shell">');

	$(id + "-footer .list-footer-left").append('<div class="plus-img" onclick="addRow(' + i + ')">');
	$(id + "-footer .progress-bar-shell").append('<div id="list-' + i + '-progress-bar" class="inner" />');

	$("#plus-src svg").clone().appendTo(id + "-footer .plus-img");

	/* Technical variables, reset upon refresh */
	$(id + " info-data").append('<counter>');
	$(id + " info-data").append('<total-rows>');
	$(id + " info-data").append('<content-height>');

	$(id + " counter").html(list.items.length);
	$(id + " total-rows").html(list.items.length);
	$(id + " content-height").html(0);

	/* Adding css to various elements */
	updateProgressBar(i);
	setHeight(i);
	$(id + "-table tbody tr:even").addClass("even-row");

	/* Listener for when the list is resized */
	new ResizeSensor($(id)[0], function() {
		for(var i = 0; i < $(id + " span").length; i++){
			let span = $($(id + " span")[i]);
			span.width(span.parent().width() * .9);
		}
	});

	/* Listener for when the X is clicked */
	$(id + " .X svg").click(function(){
		$("#" + $(this).parent()[0].id.slice(0, -2)).remove();
	});

	bindTableDnD(i);
	dragElement($(id)[0]);
}

function dragElement(elmnt) {
	let pos1 = 0,
		pos2 = 0,
		pos3 = 0,
		pos4 = 0;

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
				elmnt.style.left = newX + "px";
			}
			if(newY + $(elmnt).height() + 4 < $(window).height() && newY > $("#header").height() + 21){
				elmnt.style.top = newY + "px";
			}
		};
	}
}

function addKeyListener(list, row){
	$("#list-" + list + "-row-" + row + "-task input").on("keypress", function(e){
		let span = $("#list-" + list + "-row-" + row + "-task span"),
			input = $("#list-" + list + "-row-" + row + "-task input"),
			field = $.trim(input.val());
		// if the enter key is pressed and the text box isn't blank
		if (e.keyCode == 13 && field) {
			span.html(field);
			span.removeClass("hidden").addClass("task");
			input.addClass("hidden");
			return false; // this part may or may not be important
		}
	});
}

function hideSpan(list, row){
	$("#list-" + list + "-row-" + row + "-task span").addClass('hidden').removeClass('task');
	$("#list-" + list + "-row-" + row + "-task input").removeClass('hidden');
	//return false;
}

function updateProgressBar(list){
	let ratio = $("#list-" + list + " input:checked").length / $("#list-" + list + " input[type=checkbox]").length,
		bar = $("#list-" + list + "-progress-bar");
	bar.width(ratio*100 + "%");
	bar.css("background-color", "hsl(" + ratio*120 + ", 100%, 50%)");
}

function createRow(list, row){
	$("#list-" + list + "-table").append('<tr id="list-' + list + '-row-' + row + '">');

	$("#list-" + list + "-row-" + row).append('<td class="row-drag-handler">');
	$("#list-" + list + "-row-" + row).append('<td id="list-' + list + '-row-' + row + '-task">');

	$("#list-" + list + "-row-" + row + " td.row-drag-handler").append('<div class="row-drag-handler-img grab">');
	$("#row-drag-handler-src svg").clone().appendTo("#list-" + list + "-row-" + row + " .row-drag-handler-img");

	$("#list-" + list + "-row-" + row + "-task").append('<input class="text" type="text" placeholder="Task ' + row + '" />');
	$("#list-" + list + "-row-" + row + "-task").append('<span class="hidden" onclick="hideSpan(' + list + ', ' + row + ')">');

	$("#list-" + list + "-row-" + row).append('<td class="check">');
	$("#list-" + list + "-row-" + row).append('<td class="trash">');

	$("#list-" + list + "-row-" + row + " td.check").append('<input type="checkbox" onclick="updateProgressBar(' + list + ')" />');
	$("#list-" + list + "-row-" + row + " td.trash").append('<div class="trash-img" onclick="deleteRow(' + list + ', ' + row + ')">');

	$("#trash-src svg").clone().appendTo("#list-" + list + "-row-" + row + " .trash-img");

	/* Adding a listeniner for the enter key */
	addKeyListener(list, row);
}

function addRow(list){
	let oldHeight = $("#list-" + list).height();
	
	let counter = $("#list-" + list + " info-data counter"),
		totalRows = $("#list-" + list + " info-data total-rows"),
		newRow = counter.html();

	createRow(list, newRow);
	addKeyListener(list, newRow);

	// element.html() returns a string. Multiplying by one to convert string to an arithmetic-ready number.
	counter.html(newRow * 1 + 1);
	totalRows.html(totalRows.html() * 1 + 1);

	updateProgressBar(list);
	setHeight(list, oldHeight);

	$("#list-" + list + "-table tr").removeClass("even-row");
	$("#list-" + list + "-table tr:even").addClass("even-row");

	bindTableDnD(list);
}

function bindTableDnD(list){
	$("#list-" + list + "-table").tableDnD({
		onDragClass: "picked-up grabbed",
		onDrop: function(){
			$("#list-" + list + "-table tr").removeClass("even-row");
			$("#list-" + list + "-table tr:even").addClass("even-row");
			$("#list-" + list + " .row-drag-handler-img").removeClass("grabbed");
		},
		dragHandle: ".row-drag-handler",
		onDragStart: function(table, row) {
			$("#list-" + list + " .row-drag-handler-img").addClass("grabbed");
		}
	});
}

/*
**	!!!  DO NOT TOUCH  !!!
**	Yes, this function is quite messy, but it works.
*/
function setHeight(list, oldHeight){
	let newHeight = $("#list-" + list + "-header").height() + $("#list-" + list + "-table").height() + $("#list-" + list + "-footer").height(),
		numRows = $("#list-" + list + " info-data total-rows").html() * 1,
		contentHeight = $("#list-" + list + " info-data content-height").html() * 1,
		
		listE = $("#list-" + list);
	
	$("#list-" + list + " info-data content-height").html(newHeight);
	
	if(contentHeight === 0){
		listE.css("min-height", newHeight + "px");
	}
	if(oldHeight >= contentHeight){
		newHeight += oldHeight - contentHeight
		listE.css("height", newHeight + "px");
		if(oldHeight == contentHeight){
			$("#list-" + list + " info-data content-height").html(listE.height());
		}
	} else if(newHeight < oldHeight){
		listE.css("height", newHeight + "px");
	}
	listE.scrollTop($("#list-" + list)[0].scrollHeight);
}

function deleteRow(list, row){
	let oldHeight = $("#list-" + list).height();
	
	let totalRows = $("#list-" + list + " info-data total-rows");

	$("#list-" + list + "-row-" + row).remove();

	$("#list-" + list + "-table tr").removeClass("even-row");
	$("#list-" + list + "-table tr:even").addClass("even-row");

	updateProgressBar(list);
	setHeight(list, oldHeight);

	// element.html() returns a string. Multiplying by one to convert string to an arithmetic-ready number.
	totalRows.html(totalRows.html() * 1 - 1)
}