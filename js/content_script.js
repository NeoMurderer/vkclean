clearInterval(interval);
var filter = ["далее", "доступно", "история", "источник", "нажми", "начать", "перейти", "подписаться", "подробнее", "показать", "полностью", "посмотреть", "продолжение", "реальная", "результат", "смотреть", "узнать", "читать", "ответ"];
var id = [];
var item = [];
var load = true;
Add();
$.ajax({
	async: false,
	dataType: 'json',
	url: 'http://vkclean.com/filter.json',
	success: function(data) {
		filter = data;
	}
});
var interval = window.setInterval(function() {

	Add();
}, 2000)

	function removeAdd(filters) {
		console.log("removeAdd");
		for (i = 0, j = filters.length; i < j; i++) {
			for (k = 0, length = item.length; k < length; k++) {
				if (item[k].indexOf(filters[i]) > -1) {
					$("#" + id[k]).css("display", "none").addClass("deleted").parent().addClass("deleted");
					console.log("deleteFilter", item[k]);
					id.splice(k, 1);
					item.splice(k, 1);
					k--;
					length--;
				}
			}
		}
	}

	function prover(filter, text) {
		var k = 0;
		var itm;
		var j = text.length;
		var rus = ["а", "в", "с", "е", "д", "н", "і", "к", "т", "п", "о", "р", "т", "и", "х"];
		var eng = ["a", "b", "c", "e", "g", "h", "i", "k", "m", "n", "o", "p", "t", "u", "x"];
		for (var i = 0; i < j; i++) {
			var engl = in_array(eng, text[i]);
			if (engl > -1) {
				itm = rus[engl];

			} else
				itm = text[i];
			if (filter[k] === itm) {
				k++;
			} else {
				k = 0;
			}
			if (k >= filter.length) {
				return true;
			}
		}

		return false;
	}

	function clean() {
		console.log("clean");
		for (i = 0, j = filter.length; i < j; i++) {
			for (k = 0, length = item.length; k < length; k++) {
				if (prover(filter[i], item[k])) {

					$("#" + id[k]).css("display", "none").addClass("deleted").parent().addClass("deleted");
					console.log("deleteClean", item[k]);
					id.splice(k, 1);
					item.splice(k, 1);
					k--;
					length--;
				} else {
					//console.log(item[k]+"!="+filter[i]);
				}
			}
		}
	}

	function in_array(array, val) {
		var sovpad = [];
		for (var i = 0, l = array.length; i < l; i++) {
			if (array[i] == val) {
				sovpad[sovpad.length] = i;
			}
		}
		if (sovpad.length > 0)
			return sovpad;
		return -1;
	}

	function Add() {
		chrome.storage.sync.get(function(items) {
			if (items.link == true) {
				var block = $(".post:not(.deleted)").find(".wall_post_text a:not(.wall_post_more),.wall_text .media_desc span:not(.wall_postlink_preview_btn_label)").toArray();
				for (var i = block.length - 1; i >= 0; i--) {
					var link = block[i].innerText.replace(/[^a-zA-Zа-я-А-ЯёЁ0-9]/g, '').toLowerCase();
					var num = in_array(id, $(block[i]).closest(".post").attr("id"));
					var k = 0;
					for (var j = 0; j <= num.length; j++) {
						if (item[num[j]] == link && items.update == false) {
							k = 1;
							break;
						}
					}
					if (k == 0) {
						if (link != "") {
							load = true;
							item[item.length] = link;
							id[id.length] = $(block[i]).closest(".post").attr("id");
						}

					}
				};
				if (items.vkclean == true && (items.update == true || load == true)) {
					clean();
				}
				if (items.text && (items.update == true || load == true))
					list = JSON.parse(items.text);
				else {
					return false;
				}
				chrome.storage.sync.set({
					update: false
				})
				load = false;


				for (i = 0, j = list.length; i < j; i++) {
					list[i] = list[i].replace(/[^a-zA-Zа-я-А-ЯёЁ0-9]/g, '').toLowerCase();
				}
				removeAdd(list);
			}
			if (items.add == true) {
				$("#left_ads").css("display", "none")
			}
			if (items.apps == true) {
				$(".wall_post_source_default").closest(".post").css("display", "none").addClass("deleted").parent().addClass("deleted");
			}
			if (items.short_link == true) {
				$(".wall_post_text a:not(.wall_post_more):contains('vk.cc')").closest(".post").css("display", "none").addClass("deleted").parent().addClass("deleted");
			}
			if (items.repost == true) {
				$("#main_feed .published_by_date,#main_feed .group_share").css("display", "none").addClass("deleted").parent().addClass("deleted");
			}
		})
	}
