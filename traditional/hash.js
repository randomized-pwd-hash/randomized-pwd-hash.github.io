var hash = (function(){

    var module = {};

    function dummy(){
        console.log("hellooo\n");
    }

    function pwdhash(){
        var password = "password";
        var hashed_pwd = str_md5(password);
        console.log(hashed_pwd);
    }

    //controller methods
    module.dummy = function (){
        dummy();
        return;
    }

    module.pwdhash = function(){
        pwdhash();
        return;
    }

    //console.log(typeof(module.dummy));

    return module;

}());

console.log(typeof(hash.pwdhash));
