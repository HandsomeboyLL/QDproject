console.log("加载成功");
//引入所有的模块
//配置路径
require.config({
  paths: {
    jquery: "./jquery-1.10.1.min",
    "jquery-cookie": "./jquery.cookie",
    shoppingCar: "./shoppingCar",
    parabola:"./parabola"
  },
  shim: {
    //设置依赖关系
    "jquery-cookie": ["jquery"],
    parabola: {
      exports: "_",
    },
  },
});

//调用模块
require(["shoppingCar"], function (shoppingCar) {
    shoppingCar.shopCar();
});