function controls() {
	var log = console.log.bind(console);
	
	$(".settings").resizable({handles: "e"})
	
	$(".icons.row").selectable({filter: ".entry"})
	
	$("#scroll").click(function() {
		if ($("#scroll:checkbox").is(":checked")) {
			$(".icons.row").css("max-height", function() {
				return screen.height - (31 /*$(".header").outerHeight()*/ * ($(".header").length + 4))
			})
		}
		else {
			$(".icons.row").css("max-height", "")
		}
	}).click()
	$(document).tooltip({
		position: {
			my: "center bottom-20",
			at: "center top",
			using: function(position, feedback) {
				$(this).css(position);
				$("<div>")
					.addClass("arrow")
					.addClass(feedback.vertical)
					.addClass(feedback.horizontal)
					.appendTo(this);
			}
		}
	});
	$(document).on("dblclick", ".entry", function() {
		// $(this).find("div").show()
		// $(this).find(".thumb").css("color", $("#color").spectrum("get").toRgbString())
		// $(".icons.row").last().after($(this))
		$("#cache").append($(this))
		return true
	})
	
	$(".icons.row:gt(0)").hide()
	$("#accordion").click()
	$("#collapse").click(function() {
		if ($("#collapse:checkbox").is(":checked")) {
			$(".main").find(".header").click(function() {
				if ($("#accordion:checkbox").is(":checked")) {
					$(this).addClass("active")
					$(".icons.row:not(.active)").slideUp(2000)
				}
				if (!$(this).next().is(":visible")) {
					$(this).next().slideDown(2000)
					$(this).addClass("active")
				}
				else if ($(this).next().is(":visible")) {
					$(this).next().slideUp(2000)
					$(this).removeClass("active")
					
				}
			})
		}
		else {
			$(".main").find(".header").off("click")
		}
	}).click()
	
	
	$("#collapseAll").click(function() {
		$(".icons.row").each(function() {
			if ($(this).is(":visible")) {
				$(this).slideUp(2000)
			}
		})
	})
	
	$("#expandAll").click(function() {
		$(".icons.row").each(function() {
			if (!$(this).is(":visible")) {
				$(this).slideDown(2000)
			}
		})
	})
	
	$("#invert").click(function() {
		$(".ui-selected").css("-webkit-filter", "invert(100%)")
		.css("background-color", "white")
	})
	
	function exportFile(name, content) {		
		// var encodedUri = encodeURI(content.join("%0A"));
		content = content.join("%0A")
		log(content)
		var a = document.createElement("a");
		a.setAttribute("target", '_blank');
		// a.setAttribute("href", encodedUri);
		a.setAttribute("href", 'data:attachment/csv,' + content);
		a.setAttribute("download", name);

		a.click(); // This will download the data file named "my_data.csv".
		document.body.appendChild(a);
		
	}
	
	$("#export").click(function() {
		exportFile("icons.csv", $.map($("#cache .entry"), function(a) {return $(a).find(".name").text() +", "+ $(a).find(".tags").text()}))
	})
	

	$("#sticky").click(function() {
		if ($("#sticky:checkbox").is(":checked")) {
			FixedSticky.tests.sticky = false;
			$(".header").fixedsticky();
		}
		else {
			$(".header").fixedsticky("destroy")
		}
	}).attr("disabled", true)

	
	$("#sort").click(function() {
		if ($("#sort:checkbox").is(":checked")) {
			$(".main").sortable({
				axis: "y",
				handle: ".header"
			})
		}
	})//.click()
	
	



	

	function hide() {
		$(".ui-selected").hide()
	}
	function noop() {}
	
	var commands = {
		8: hide,	
		46: hide, 
		72: hide, 
		13: function() {
			$(".ui-selected").css("color", $('#color').spectrum("get").toHexString())
			$(".ui-selected").css("background-color", $('#bgcolor').spectrum("get").toHexString())
		},
		116: noop
	}
	
	window.addEventListener("keydown", function(e) {
		log(e.which)
		if (e.which === 116) {return}
		if (commands[e.which]) {
			e.preventDefault()
			commands[e.which]()
		}
	}, true); 
	
	$("#rearrange").click(function() {
		if ($("#rearrange:checkbox").is(":checked")) {
			$(".icons.row").sortable({
				placeholder: "placeholder",
				forcePlaceholderSize: true,
				helper: "clone",
				forceHelperSize: true,
				opacity: '.5',
				start: function(event, ui) {
					$('.ui-sortable-placeholder').addClass("placeholder").removeAttr("style")
				},
				tolerance: "pointer",
				// start:function(event,ui){
				// 	$(ui.item).show();
				// 	clone = $(ui.item).clone();
				// 	before = $(ui.item).prev();
				// },
				// stop:function(event, ui){
				// 	before.after(clone);
				// }
				connectWith: ".icons.row"
			})
		}
		else {
			$(".icons.row").sortable("destroy");
		}
	})//.click()
	

	// var startColor = tinycolor.mostReadable("#ffff00", ["#ffffff", "#000000"]).toHexString();
	var startColor = "#ff0000"
	$('#color').spectrum({
		color: startColor,
		showInput: true,
		allowEmpty: true,
		showAlpha: true,
		showPalette: true,
		togglePaletteOnly: true,
		change: function(color) {
			$(".ui-selected").css("color", color.toHexString())
		},
		move: function(color) {
			$(".ui-selected").css("color", color.toHexString())
		}
	})
	$('#bgcolor').spectrum({
		color: "#ffffff",
		showInput: true,
		allowEmpty: true,
		showAlpha: true,
		showPalette: true,
		togglePaletteOnly: true,
		change: function(color) {
			$(".ui-selected").css("background-color", color.toHexString())
		},
		move: function(color) {
			$(".ui-selected").css("background-color", color.toHexString())
		}
	})
}