/* This function creates the list in its entirty */
function createList(save){
	let list = save.lists[0];

	$("#board").append('<div id="list-0" class="list" style="top: '+list.top+'; left: '+list.left+'; width: '+list.width+'; height: '+list.height+';">');

	$("#list-0").append('<div id="list-0-header" class="list-header">');
	$("#list-0").append('<table id="list-0-table" class="list-content">');
	$("#list-0").append('<div id="list-0-footer" class="list-footer">');
	$("#list-0").append('<info-data>');

	$("#list-0-header").append('<table>');
	$("#list-0-header table").append('<tr>');

	$("#list-0-header table tr").append('<td class="title">');
	$("#list-0-header table tr").append('<td class="header-drag-handler">');
	$("#list-0-header table tr").append('<td id="list-0-X" class="X">');

	$("#list-0-header table tr td.title").html(list.title);
	$("#list-0-header table tr td.header-drag-handler").append('<div id="list-0-header-drag-handler-img" class="header-drag-handler-img grab">');

	$("#header-drag-handler-src svg").clone().appendTo("#list-0-header-drag-handler-img");
	$("#X-src svg").clone().appendTo("#list-0-X");

	for(var i = 0; i < list.items.length; i++){
		createRow(0, i);

		if(list.items[i].value){
			$("#list-0-row-" + i + "-task span").html(list.items[i].value).addClass("task").removeClass("hidden");
			$("#list-0-row-" + i + "-task input").val(list.items[i].value).addClass("hidden");
		} else {
			hideSpan(0, i);
		}

		$("#list-0-row-" + i + " td.check input").attr("checked", list.items[i].checked);
	}

	$("#list-0-footer").append('<div class="list-footer-left">');
	$("#list-0-footer").append('<div class="progress-bar-shell">');

	$("#list-0-footer .list-footer-left").append('<div class="plus-img" onclick="addRow(0)">');
	$("#list-0-footer .progress-bar-shell").append('<div id="list-0-progress-bar" class="inner" />');

	$("#plus-src svg").clone().appendTo("#list-0-footer .plus-img");

	/* Technical variables, reset upon refresh */
	$("#list-0 info-data").append('<counter>');
	$("#list-0 info-data").append('<total-rows>');
	$("#list-0 info-data").append('<content-height>');

	$("#list-0 counter").html(list.items.length);
	$("#list-0 total-rows").html(list.items.length);
	$("#list-0 content-height").html(0);

	/* Adding css to various elements */
	updateProgressBar(0);
	setHeight(0);
	$("#list-0-table tbody tr:even").addClass("even-row");

	/* Listener for when the list is resized */
	new ResizeSensor($("#list-0")[0], function() {
		for(var i = 0; i < $("#list-0 span").length; i++){
			let span = $($("#list-0 span")[i]);
			span.width(span.parent().width() * .9);
		}
	});

	bindTableDnD(0);
	dragElement($("#list-0")[0]);
	
	let counter = $("#container info-data list-counter")
	counter.html(counter.html() * 1 + 1);
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
	$("#list-" + list + "-row-" + row + "-task").append('<span class="hidden" onclick="hideSpan(0, ' + row + ')">');

	$("#list-" + list + "-row-" + row).append('<td class="check">');
	$("#list-" + list + "-row-" + row).append('<td class="trash">');

	$("#list-" + list + "-row-" + row + " td.check").append('<input type="checkbox" onclick="updateProgressBar(0)" />');
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
	addKeyListener(0, newRow);

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