var hash = (function(){

    var hash = {};

    function dummy(){
        console.log("hellooo\n");
    }

    //controller methods
    hash.dummy = function (){
        dummy();
        return;
    }

    return hash;

}());
