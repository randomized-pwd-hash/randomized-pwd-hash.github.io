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
            account_created = true;
            return true;
        }

    }

    function login(){
        if (!account_created){
            //return some error message
            alert("Account already created!\n");
            return false;
        }
        else{
            if (PWDHASH == pwdhash()){
                alert("Login Successful!\n");
                return true;
            }
            else{
                alert("Incorrect password\n");
                return false;
            }
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

    module.changebutton = function(){
        document.getElementById("account").innerHTML = "Login";
        return;
    }

    module.protocol = function(){
        if (!create_account()){
            //execute login protocol
            login();
        }
        else{
            //do create account display stuff
            document.getElementById("account").innerHTML = "Login";

        }

    }

    //console.log(typeof(module.dummy));

    return module;

}());

