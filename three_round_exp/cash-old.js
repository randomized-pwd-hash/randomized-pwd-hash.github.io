var cash = (function(){

    var module = {};
    var DET_ROUNDS = 10000;
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
        var hashed_pwd = SHA256.hash(password);//str_md5(password);
        for (k=1;k<ROUNDS;k++){
            hashed_pwd = SHA256.hash(password);//str_md5(hashed_pwd);
        }
        console.log(hashed_pwd);console.log("\n");
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
        console.log("running reproduce\n");
        //need to locate account index
        var value = findClientRecord(a);
        if (value == -1){
            alert("Account does not exist!\n");
            return;
        }
        var predicates = value[0];
        var salt = value[1];
        //predicates is now a sequence of predicates
        var H = pwdhash(pwd+salt);
        for (m=0;m<2;m++){
            if (predicates[m](H)){
                return H;
            }
            H = pwdhash(H+salt);
        }
        console.log(H);
        console.log("hello\n");
        return H;
    }

    function genSalt(a){
        var rbits = Math.round(100000*Math.random());
        var rbitstring = rbits.toString();
        var x = a + rbitstring;
        var s = str_md5(x);
        return s;
    }

    function createAccount(pwd,a){
        //generate salt
        var s = genSalt(a);
        var predicates = selectPredicates(pwd + s);
        var key = a;
        var value = [predicates,s]; //and salt
        //storing values on client (or on dropbox)
        user_accountlist.push(key);
        user_predlist.push(value);
        //no need to generate hash with this sample website
        return;
    }

    function getNewAccount(){
        var clientform = document.getElementById("clientform");
        return clientform.elements["accountname"].value;
    }

    function getPwd(){
        var clientform = document.getElementById("clientform");
        return clientform.elements["pwd"].value;
    }

    function addAccount(accountname){
        var selectform = document.getElementById("selectAccount");
        var option = document.createElement("option");
        option.text = accountname;
        selectform.add(option);
        return;
    }

    function getExistingAccount(){
        var selectform = document.getElementById("selectAccount");
        var accountIndex = selectform.selectedIndex;
        return user_accountlist[accountIndex];
    }

    //controller methods

    module.createAccount = function(){
        //getting account name
        var accountname = getNewAccount();
        if (findClientRecord(accountname) != -1){
            alert("Account already exists!");
            return;
        }
        //get pwd, run the create account protocol.
        var pwd = getPwd();
        createAccount(pwd,accountname);
        alert("Account for " + accountname + " has been created!");
        //need to update list of accounts
        addAccount(accountname);
        return;
    }

    module.generateHash = function(){
        var accountname = getExistingAccount();
        console.log("accountname is " + accountname + "\n");
        var pwd = getPwd();
        console.log("pwd is " + pwd + "\n");
        //get pwd, run the generateHash procedure
        var pwdhash = reproduce(pwd,accountname);
        //display hash in text box
        console.log(document.getElementById('hash').innerHTML);
        document.getElementById("hash").innerHTML = pwdhash;
    }

    module.debug = function(){
        var clientform = document.getElementById("clientform");
        var accountname = clientform.elements["accountname"].value;
        console.log("accountname is " + accountname + "\n");
        var pwd = clientform.elements["pwd"].value;
        console.log("pwd is " + pwd + "\n");
        return;
    }

    module.pwdhash = function(){
        var pwd = getPwd();
        var hash = SHA256.hash(pwd);
        console.log(hash);
        console.log('\n');
        return hash;
    }

    return module;

}());
