var cash = (function(){

    var module = {};
    var DET_ROUNDS = 1000000;
    //for epsilon = 1.2
    var W = 5.302;
    var PROB1 = 0.566;
    var PROB2 = 0.207;
    var PROB3 = 0.227;
    var alpha = PROB1 + 2*PROB2 + 3*PROB3;
    var ROUNDS = Math.round(DET_ROUNDS/alpha);

    var PWDHASH;

    var user_accountlist = [];

    var user_predlist = []; //list of user predicate sequences by account

    function pred(hashval,i){
        var last_char_val = hashval.charCodeAt(hashval.length-1);
        return (last_char_val%3 == i);
    }

    function generateOutputSpace(){
        var ospace = [];
        for (i=0;i<3;i++){
            for (j=0;j<3;j++){
                ospace.push([i,j]);
            }
        }
        return ospace;
    }

    var ospace = generateOutputSpace();

    function pwdhash(password){
        var hashed_pwd = str_md5(password);
        for (k=1;k<ROUNDS;k++){
            hashed_pwd = str_md5(hashed_pwd);
        }
        return hashed_pwd;
    }

    function computeStoppingTimes(pwd){
        var S1 = [];
        var S2 = [];
        var S3 = [];
        for (i=0;i<ospace.length;i++){
            //need to calculate stopping time
            var pred1 = function(hashval){ return pred(hashval,ospace[i][0]);};
            var pred2 = function(hashval){ return pred(hashval,ospace[i][1]);};
            //calculation
            var H = pwdhash(pwd);
            if (pred1(H)){
                S1.push(ospace[i]);
            }else if (pred2(pwdhash(H))){
                S2.push(ospace[i]);
            }else{
                S3.push(ospace[i]);
            }
        }
        if (S1.length != 3 || S2.length != 2 || S3.length != 4){
            console.log("Error in computeStoppingTimes!!\n");
        }
        //need to pick stopping time
        var stop1_num = Math.round(100*PROB1);
        var stop2_num = Math.round(100*PROB2);
        var stop3_num = Math.round(100*PROB3);

        var stop_select = [];

        for (i=0;i<stop1_num;i++){
            stop_select.push(1);
        }
        for (i=0;i<stop2_num;i++){
            stop_select.push(2);
        }
        for (i=0;i<stop3_num;i++){
            stop_select.push(3);
        }

        var index = Math.round(Math.random()*stop_select.length);
        var stoptime = stop_select[index];
        if (stoptime == 1){
            return S1;
        } else if (stoptime == 2){
            return S2;
        } else {
            return S3;
        }
    }

    //note that for selectPredicates, n = 3
    function selectPredicates(pwd){
        var S = computeStoppingTimes(pwd);
        var index = Math.round(Math.random()*S.length);
        var upred1 = function(hashval){ return pred(hashval,S[index][0])};
        var upred2 = function(hashval){ return pred(hashval,S[index][1])};
        return [upred1,upred2];
    }

    function findClientRecord(a){
        for (i=0;i<user_accountlist.length;i++){
            if (user_accountlist[i] == a){
                return user_predlist[i];
            }
        }
        return -1;
    }

    //computing user hash
    function reproduce(pwd,a){
        //need to locate account index
        var value = findClientRecord(a);
        if (value == -1){
            alert("Account does not exist!\n");
            return;
        }
        //value is now a sequence of predicates
        var H = pwdhash(pwd);
        for (m=0;m<2;m++){
            if (value[m](H)){
                return H;
            }
            H = pwdhash(H);
        }
        console.log(H);
        return H;
    }

    function createAccount(pwd,a){
        //generate salt
        var predicates = selectPredicates(pwd);
        var key = a;
        var value = predicates; //and salt
        //storing values on client (or on dropbox)
        user_accountlist.push(key);
        user_predlist.push(value);
        //no need to generate hash with this sample website
        return;
    }


    //controller methods

    module.createAccount = function(){
        //getting account name
        var accountname = document.getElementById("accountname");
        if (findClientRecord(accountname) != -1){
            alert("Account already exists!");
            return;
        }
        //get pwd, run the create account protocol.
        var pwd = document.getElementById("pwd");
        createAccount(pwd,accountname);
        alert("Account for " + accountname + " has been created!");
        return;
    }

    module.generateHash = function(){
        var accountname = document.getElementById("accountname");
        //get pwd, run the generateHash procedure
        var pwd = document.getElementById("pwd");
        var pwdhash = reproduce(pwd,accountname);
        //display hash in text box
        console.log(document.getElementById('hash'));
        document.getElementById("hash").innerHTML = pwdhash;
    }

    return module;

}());
