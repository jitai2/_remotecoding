/******** 그룹별 가장높은  height 값으로 resize ***********/
var boxSize = function () {
    var cols = document.querySelectorAll('[data-col]'),
        encountered = []
    for (i = 0; i < cols.length; i++) {
        var attr = cols[i].getAttribute('data-col')
        if (encountered.indexOf(attr) == -1) {
            encountered.push(attr)
        }
    }
    for (set = 0; set < encountered.length; set++) {
        var col = document.querySelectorAll('[data-col="' + encountered[set] + '"]'),
            group = []
        for (i = 0; i < col.length; i++) {
            col[i].style.height = 'auto'
            group.push(col[i].scrollHeight)
        }
        for (i = 0; i < col.length; i++) {
            col[i].style.height = Math.max.apply(Math, group) + 'px'
        }
    }
}
$(function(){
    boxSize();
    $(window).resize(function(){
        boxSize();
    })
})

// gnb
$(function () {
    $(".header1 .info .dropdown").on("click",function(){
        if($(this).parents().hasClass("_active")){
            $(this).parents().removeClass("_active");
        } else {
            $(this).parents().addClass("_active");
        }
    })
})


// tab
$(function () {
    $(".tab-wrap .tab-btn ._tab").each(function(i){
        $(".tab-wrap .tab-btn ._tab").eq(i).on("click", function(){
            $(".tab-wrap .tab-btn ._tab").removeClass("_active");
            $(".tab-wrap .tab-btn ._tab").eq(i).addClass("_active");
            $(".tab-wrap .tab-con").removeClass("_active");
            $(".tab-wrap .tab-con").eq(i).addClass("_active");
        })
    })
})

// hide #back-top first
$("#back-top").hide();

// fade in #back-top
$(function () {
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('#back-top').fadeIn();
        } else {
            $('#back-top').fadeOut();
        }
    });

    // scroll body to 0px on click
    $('#back-top a').click(function () {
        $('body,html').animate({
            scrollTop: 0
        }, 800);
        return false;
    });
});

/* layer */
var Layer = {
    open : function(sid) {
        $(".layer").show();
        $(".layer ._pop-load."+ sid).show();
        var popHeight = $(".layer ._pop").outerHeight();
        $(".layer ._pop-load."+ sid).attr("data-height", popHeight);

        $("._focus").focus();
        $("body").addClass("noscroll");
        resizePop();
    },
    close : function() {
        $(".layer").hide();
        $(".layer ._pop-load").hide();
        $("body").removeClass("noscroll")
    },
    // 팝업 load 20180723 update
    load : function(load, sid) {
        $(".layer").remove();
        var html = '<div class="layer"><div class="_pop-load '+ sid +'"></div><div class="dim"></div></div>';
        $("body").append(html);
        $(".layer ._pop-load").load(load, function(){
            var popHeight = $(".layer ._pop-load").outerHeight();
            $(".layer ._pop-load").attr("data-height", popHeight);

            resizePop();
        });
        Layer.open(sid);
    },
    loadClose : function() {
        $(".layer").remove();
        $("body").removeClass("noscroll");
    }
}

function resizePop() {
    var popHeight = $(".layer ._pop-load").attr("data-height");
    var winHeight = $(window).height();

    if(winHeight < popHeight) {
        $(".layer ._pop-load").addClass("full-height");
    } else {
        $(".layer ._pop-load").removeClass("full-height");
    }
}
$(window).resize(function(){
    resizePop();
})

//20180723 update
$(function(){
    WISE.commonINIT();
})
var WISE = $;

/******************************
 * bind
 ******************************/
WISE.commonFUNCTION = function(){
    // 팝업 load
    var bind = function(){
        $("[data-action=popLoad]").unbind("click");
        $(document).on("click", "[data-action=popLoad]", function(){
            var load = $(this).attr("data-load"),
                sid = $(this).attr("data-class");
            Layer.load(load, sid);
        })


        // 팝업취소 클릭
        $("[data-action=popClose]").unbind("click");
        $(document).on("click", "[data-action=popClose]", function(){
            Layer.loadClose();
        })
    }

    bind();
}

/******************************
 * function
 ******************************/
WISE.ACTION = {

	/********************************
	 * drop-box
	 ********************************/
	dropBox : function(sid) {

		sid = sid ? sid : $(document);

		/*일반적인 dropbox*/
		$(".drop-box [data-action=click]").unbind("click").on("click", function() {

			console.log("dropbox click");

			var $dropBox = $(this).parent();
			if($dropBox.hasClass("_open")) {
				reset();
			} else {
				reset();
				$dropBox.addClass("_open");

				/*select dropbox*/
				$dropBox.find("[data-action=value]").unbind("click").on("click", function() {

					var value = $(this).attr("data-value"),
						txt = $(this).text();

					$dropBox.find("[data-type=value]").val(value);

					//console.log(value);
					$(this).addClass("_active");
					$(this).siblings().removeClass("_active");
					$dropBox.find(".drop-btn").text(txt);
					$dropBox.removeClass("_open");
				})
			}
		})

		var reset = function(){
			sid.find(".drop-box").removeClass("_open");
		}
	},

	/********************************
	 * tab controll
	 ********************************/
	tabControll : function(sid) {

		sid = sid ? sid : $(document);

		var bind = function() {
			reset();
			sid.find("[data-action=tab]").unbind("click").on("click", function() {

				console.log("탭전환")
                $(this).addClass("_active");
				$(this).siblings().removeClass("_active");

				var value = $(this).attr("data-value"),
				    $tab = $(this).parents("._tab-wrap");

				$tab.find("._tab-inner").removeClass("_active");
				$tab.find("._tab-inner.t" + value).addClass("_active");
			})

			/* 최초실행시 */
			sid.find("._tab-wrap [data-action=tab]").eq(0).click();
		}
		var reset = function() {
			sid.find("._tab-wrap ._tab-inner").removeClass("_active");
		}
		bind();
	},
}

WISE.commonINIT = function(){
    WISE.commonFUNCTION();
	WISE.ACTION.dropBox();
	WISE.ACTION.tabControll();
}

