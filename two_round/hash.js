var hash = (function(){

    var module = {};
    var DET_ROUNDS = 1000000;
    //for epsilon = ln(2)
    var PROB1 = 0.67;
    var PROB2 = 0.33;
    var alpha = 1.33;
    var ROUNDS = Math.round(DET_ROUNDS/alpha);

    var PWDHASH;

    user_pred = function(){ return;} //initializing user predicate function

    var account_created; //boolean that says whether the account has been created or not

    function pred1(hashval) return (hashval%2);

    function pred2(hashval) return ((hashval+1)%2);

    function pwdhash(){
        var password = document.getElementById("pwd").value;
        var hashed_pwd = str_md5(password);
        for (k=1;k<ROUNDS;k++){
            hashed_pwd = str_md5(hashed_pwd);
        }
        console.log(hashed_pwd);
        return hashed_pwd;
    }

    function selectPredicate(pwd){
        return;
    }

    function create_account(){

        account_created = (typeof(PWDHASH) === 'undefined');

        if (!account_created){
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

        if (PWDHASH == pwdhash()){
            alert("Login Successful!\n");
            return true;
        }
        else{
            alert("Incorrect password\n");
            return false;
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

