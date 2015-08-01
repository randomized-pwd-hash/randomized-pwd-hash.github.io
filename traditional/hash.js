var hash = (function(){

    var module = {};

    function dummy(){
        console.log("hellooo\n");
    }

    //controller methods
    module.dummy = function (){
        dummy();
        return;
    }

    typeof(module.dummy);

    return module;

}());
