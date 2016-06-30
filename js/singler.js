/*!
 * Singler - a jQuery Single-page website plugin 1.0
 *
 * Copyright 2014, PHPJabbers.com (http://www.phpjabbers.com/free-jquery-single-page-website-script/)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * 
 * Date: Thu Feb 13 09:28:41 2014 +0200
 */
(function ($, undefined) {
	var PROP_NAME = 'singler',
    	FALSE = false,
    	TRUE = true;
	
	function Singler() {
		this._defaults = {
			duration: 1000,
			easing: "swing", //linear, swing
			complete: null
		};
	}
	
	$.extend(Singler.prototype, {
		_attachSingler: function (target, settings) {
			
			if (this._getInst(target)) {
                return FALSE;
            }
            var $target = $(target),
                self = this,
                inst = self._newInst($target),
                height = inst.container.outerHeight(),
                top = inst.container.offset().top,
                $a_list = inst.container.find("a"),
                scrollHeight;

            $.extend(inst.settings, self._defaults, settings);

            $(window).on("resize.singler", function (e) {
                height = inst.container.outerHeight()
        	}).on("scroll.singler", function (e) {
            	var dt = $(document).scrollTop();
            	$a_list.each(function (i, el) {
            		if ($("#" + this.getAttribute("href").replace('#', '')).offset().top + height *2 > dt) {
            			
            			inst.container.find("a").removeClass("active");
            			$(this).addClass("active");
            			
            			return false;
            		}
            	});

				if ($(window).scrollTop() - top > 0) {
            		inst.container.closest("nav").css({
            			"position": "fixed",
            			"top": 0,
            			"width": "100%"
            		});
            	} else {
            		inst.container.closest("nav").css({
            			"position": "static"
            		});
            	}
            });
            
            inst.container.on("click.singler", "a", function (e) {
				if (e && e.preventDefault) {
					e.preventDefault();
				}
				
				var scrollTop,
					sectionTop = $("#" + this.getAttribute("href").replace('#', '')).offset().top,
					top = inst.container.position().top;
				
				if ($(window).scrollTop() - top > 0) {
					scrollTop = sectionTop - height;
				} else {
					scrollTop = sectionTop - height * 2;
				}
				
				$("html, body").stop().animate({
					"scrollTop": scrollTop
				}, inst.settings.duration, inst.settings.easing, function () {
					if (inst.settings.complete && typeof inst.settings.complete === "function") {
						inst.settings.complete.call(null, this);
					}
				});
				
				return false;
			})
            

			$.data(target, PROP_NAME, inst);
		},
		_destroySingler: function (target) {
			var inst = this._getInst(target);
			if (!inst) {
				return FALSE;
			}
			
			inst.container.off(".singler");
			$(window).off(".singler");
			
			$.data(target, PROP_NAME, FALSE);
		},
		_optionSingler: function(target, opt) {
			var inst = this._getInst(target);
            if (!inst) {
                return FALSE;
            }
            if (typeof opt === "string") {
                if (arguments[2]) {
                    inst.settings[opt] = arguments[2];
                } else {
                    return inst.settings[opt];
                }
            } else if (typeof opt === "object") {
                $.extend(inst.settings, opt);
            }
            $.data(target, PROP_NAME, inst);
        },
		_newInst: function(target) {
			return {
				container: target,
				uid: Math.floor(Math.random() * 99999999),
				settings: {}
			};
		},
        _getInst: function(target) {
            try {
                return $.data(target, PROP_NAME);
            } catch (err) {
                throw 'Missing instance data for this singler';
            }
        },
	});
	
	$.fn.singler = function (options) {
		var otherArgs = Array.prototype.slice.call(arguments, 1);
        if (typeof options == 'string' && options == 'isDisabled') {
            return $.singler['_' + options + 'Singler'].apply($.singler, [this[0]].concat(otherArgs));
        }

        if (options == 'option' && arguments.length == 2 && typeof arguments[1] == 'string') {
            return $.singler['_' + options + 'Singler'].apply($.singler, [this[0]].concat(otherArgs));
        }

        return this.each(function() {
            typeof options == 'string' ? $.singler['_' + options + 'Singler'].apply($.singler, [this].concat(otherArgs)) : $.singler._attachSingler(this, options);
        });
	};
	
	$.singler = new Singler();
	$.singler.version = "1.0";
	
})(jQuery);