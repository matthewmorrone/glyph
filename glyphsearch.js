$(function() {
	var log = console.log.bind(console);
	var iconsIndex = new AlgoliaSearch("9JQV0RIHU0", "2219d421236cba4cf37a98e7f97b3ec5").initIndex('icons'),
		innerTemplate = '<div class="entry col-lg-1 col-md-2 col-sm-3 col-xs-3" data-name={{{name}}} data-unicode="{{{unicode}}}"'+
			'title="{{{class}}}&#10;{{{_highlightResult.name.value}}}&#10;{{{_highlightResult.tags.value}}}"' +
			'>' +
			'<div class="description">{{{class}}}</div>' +
			'<div class="thumb">{{{html}}}</div>' +
			'<div class="name">{{{_highlightResult.name.value}}}</div>' +
			'<div class="tags hidden-xs">{{{_highlightResult.tags.value}}}</div>' +
			'</div>',
		allTemplate = '<div class="entry col-lg-1 col-md-2 col-sm-3 col-xs-3" data-name={{{name}}} data-unicode="{{{unicode}}}"' +
			'title="{{{class}}}&#10;{{{name}}}&#10;{{{tags}}}"' +
			'>' +
			'<div class="description">{{{class}}}</div>' +
			'<div class="thumb">{{{html}}}</i></div>' +
			'<div class="name">{{{name}}}</div>' +
			'<div class="tags">{{{tags}}}</div>' +
			'</div>',
		innerTemplateCompiled = Hogan.compile(innerTemplate),
		allTemplateCompiled = Hogan.compile(allTemplate),
		icons = {},
		clip,
		flashEnabled = false;
	var state = {
		library: "all",
		query: ""
	};
	var qs = $.url().param();
	setState("library", qs.library || "all");
	$.getJSON("batch.json", function(data) {
		generate(data, allTemplateCompiled, icons);
		handlers();
		setState("query", qs.query || "");
	});

	controls()

	function setLibrary(library) {
		var qs = $.url().param();
		$("#libraries > .btn").removeClass("active");
		$("[data-library='" + library + "']").addClass("active");
		if (library == "all") {
			delete qs.library;
			$(".section").removeClass("hide");
			if ($("#sticky:checkbox").is(":checked")) {
				refreshSticky();
			}
		} else {
			qs.library = library;
			$(".section").addClass("hide");
			$(".section#" + library).removeClass("hide");
		}
		updateURL(qs);
	}
	function search(v) {
		v = v || "";
		v = $.trim(v);
		if ($('#search').data('q') == v) {
			return;
		}
		$('#search').val(v).data('q', v);
		if (v.length === 0) {
			loadAll(icons);
		} else {
			iconsIndex.search(v, function(success, content) {
				if (!success) return;
				var result = {};
				generate(content.hits, innerTemplateCompiled, result);
				loadAll(result);
			}, {hitsPerPage: 1000});
		}
		var qs = $.url().param();
		if (v.length > 0) {
			qs.query = v;
		} else {
			delete qs.query;
		}
		updateURL(qs);
	}
	function generate(data, template, output) {
		data.forEach(function(v){
			var lib, html;
			if (v.name) {
				lib = v._tags[0];
				html = template.render(v);
				if (!output[lib]) {
					output[lib] = html;
				} else {
					output[lib] += html;
				}
			}
		});
	}
	function loadAll(htmls) {
		$('.section').hide();
		$('.icons').empty();
		for (var i in htmls) {
			$('#' + i + ' .icons').html(htmls[i]).parent().show();
		}
		if (flashEnabled) {
			clip.clip($(".entry"));
		}
		if ($("#sticky:checkbox").is(":checked")) {
			refreshSticky();
		}
	}
	function refreshSticky() {
		$(".header").fixedsticky("destroy").fixedsticky();
	}
	function updateURL(qs) {
		qs = $.param(qs);
		if (qs.length === 0) {
			history.replaceState(null, "GlyphSearch", "./");
		} else {
			history.replaceState(null, "GlyphSearch", "?" + qs);
		}
		window.scrollTo(0, 0);
	}
	function handlers() {
		if ($("#sticky:checkbox").is(":checked")) {
			$(window).on("resize", debounce(function() {
				refreshSticky();
			}, 250));			
		}
		$('#search').keydown(function(e) {
			if (e.which == 13) {
				e.preventDefault();
				return;
			}
		})
		.keyup(function(e) {
			if (e.which == 27) {
				setState("query", "");
				return;
			}
			setState("query", $(this).val());
		})
		.on("change", function() {
			setState("query", $(this).val());
		})
		.on("input", function() {
			var val = $(this).val();
			if (val.length === 0) {
				setState("query", "");
			}
		});
		$("#libraries .btn").click(function(e) {
			e.preventDefault();
			var library = $(this).attr("data-library");
			setState("library", library);
		});
	}
	function setState(prop, val) {
		if (prop == "library") {
			setLibrary(val);
		} else if (prop == "query") {
			search(val);
		}
		state[prop] = val;
	}
	function debounce(fn, delay) {
		var timer = null;
		return function () {
			var context = this, args = arguments;
			clearTimeout(timer);
			timer = setTimeout(function () {
				fn.apply(context, args);
			}, delay);
		};
	}
});

