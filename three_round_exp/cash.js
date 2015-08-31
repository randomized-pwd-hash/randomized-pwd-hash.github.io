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
            hashed_pwd = str(hashed_pwd);
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
       //return need to select predicate now
    }

    //note that for selectPredicates, n = 3
    function selectPredicates(pwd){



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

    return module;

}());
