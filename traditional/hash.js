var hash = (function(){

    var module = {};
    var ROUNDS = 10000000;

    var PWDHASH;

    var account_created; //boolean that says whether the account has been created or not

    function pwdhash(){
        var password = document.getElementById("pwd").value;
        var hashed_pwd = str_md5(password);
        for (k=1;k<ROUNDS;k++){
            hashed_pwd = str_md5(hashed_pwd);
        }
        console.log(hashed_pwd);
        return hashed_pwd;
    }

    function create_account(){

        account_created = (typeof(PWDHASH) === 'undefined');

        if (account_created){
            //return some error message
            return false;

        }
        else{
            PWDHASH = pwdhash();
            return true;
        }

    }

    function login(){
        if (!account_created){
            //return some error message
            return false;
        }
        else{
            return (PWDHASH == pwdhash());
        }
    }


    //controller methods

    module.create_account = function(){
        create_account();
        return;

    }

    module.login = function(){
        login();
        return;
    }

    module.pwdhash = function(){
        pwdhash();
        return;
    }

    //console.log(typeof(module.dummy));

    return module;

}());

