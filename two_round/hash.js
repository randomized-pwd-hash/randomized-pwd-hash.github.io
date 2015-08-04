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

    function pred1(hashval){
        var last_char_value = hashval.charCodeAt(-1);
        console.log("pred1\n");
        console.log(last_char_value);
        return (last_char_value%2 == 1);
    }

    function pred0(hashval){
        var last_char_value = hashval.charCodeAt(-1);
        console.log("pred0\n");
        console.log(last_char_value);
        return (last_char_value%2 == 0);
    }


    function pwdhash(password){
        //var password = document.getElementById("pwd").value;
        var hashed_pwd = str_md5(password);
        for (k=1;k<ROUNDS;k++){
            hashed_pwd = str_md5(hashed_pwd);
        }
        //console.log(hashed_pwd);
        return hashed_pwd;
    }

    function selectPredicate(password){
        var pred_select = [];
        var pred1_num = Math.round(100*PROB1);
        var pred0_num = Math.round(100*PROB2);
        var pwd_hash = pwdhash(password);
        var pred1_tag = pred1(pwd_hash);
        var pred0_tag = pred0(pwd_hash);

        for (i=0;i<pred1_num;i++){
            pred_select.push(pred1_tag);
        }
        for (j=0;j<pred0_num;j++){
            pred_select.push(pred0_tag);
        }
        var index = Math.round(Math.random()*pred_select.length);
        if (pred_select[index]){
            user_pred = function(hashval){ return pred1(hashval);};
            console.log("Pred1 selected!\n");
        }
        else{
            user_pred = function(hashval){ return pred0(hashval);};
            console.log("Pred0 selected!\n");
        }

    }

    function create_account(){

        account_created = (typeof(PWDHASH) === 'undefined');

        if (!account_created){
            //return some error message
            return false;

        }
        else{
            var password = document.getElementById("pwd").value;
            selectPredicate(password);
            var hashval = pwdhash(password);
            if (user_pred(hashval)){
                PWDHASH = hashval;
            }
            else{
                PWDHASH = pwdhash(hashval);
            }
            account_created = true;
            return true;
        }

    }

    function login(){

        var password = document.getElementById("pwd").value;
        var hashval = pwdhash(password);
        if (!user_pred(hashval)){
            hashval = pwdhash(hashval);
            console.log("hashing twice\n");
        }
        if (hashval == PWDHASH){
            alert("Login Successful!\n");
            return true;
        }
        else{
            alert("Incorrect Password.\n");
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
        if (account_created){
            //execute login protocol
            login();
        }
        else{
            create_account();
            //do create account display stuff
            document.getElementById("account").innerHTML = "Login";

        }

    }

    //console.log(typeof(module.dummy));

    return module;

}());

