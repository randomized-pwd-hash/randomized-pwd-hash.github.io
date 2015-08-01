var hash = (function(){

    var module = {};

    function dummy(){
        console.log("hellooo\n");
    }

        var password = 'abcdefg';
        var PasswordHash = require('phpass').PasswordHash;
        var passwordHash = new PasswordHash();
        var hashed_pwd = passwordHash.hashPassword(password);
        console.log(hashed_pwd);

    function pwdhash(){
        var password = 'abcdefg';
        var PasswordHash = require('phpass').PasswordHash;
        var passwordHash = new PasswordHash();
        var hashed_pwd = passwordHash.hashPassword(password);
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
