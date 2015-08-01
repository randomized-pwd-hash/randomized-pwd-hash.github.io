var hash = (function(){

    var module = {};

    function dummy(){
        console.log("hellooo\n");
    };

    //controller methods
    module.dummy = function (){
        dummy();
        return;
    };

    //console.log(typeof(module.dummy));

    return module;

}());

console.log(typeof(hash.dummy));
