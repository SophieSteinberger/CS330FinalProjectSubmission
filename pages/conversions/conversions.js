export function parseItemsToShow(ingredients){
    const parsedIngs = ingredients.map((i) => {
        let quantity = "";
        if (i.hasOwnProperty('exp_date')){
            i.exp_date = i.exp_date.substring(0, 10);
            console.log(i.item_name + " "+ i.exp_date);
        }
        if ("cups" in i && i.cups != null){
            quantity += processPartial(i.cups) + "c";
        }
        if (i.cups != null && (i.tbs != null || i.tsp != null)) {
            quantity += ", ";
        }
        if (i.tbs != null) {
            quantity += i.tbs + "tbs";
        }
        if (i.tbs != null && i.tsp != null ){
            quantity += ", ";
        }
        if (i.tsp != null) {
            quantity += processPartial(i.tsp) + "tsp";
        }
        if (i.lbs != null) {
            if (i.lbs == "1"){
                quantity = processIngredientDecimal(i.lbs) + "lb ";
            } else{
                quantity = processIngredientDecimal(i.lbs) + "lbs ";
            }
        }
        if (i.oz != null) {
            quantity += processIngredientDecimal(i.oz)  + "oz";
        }
        if (i.grams != null) {
            quantity = processIngredientDecimal(i.grams) + " grams";
        }
        if (i.items != null) {
            quantity = processPartial(i.items);
            if (quantity == 0){
                quantity = "";
            }
            if (i.misc_unit != null){
                quantity += " " + i.misc_unit; 
            }
        }
        i.quantity = quantity;


        return(i);
    });

    return (parsedIngs);
}

//convert cups and tbs (+tsp) to tsp
export function toTsp(c, tb, ts){
    let totalTsp = 0;

    if (c != null){
        //1c = 48tsp
        totalTsp += (parseFloat(c) * 48);
    }
    if (tb != null){
        totalTsp += (parseFloat(tb) * 3);
    }
    if (ts != null){
        totalTsp += parseFloat(ts);
    }

    return totalTsp;
}

export function toOz(l, o){
    let totalOz = 0;
    if (l != null){
        totalOz += (parseFloat(l) * 16);
    }
    if (o != null){
        totalOz += parseFloat(o);
    }
    return totalOz;
}


//make all into tsp and then divide to get cups tbs and tsp
export function scaleCupsTbsTsp(c, tb, ts, v){
    let cupsW;
    let cupsP;
    let tB;
    let tSW;
    let tSP;
    let tspLeft;
    let totalTsp = 0;


    if (c != null){
        //1c = 48tsp
        totalTsp += (parseFloat(c) * 48);
    }
    if (tb != null){
        totalTsp += (parseFloat(tb) * 3);
    }
    if (ts != null){
        totalTsp += parseFloat(ts);
    }
    const scaledTotal = totalTsp * v;
    tSP = scaledTotal - Math.floor(scaledTotal);
    tspLeft = Math.floor(scaledTotal);
    //get full cups
    cupsW = (tspLeft - (tspLeft % 48)) / 48;
    tspLeft = tspLeft % 48;

    //partial cups
    if (tspLeft/36 >= 1){
        cupsP = 0.75;
        tspLeft = tspLeft - 36;
    } else if (tspLeft/32 >= 1){
        cupsP = 0.66;
        tspLeft = tspLeft - 32;
    } else if (tspLeft/24 >= 1){
        cupsP = 0.50;
        tspLeft = tspLeft - 24;
    } else if (tspLeft/16 >= 1){
        cupsP = 0.33;
        tspLeft = tspLeft - 16;
    } else if (tspLeft/12 >= 1){
        cupsP = 0.25;
        tspLeft = tspLeft - 12;
    } else {
        cupsP = 0;
    }

    //get tablespoons
    tB = (tspLeft - (tspLeft % 3)) / 3;
    tspLeft = tspLeft % 3;
    tSW = tspLeft;

    return {
        whole_cups : cupsW,
        partial_cups : cupsP,
        tbs : tB,
        whole_tsp: tSW,
        partial_tsp : parseFloat(tSP.toFixed(2)),
    };
}

export function scaleLbsOz(l, o, v){
    //make to ounces --> scale
    let totalOz = 0;
    let pounds;
    let ounces;
    if (l != null){
        totalOz += (parseFloat(l) * 16);
    }
    if (o != null){
        totalOz += parseFloat(o);
    }
    totalOz = totalOz * v;
    pounds = (totalOz - (totalOz % 16)) / 16;
    ounces = totalOz % 16;

    return {
        lbs : parseFloat(pounds.toFixed(2)),
        oz : parseFloat(ounces.toFixed(2)),
    };
}


export function splitIntoWholeNumAndPartial(num){
    let wholeNum = Math.floor(num);
    let partialNum = num - Math.floor(num);
    return [wholeNum, partialNum];
}

export function makeObjsToScaleAndShow(ingredients, mNum){

    const parsedIngAmts = ingredients.map((i) => {
        let tempObj = {}
        let units = "";
        //Make separate quantity function that parses the amount object
        //let quantity = "";
        let amtObj;
        if ((i.cups != null) || (i.tbs != null) || (i.tsp != null)){
            units = "cupsTbsTsp";
            amtObj = scaleCupsTbsTsp(i.cups, i.tbs, i.tsp, mNum);
        } else if (i.lbs != null || i.oz != null){
            units = "lbsOz";
            amtObj = scaleLbsOz(i.lbs, i.oz, mNum);
        } else if (i.grams != null){
            units = "grams";
            amtObj = {grams: parseFloat((parseFloat(i.grams) * mNum).toFixed(2))};
        } else {
            units = "items";
            amtObj = {
                items : parseFloat((parseFloat(i.items) * mNum).toFixed(2)),
                misc_unit : i.misc_unit
            };
        }
        tempObj.units = units;
        tempObj.amt = amtObj;
        return tempObj;
    });

    return (parsedIngAmts);
}

export function parseTastyItemsToShow(ingredients){
    const parsedIngs = ingredients.map((i) => {
        let quantity = "";
        if ("cups" in i){
            quantity += processPartial(i.cups) + "c";
            if ("tbs" in i || "tsp" in i) {
                quantity += ", ";
            }
        }
        if ("tbs" in i) {
            quantity += i.tbs + "tbs";
            if ("tsp" in i){
                quantity += ", ";
            }
        }
        if ("tsp" in i) {
            quantity += processPartial(i.tsp) + "tsp";
        }
        if ("lbs" in i) {
            if (i.lbs == "1"){
                quantity = processIngredientDecimal(i.lbs) + "lb ";
            } else{
                quantity = processIngredientDecimal(i.lbs) + "lbs ";
            }
            console.log(i.quantity);
        }
        if ("oz" in i) {
            quantity += processIngredientDecimal(i.oz)  + "oz";
        }
        if ("grams" in i) {
            quantity = processIngredientDecimal(i.grams) + " grams";
        }
        if ("items" in i) {
            quantity = processPartial(i.items);
            console.log(quantity);
            if (quantity == 0){
                quantity = "";
            }
            if ("misc_unit" in i && i.misc_unit != null){
                quantity += " " + i.misc_unit; 
            }
        }
        i.quantity = quantity;


        return(i);
    });

    return (parsedIngs);
}

export function processIngredientDecimal(num){
    let processedNum = num;
    if (num.substring(num.indexOf(".")+1 == "00")){
        processedNum = num.substring(0, num.indexOf("."));
    } else if (num.substring(num.indexOf(".")+2 == "0")){
        processedNum = num.substring(0, num.indexOf(".")+2);
    }
    return processedNum;
}

export function processPartial(num) {
    //get remainder
    if (num.includes(".")){
        const fraction = num.substring(num.indexOf("."));
        const wholeNum = num.substring(0, num.indexOf("."));
        
        if (fraction == ".25") {
            if (wholeNum == "00" || wholeNum == "0"){
                return "1/4";
            } else {
                return (wholeNum + " 1/4");
            } 
        } else if (fraction == ".33"){
            if (wholeNum == "00" || wholeNum == "0"){
                return "1/3";
            } else {
                return (wholeNum + " 1/3");
            }
        } else if (fraction == ".50" || fraction == ".5"){
            if (wholeNum == "00" || wholeNum == "0"){
                return "1/2";
            } else {
                return (wholeNum + " 1/2");
            }
        } else if (fraction == ".66"){
            if (wholeNum == "00" || wholeNum == "0"){
                return "2/3";
            } else {
                return (wholeNum + " 2/3");
            }
        } else if (fraction == ".75"){
            if (wholeNum == "00" || wholeNum == "0"){
                return "3/4";
            } else {
                return (wholeNum + " 3/4");
            }
        } else {
            return (wholeNum);
        }
    } else {
        return num;
    }
   
}
