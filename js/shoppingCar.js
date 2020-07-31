define(["jquery", "jquery-cookie","parabola"], function ($) {
    function shopCar() {
$(function () {
    console.log(1);
    sc_num();
    sc_msg();

    //通过ajax加载数据
    $.ajax({
        url: "./data/data.json",
        // dataType: "json",  如果不传入，默认是自动检测
        success: function (arr) {
            console.log(arr);
            var str = ``;
            for(var i = 0; i < arr.length; i++){

                //创建节点添加到页面上的，写法一、
                str += ` <li class="goods_item">
                    <div class="goods_pic">
                        <img src="${arr[i].img}"
                            alt="">
                    </div>
                    <div class="goods_title">
                        <p>${arr[i].name}<span>${arr[i].price}</span></p>
                    </div>
                    <div class="sc">
                        <div id="${arr[i].id}" class="sc_btn">加入购物车</div>
                    </div>
                </li>`;
            }
            $(".goods_box ul").html(str);
        },
        error: function (msg) {
            console.log(msg);
        }
    })


    //给购物车按钮添加点击  事件委托
    $(".goods_box ul").on("click", ".sc_btn", function(){
        //当前加入购物车按钮所在商品的id  id num;
        // alert(this.id);  存储在cookie
        var id = this.id;
        //1、判断是否是第一次添加
        var first = $.cookie("goods") == null ? true : false;
        if(first){
            var arr = [{id:id, num:1}];
            $.cookie("goods", JSON.stringify(arr), {
                expires: 7
            })
        }else{
            //2、判断之前是否添加过
            var cookieArr = JSON.parse($.cookie("goods"));
            var index = cookieArr.findIndex(item => item.id == id);
            if(index >= 0){
                cookieArr[index].num++;
            }else{
                cookieArr.push({id:id, num:1});
            }

            $.cookie("goods", JSON.stringify(cookieArr), {
                expires: 7
            })
        }

        sc_num();
        sc_msg();
        ballMove(this);
    })


    //计算购物车中商品总数
    function sc_num(){
        var cookieStr = $.cookie("goods");
        if(!cookieStr){
            $(".sc_right .sc_num").html(0);
        }else{
            var cookieArr = JSON.parse(cookieStr);
            var sum = 0;
            for(var i = 0; i < cookieArr.length; i++){
                sum += cookieArr[i].num;
            }
            $(".sc_right .sc_num").html(sum);
        }
    }

    //加载右侧的购物车列表
    //cookie 只存储id和num，商品数据服务器上
    //再去下载数据，从数据中筛选已经加入购物车的数据。
    function sc_msg(){
        $.ajax({
            url: "./data/data.json",
            success: function(arr){
                var cookieStr = $.cookie("goods");
                if(cookieStr){
                    var cookieArr = JSON.parse(cookieStr);
                    var newArr = []; //符合条件数据
                    for(var i = 0; i < arr.length; i++){
                        for(var j = 0; j < cookieArr.length; j++){
                            if(arr[i].id == cookieArr[j].id){
                                arr[i].num = cookieArr[j].num;
                                newArr.push(arr[i]);
                                break;
                            }
                        }
                    }
                    // console.log(newArr); 购物车显示的数据
                    var str = ``;
                    for(var i = 0; i < newArr.length; i++){
                        str += `<li id="${newArr[i].id}">
                            <div class="sc_goodsPic">
                                <img src="${newArr[i].img}" alt="">
                            </div>
                            <div class="sc_goodsTitle">
                                <p>${newArr[i].name}<span>${newArr[i].price}</span></p>
                            </div>
                            <div class="sc_goodsBtn">购买</div>
                            <div class="delete_goodsBtn">删除</div>
                            <div class="sc_goodsNum">
                                <button>+</button>
                                <span>商品数量：${newArr[i].num}</span>
                                <button>-</button>
                            </div>
                        </li>
                        `
                    }
                    $(".sc_right ul").html(str);
                }
            },
            error: function(msg){
                console.log(msg);
            }
        })
    }


    //给右侧购物车的按钮添加删除功能
    $(".sc_right ul").on("click", ".delete_goodsBtn", function(){
        var id = $(this).closest("li").remove().attr("id");
        console.log(id);
        //在cookie中删除这个数据
        var cookieArr = JSON.parse($.cookie("goods"));
        cookieArr = cookieArr.filter(item => item.id != id);
        
        cookieArr.length ? $.cookie("goods", JSON.stringify(cookieArr), {expires: 7}) : $.cookie("goods", null);
        sc_num();
    })

    //给右侧购物车的+和-按钮添加点击
    $(".sc_right ul").on("click", ".sc_goodsNum button", function(){
        var id = $(this).closest("li").attr("id");
        //找到cookie中的商品
        var cookieArr = JSON.parse($.cookie("goods"));
        var res = cookieArr.find(item => item.id == id);
    
        if(this.innerHTML == "+"){
            res.num++;
        }else{
            res.num == 1 ? alert("数量为1，不能减少") : res.num--;
        }
        $(this).siblings("span").html(`商品数量：${res.num}`);

        $.cookie("goods", JSON.stringify(cookieArr), {
            expires: 7
        })

        sc_num();
    })

    //右侧购物车添加移入和移出
    $(".sc_right").mouseenter(function(){
        //习惯性的在调用animate方法之前，去调用一下stop()
        $(this).stop(true).animate({right: 0}, 500);
    }).mouseleave(function(){
        $(this).stop(true).animate({right: -270}, 500);
    })
    $(".sc_right").mouseenter(function(){
        //习惯性的在调用animate方法之前，去调用一下stop()
        $(".sc_pic").stop(true).animate({right: 270}, 500);
    }).mouseleave(function(){
        $(".sc_pic").stop(true).animate({right: 0}, 500);
    })

    

    //清空购物车按钮
    $("#clearCar").click(function(){
        //清空购物车
        //1、清空cookie
        $.cookie("goods", null);
        //2、清空页面
        // $(".sc_right ul").html("");
        $(".sc_right ul").empty();
        sc_num();
    })

    //进行抛物线运动的函数
    function ballMove(oBtn){
        $("#ball").show().css({
            left: $(oBtn).offset().left,
            top: $(oBtn).offset().top
        })

        var X = $(".sc_right .sc_pic").offset().left - $(oBtn).offset().left;
        var Y = $(".sc_right .sc_pic").offset().top - $(oBtn).offset().top;

        var bool = new Parabola({
            el: "#ball",
            offset: [X, Y],
            duration: 800,
            curvature: 0.001,
            callback: function(){
                $("#ball").hide();
            }
        });
        bool.start();
    }


})
}
return {
    shopCar: shopCar,
};
});