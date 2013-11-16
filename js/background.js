$(function() {
	getFilter();
	getText();
	$("#selectbox").find("li").click(function() {
		setFilter($(this));
	})
	$(".share a").click(function(event) {
		var href = $(this).attr("href")
		window.open(href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
		return false;
	});

})

function setFilter(_this) {
	var elem = _this.attr("id");
	_this.toggleClass("checked");
	var type = _this.hasClass("checked");
	switch (elem) {
		case "add":
			chrome.storage.sync.set({
				"add": type
			});
			break;
		case "apps":
			chrome.storage.sync.set({
				"apps": type
			});
			break;
		case "link":
			chrome.storage.sync.set({
				"link": type
			});
			break;
		case "vkclean":
			chrome.storage.sync.set({
				"vkclean": type
			});
			break;
		case "short_link":
			chrome.storage.sync.set({
				"short_link": type
			});
			break;
		case "repost":
			chrome.storage.sync.set({
				"repost": type
			});
			break;
	}
}

function getFilter() {
	chrome.storage.sync.get(function(items) {
		console.log(items);
		if (items.add == true)
			$("#add").addClass("checked");
		if (items.apps == true)
			$("#apps").addClass("checked");
		if (items.link == true)
			$("#link").addClass("checked");
		if (items.vkclean == true)
			$("#vkclean").addClass("checked");
		if (items.short_link == true)
			$("#short_link").addClass("checked");
		if (items.repost == true)
			$("#repost").addClass("checked");
	})
}

function getText() {
	chrome.storage.sync.get("text", function(items) {
		console.log(items);
		var list = JSON.parse(items.text);
		for (var i = 0, j = list.length; i < j; i++) {
			$(".text-block").append(
				$("<li/>", {
					"text": list[i],
					"id": i
				}).prepend(
					$("<span/>").click(function() {
						_this = $(this).parent()
						var text = _this.text();
						var i = _this.attr("id");
						list.splice(i, 1);
						console.log(list);
						chrome.storage.sync.set({
							"text": JSON.stringify(list)
						}, function() {
							_this.slideUp(500);
						});
					})
				)
			);
		}
	})
}
