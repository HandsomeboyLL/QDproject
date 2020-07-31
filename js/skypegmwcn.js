define(["jquery"], function ($) {
    function sky() {
$(function () {
    var aBtns = $("#play").find("ol li");
    var oUl = $("#play").find("ul");
    var iNow = 0; //用于代表显示的图片的下标
    var timer = null;

    aBtns.click(function () {
        iNow = $(this).index();
        tab();
    })
    //自动轮播
    timer = setInterval(function () {
        iNow++;
        tab();
    }, 2000);

    $("#play").mouseenter(function () {
        clearInterval(timer);
    }).mouseleave(function () {
        timer = setInterval(function () {
            iNow++;
            tab();
        }, 2000);
    })
    function tab() {
        aBtns.removeClass("active").eq(iNow).addClass("active");
        if (iNow == aBtns.size()) {
            aBtns.eq(0).addClass("active");
        }
        oUl.animate({ top: iNow * -580 }, 500, function () {
            if (iNow == aBtns.size()) {
                iNow = 0;
                oUl.css("top", 0);
            }
        });
    }

})
}
return {
    sky: sky,
};
});  