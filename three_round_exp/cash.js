var cash = (function(){

    var module = {};
    var DET_ROUNDS = 1000000;
    //for epsilon = 1.2
    var PROB1 = 0.54;
    var PROB2 = 0.30;
    var PROB3 = 0.16;
    var alpha = PROB1 + 2*PROB2 + 3*PROB3;
    var ROUNDS = Math.round(DET_ROUNDS/alpha);

    var PWDHASH;

    var user_predlist = []; //list of user predicate sequences by account

    function pred(hashval,i){
        var last_char_val = hashval.charCodeAt(hashval.length-1);
        return (last_char_val%3 == i);
    }

    function pwdhash(password){
        var hashed_pwd = str_md5(password);
        for (k=1;k<ROUNDS;k++){
            hashed_pwd = str(hashed_pwd);
        }
        return hashed_pwd;
    }


}());
