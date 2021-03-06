"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Disable_Signature_Per_Post = function () {
	function Disable_Signature_Per_Post() {
		_classCallCheck(this, Disable_Signature_Per_Post);
	}

	_createClass(Disable_Signature_Per_Post, null, [{
		key: "init",
		value: function init() {
			this.PLUGIN_ID = "disable_signature_per_post";
			this.PLUGIN_KEY = "pd_disable_signature_per_post";

			this.route = pb.data("route").name;
			this.thread_check = yootil.location.thread() || yootil.location.recent_posts() || yootil.location.search_results();

			$(this.ready.bind(this));
		}
	}, {
		key: "ready",
		value: function ready() {
			var _this = this;

			if (yootil.location.posting() || yootil.location.editing()) {
				this.create_signature_option();
			}

			if (this.thread_check) {
				yootil.event.after_search(function () {
					return _this.hide_signatures.bind(_this)();
				});
				this.hide_signatures();
			}
		}
	}, {
		key: "create_signature_option",
		value: function create_signature_option() {
			var post_data = this.get_post_data();
			var form_id = pb.data("form_id");
			var $post_button = $("#" + form_id + "_post_button");
			var $post_button_parent = $post_button.parent();
			var $form = $("#" + form_id);

			if ($post_button_parent.length == 1) {
				var $option = $("<span class='signature-disabled-per-post-option'><input type='checkbox' value='1' name='disable-signature' /> Disable Signature</span>");
				var $input = $option.find("input:first");

				if (post_data == 1) {
					$input.prop("checked", true);
				}

				$post_button_parent.prepend($option);
				$form.on("submit", this.set_on.bind(this, $input));
			}
		}
	}, {
		key: "get_post_data",
		value: function get_post_data() {
			var data = 0;

			if (pb.data("page").post && parseInt(pb.data("page").post.id, 10) > 0) {
				var post_id = parseInt(pb.data("page").post.id, 10);

				data = yootil.key.value(this.PLUGIN_KEY, post_id) || 0;
			}

			return data;
		}
	}, {
		key: "get_hook",
		value: function get_hook() {
			var hook = null;

			if (this.route == "new_post" || this.route == "quote_posts") {
				hook = "post_new";
			} else if (this.route == "new_thread") {
				hook = "thread_new";
			} else if (this.route == "edit_thread") {
				hook = "thread_edit";
			} else if (this.route == "edit_post") {
				hook = "post_edit";
			}

			return hook;
		}
	}, {
		key: "set_on",
		value: function set_on($option) {
			var hook = this.get_hook();

			if (hook) {
				console.log($option);
				console.log($option.prop("checked") ? 1 : 0);
				yootil.key.set_on(this.PLUGIN_KEY, $option.prop("checked") ? 1 : 0, null, hook);
			}
		}
	}, {
		key: "hide_signatures",
		value: function hide_signatures() {
			var post_ids = proboards.plugin.keys.data[this.PLUGIN_KEY];

			for (var key in post_ids) {
				if (parseInt(post_ids[key], 10) === 1) {
					var $post = $("#post-" + parseInt(key, 10));

					if ($post.length == 1) {
						$post.find(".signature").hide();
					}
				}
			}
		}
	}]);

	return Disable_Signature_Per_Post;
}();


Disable_Signature_Per_Post.init();