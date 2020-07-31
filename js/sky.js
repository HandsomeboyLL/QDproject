console.log("加载成功");
//引入所有的模块
//配置路径
require.config({
  paths: {
    jquery: "./jquery-1.10.1.min",
    skypegmwcn: "skypegmwcn",
  },
  shim: {
    //设置依赖关系
  },
});

//调用模块
require(["skypegmwcn"], function (skypegmwcn) {
    skypegmwcn.sky();
});
