var hash = (function(){

    var module = {};

    function dummy(){
        console.log("hellooo\n");
    }

    //controller methods
    module.dummy = function (){
        console.log("Ran dummy\n");
        return;
    }

    return module;

}());
