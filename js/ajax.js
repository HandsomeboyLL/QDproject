export {
    $ajax,
    $get,
    $post,
    antiShake
}


//函数防抖
function antiShake(func, delay){
    var timer = null;
    return function(...argus){
        clearTimeout(timer);
        if(timer == null){
            func.apply(this, argus);
            timer = "调用一次";
        }else{
            timer = setTimeout(() => {
                func.apply(this, argus);
            }, delay);
        }
    }
}
/**
 * @param {object} requestObject
 * method
 * url
 * data
 * success
 * error
 */
function $ajax(){
    var a1 = new Ajax(...arguments);
    a1.init();
    a1.ajax();
}

function $get(){
    
    var argus = Object.assign({"method": "get"}, ...arguments);
    
    var a1 = new Ajax(argus);
    a1.init();
    a1.ajax();
}

function $post(){
    var argus = Object.assign({"method": "post"}, ...arguments);
    var a1 = new Ajax(argus);
    a1.init();
    a1.ajax();
}

class Ajax{
    constructor({method = 'get', url, data, success, error}){
        this.method = method;
        this.url = url;
        this.data = data;
        this.success = success;
        this.error = error;
    }
    //初始化
    init(){
        var xhr = null;
        try{
            xhr = new XMLHttpRequest();
        }catch(error){
            console.log(error);
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        return xhr;
    }
    ajax(){
        //1、生成ajax对象
        var xhr = this.init();

        //2、判断是否有数据存在
        var querystring = "";
        if(this.data){
            //转成querystring
            querystring = this.querystring(this.data);
        }
        if(this.method == "get"){
            xhr.open(this.method, this.url + "?" + querystring, true);
            xhr.send();
        }else{
            xhr.open(this.method, this.url, true);
            //设置请求访问头
            xhr.setRequestHeader('content-type', "application/x-www-form-urlencoded");
            xhr.send(querystring);
        }
        
        
        xhr.onreadystatechange = () => {
            if(xhr.readyState == 4){
                //直接把处理数据结果写死了
                // if(xhr.status == 200){
                //     success && success(xhr.responseText);
                // }else{
                //     error && error("error:" + xhr.status);
                // }

                xhr.status == 200 ? this.success && this.success(xhr.responseText) : this.error && this.error("error:" + xhr.status);
                
            }
        }
    }
    querystring(dataObj){
        var str = '';
        for(var attr in dataObj){
            str += `${attr}=${dataObj[attr]}&`;
        }
        return str.substring(0, str.length - 1);

    }

}




/*
    dataObj
    {
        username: xxx,
        password: yyy,
        age: 888
    }
*/