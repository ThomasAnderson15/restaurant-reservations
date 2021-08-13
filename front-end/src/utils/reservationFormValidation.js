export const formatNumber = (number) => {
    let r = /(\D+)/g, first3 ="", next3 = "", last4 = "";
    let num = number.replace(r, "");

    if (num.length > 0) {
        first3 = num.substr(0,3);
        next3 = num.substr(3, 3);
        last4 = num.substr(6,4);
        if(num.length > 6){
            num = first3 + "-" + next3 + "-" + last4;
        } else if(num.length > 3) {
            num = first3 + "-" + next3;
        } else if(num.length < 4) {
            num = first3;
        }
    }
    return num;
}

