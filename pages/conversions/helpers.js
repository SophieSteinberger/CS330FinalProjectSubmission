//retry clean tasty data
export function cleanTastyDataResponse2(dataObj){
    let recipeNamesList = [];
    let recipeList = [];
    //iterate thru recipes
    for (let i of dataObj){
        if (!(i.name in recipeNamesList)) {
            let tempRecipe = {};
            //recipe NAME prop
            tempRecipe.recipe_name = i.name;
            //collect instructions
            let instructionsArr = [];
            for (let a = 0; a < i.instructions.length; a++){
                //console.log();
                instructionsArr.push(i.instructions[a].display_text);
            }
            tempRecipe.instructions = instructionsArr;
            tempRecipe.recipe_by = i.credits[0].name;

            //collect ingredients
            let ings = [];
            //iterate thru all the ingredients in recipe
            for (let s = 0; s < i.sections.length; s++){
                for (let b = 0; b < i.sections[s].components.length; b++){
                    let tempIng = {};
                    tempIng.recipe_name = tempRecipe.recipe_name;
                    tempIng.ingredient_name = i.sections[s].components[b].ingredient.name;
                    tempIng.descriptors = (i.sections[s].components[b].extra_comment);
        
                    let amtObj = {};
                    let units;
                    //iterate thru array of quantities, create an object with key = units of measurement and the value being the quantity
                    for (let e = 0; e < i.sections[s].components[b].measurements.length; e++){
                        let numParts = i.sections[s].components[b].measurements[e].quantity.split(" ");
                        //console.log(tempIng.ingredient_name);
                        //console.log(numParts);
        
                        units = i.sections[s].components[b].measurements[e].unit.name;
                        amtObj[units] = processTastyAmounts(numParts);
                    }
        
                    if (("teaspoon" in amtObj) || ("cup" in amtObj) || ("tablespoon" in amtObj)){
                        if ("teaspoon" in amtObj) {
                            tempIng.tsp = amtObj["teaspoon"];
                        }
                        if ("tablespoon" in amtObj) {
                            tempIng.tbs = amtObj["tablespoon"];
                        }
                        if ("cup" in amtObj){
                            tempIng.cups = amtObj["cup"];
                        }   
                    } else if (("pound" in amtObj) || ("ounce" in amtObj)){
                        if("pound" in amtObj){
                            tempIng.lbs = amtObj["pound"];
                        }
                        if ("ounce" in amtObj){
                            tempIng.oz = amtObj["ounce"];
                        }
                    } else if ("gram" in amtObj){
                        tempIng.grams = amtObj["gram"];
                    } else {
                        let unitKeys = Object.keys(amtObj);
                        tempIng.items = amtObj[unitKeys[0]];
                        tempIng.misc_unit = unitKeys[0];
                    }
                    ings.push(tempIng);
                }
            }
            tempRecipe.ingredients = ings;
            recipeNamesList.push(tempRecipe.recipe_name);
            recipeList.push(tempRecipe);
        }
    }
    return recipeList;
}

export function processTastyAmounts(numArr){
    let num;
    if (numArr.length == 1){
        switch (numArr[0]){
            case "¾":
                num = "0.75";
                break;
            case "⅔":
                num = "0.66";
                break;
            case "½":
                num = "0.50";
                break;
            case "⅓":
                num = "0.33";
                break;
            case "¼":
                num = "0.25";
                break;
            default:
                num = numArr[0];
        }
    } else {
        //manage the two parts
        switch (numArr[1]){
            case "¾":
                num = numArr[0] + ".75";
                break;
            case "⅔":
                num = numArr[0] + ".66";
                break;
            case "½":
                num = numArr[0] + ".50";
                break;
            case "⅓":
                num = numArr[0] + ".33";
                break;
            case "¼":
                num = numArr[0] + ".25";
                break;
            default:
                num = numArr[0];
        }
    }
    return num;    
}


//for displaying cup and tsp values in prefilled form 
//takes a decimal number and makes it into separate values for the whole number and the fraction
export function prepItemEdit(itm){
    console.log(itm);
    if (itm != null){
        let i = itm.toString();
        const fraction = i.substring(i.indexOf("."));
        const wholeNum = i.substring(0, i.indexOf("."));
        if (fraction == ".00") {
            return([wholeNum, ""]);
        }
        return([wholeNum, ("0" + fraction)]);
    } else {
        return (["", ""]);
    }
    
}

//makes formatted ingredient objects to be made into insert queries (form data -->objects with correct properties)
export function prepRecipeIngredientsForDB(dataObj, numIngredients){
    let itemObjs = [];

    for (let i = 0; i <= numIngredients; i++){
        if (("item_name"+i) in dataObj) {
            if (dataObj["item_name"+i] != ""){
                let tempObj = {
                    recipe_name: dataObj.recipe_name,
                };
                tempObj.ingredient_name = dataObj["item_name"+i];
                tempObj.descriptors = dataObj["descriptors"+i];
        
                if (dataObj['units'+i] == "cupsTbsTsp"){
                    if (dataObj['wholeCups' + i] != "" && dataObj["partialCups" + i] != ""){
                        tempObj.cups = (parseFloat(dataObj['wholeCups' + i]) + parseFloat(dataObj["partialCups" + i])).toString();
                    } else if (dataObj['wholeCups' + i] != "") {
                        tempObj.cups = dataObj['wholeCups' + i];
                    } else if (dataObj["partialCups" + i]){
                        tempObj.cups = dataObj["partialCups" + i];
                    }
                    
                    if (dataObj["wholeTsp" + i] != "" && dataObj["partialTsp" + i] != ""){
                        tempObj.tsp = (parseFloat(dataObj.wholeTsp) + parseFloat(dataObj["partialTsp" + i])).toString();
                    } else if (dataObj["wholeTsp" + i] != "") {
                        tempObj.tsp = dataObj["wholeTsp" + i];
                    } else if (dataObj["partialTsp" + i] != ""){
                        tempObj.tsp = dataObj["partialTsp" + i];
                    }
                    
                    if (dataObj["tbs" + i] != "") {
                        tempObj.tbs = dataObj["tbs"+i];
                    }
        
                } else if (dataObj["units"+i] == "lbsOz"){
                    if (dataObj["oz"+i] != "") {
                        tempObj.oz = dataObj["oz"+i];
                    }
                    if (dataObj["lbs"+i] != ""){
                        tempObj.lbs = dataObj["lbs"+i];
                    }
                } else if (dataObj["units"+i] == "grams"){
                    tempObj.grams = dataObj["grams"+i];
                } else {
                    tempObj.items = dataObj["items"+i];
                }
                itemObjs.push(tempObj);
            }
        }
    }

    return itemObjs;   
}


export function prepTastyRecForDB(rec, whichDB){
    let inst = "";
    let addQs = [];
    let ingAddBase = "";

    if (whichDB == "p"){
        ingAddBase = "INSERT INTO in_progress (";
    } else {
        ingAddBase = "INSERT INTO recipe_ingredients (";
    }

    for (let i of rec.instructions){
        inst += "XXXX" + i;
    }

    let nts = "";
    if ("notes" in rec){
        for (let n of rec.notes) {
            nts += "XXXX" + n;
        }
    }

    let firstQ;
    if (whichDB == "p"){
        firstQ = "INSERT INTO in_progress_info (recipe_name, recipe_by, instructions, notes, is_fav) VALUES ('" + rec.recipe_name + "', '" + rec.recipe_by + "', '" + inst + "', '" + nts + "', '0')";
    } else {
        firstQ = "INSERT INTO recipe_info (recipe_name, recipe_by, instructions, notes, is_fav) VALUES ('" + rec.recipe_name + "', '" + rec.recipe_by + "', '" + inst + "', '" + nts + "', '0')";
    }
    
    addQs.push(firstQ);

    for (let ing of rec.ingredients){
        let tempIng = ing;
        delete tempIng.quantity;
        let tempQ = ingAddBase;
        let cols = "";
        let vals = "";
        for (let p in tempIng){
            cols += p + ", ";
            if (tempIng[p] == null || tempIng[p] == 'null'){
                vals += null + ", ";
            } else {
                vals += "'" + tempIng[p] + "', ";
            }
        }
        cols = cols.substring(0, cols.length -2);
        vals = vals.substring(0, vals.length -2);

        tempQ += cols + ") VALUES (" + vals + ")";
        addQs.push(tempQ);
    }
    return addQs;
}

//makes an array of INSERT queries for saved recipes
export function makeInputQueries(ingredientsArr){
    const qryArr = [];

    for (let x of ingredientsArr){
        //make into query
        let cols = "";
        let vals = "";
        for (let j in x){
            cols += j.toString() + ", ";
            if (x[j] == null || x[j] == 'null') {
                vals += null + ", ";
            } else {
                vals += "'" + x[j] + "', ";
            }   
        }
        //remove the last comma
        cols = cols.substring(0, cols.length -2);
        vals = vals.substring(0, vals.length -2);
        let qry = "INSERT INTO recipe_ingredients (" + cols + ") VALUES (" + vals + ")";
        qryArr.push(qry);
    
    }
    return qryArr;
}

//makes UPDATE and DELETE queries for recipe ingredients
export function makeIngredientUpdateQs(updateVals, oldVals1, delList){
    //hopefully to take out when figure out where trues are coming from
    let oldVals = oldVals1;
    for (let j of oldVals){
        for (let w in j){
            if (j[w] == true){
                j[w] = null;
            }
        }
    }
    console.log(oldVals);
    //end to delete section

    const rName = oldVals[0].recipe_name;
    let toUpdate = [];
    let delArr = [];
    for (let x = 0; x < oldVals.length; x++){
        let item = oldVals[x];
        delete item.quantity;
        delete item.recipe_name;
        if (delList.includes(item.ingredient_name)){
            let qry = "DELETE FROM recipe_ingredients WHERE recipe_name = '" + rName + "' AND ingredient_name = '" + item.ingredient_name + "'";
            delArr.push(qry);
        } else {
            let tempObj = {
                ingredient_name: item.ingredient_name,
            };
            for (let i in item){
                if (i in updateVals[x]){
                    if (item[i] != updateVals[x][i]){
                        tempObj[i] = updateVals[x][i];
                    }
                } else {
                    if (item[i] =! null){
                        tempObj[i] = null;
                    }
                }
            }
            toUpdate.push(tempObj);
        }
    }
    //Make to update into array of queries
    let updateQueries = [];
    for (let o of toUpdate){
        let iName;
        let q = "UPDATE recipe_ingredients SET ";
        //go through properties to change
        for(let p in o){
            if(p == "ingredient_name"){
                iName = o[p];
            } else {
                if (o[p] == null){
                    q += p + " = " + o[p] + ", ";
                } else {
                    q += p + " = '" + o[p] + "', ";
                }
            }
        }
        //trim off trailing "', "
        q = q.substring(0, q.length-2);
        q += " WHERE recipe_name = '" + rName + "' AND ingredient_name = '" + iName + "'";
        updateQueries.push(q);
        //console.log(q);
    }
    return [updateQueries, delArr];
}

//Process notes and instructions from a recipe input form (prop values --> one string with all notes and one string with all instructions with a separator between)
//returns a query to insert the notes and instructions into the DB
export function processNotesAndInstructions(dataObj, instCount, nCount){
    
    if (dataObj.recipe_name != ""){
        let nts = "";
        let inst = "";
    
        for (let x = 0; x <= instCount; x++){
            if(("instruction"+x) in dataObj){
                if (dataObj["instruction"+x] != ""){
                    inst += "XXXX" + dataObj["instruction"+x];
                } 
            }
            
        }
    
        for (let i = 0; i <= nCount; i++){
            if (("note"+i) in dataObj){
                if (dataObj["note"+i] != "" ){
                    nts += "XXXX" + dataObj["note"+i];
                }
            }
        }
    
        const qry = "INSERT INTO recipe_info (recipe_name, instructions, notes) VALUES ('" + dataObj.recipe_name + "', '" + inst + "', '" + nts + "')";
        return qry;
    }

}


//similar function as above function but returns an UPDATE query
export function processNotesAndInstForUpdate(dataObj){
    const instCount = dataObj.inst_count;
    const nCount = dataObj.note_count;
    //console.log(dataObj.recipe_name);
    //console.log(dataObj.inst_count);

    if (dataObj.recipe_name != ""){
        let nts = "";
        let inst = "";
    
        for (let x = 0; x <= instCount; x++){
            if(("instruction"+x) in dataObj){
                if (dataObj["instruction"+x] != ""){
                    inst += "XXXX" + dataObj["instruction"+x];
                } 
            }
            
        }
    
        for (let i = 0; i <= nCount; i++){
            if (("note"+i) in dataObj){
                if (dataObj["note"+i] != "" ){
                    nts += "XXXX" + dataObj["note"+i];
                }
            }
        }

        const qry = "UPDATE recipe_info SET instructions = '" + inst + "', notes = '" + nts + "' WHERE recipe_name = '" + dataObj.recipe_name + "'";
        return (qry);
    } else {
        return null;
    }

}

//check if there have been any changes to the notes or instructions after edit form has been used
export function compareNotesAndInst(instList, notesList, newData){
    if ((newData.inst_count == instList.length) && (newData.note_count == notesList.length)){
        for (let x = 0; x < newData.inst_count ; x++){
            if(("instruction"+x) in newData){
                if (newData["instruction"+x] != instList[x]){
                    return true;
                } 
            }
        }
        
        for (let i = 0; i < newData.note_count ; i++){
        //console.log(newData["note"+i]);
        //console.log(notesList[i]);
            if(("note"+i) in newData){
                if (newData["note"+i] != notesList[i]){
                    return true;
                } 
            }
        }
        return false;
    } else {
        return true;
    }


}

//for user ingredients page
export function prepDataForDB(dataObj){
    if (dataObj.units == "cupsTbsTsp"){
        if (dataObj.wholeCups != "" && dataObj.partialCups != ""){
            dataObj.cups = (parseFloat(dataObj.wholeCups) + parseFloat(dataObj.partialCups)).toString();
        } else if (dataObj.wholeCups != "") {
            dataObj.cups = dataObj.wholeCups;
        } else if (dataObj.partialCups != ""){
            dataObj.cups = dataObj.partialCups;
        }
        delete dataObj.wholeCups;
        delete dataObj.partialCups;
        if (dataObj.wholeTsp != "" && dataObj.partialTsp != ""){
            dataObj.tsp = (parseFloat(dataObj.wholeTsp) + parseFloat(dataObj.partialTsp)).toString();
        } else if (dataObj.wholeTsp != "") {
            dataObj.tsp = dataObj.wholeTsp;
        } else if (dataObj.partialTsp != ""){
            dataObj.tsp = dataObj.partialTsp;
        }
        delete dataObj.wholeTsp;
        delete dataObj.partialTsp;
        if (dataObj.tbs == "") {
            delete dataObj.tbs;
        }
    } else if (dataObj.units == "lbsOz"){
        if (dataObj.oz == "") {
            delete dataObj.oz;
        }
        if (dataObj.lbs == ""){
            delete dataObj.lbs;
        }
    }
    console.log(dataObj);
    delete dataObj.units;
    return(dataObj);
}

//create SQL query to insert an item into the table of the user's own items
export function createInsertQuery(dataObj){
    //make into query
    let cols = "";
    let vals = "";
    for (let i in dataObj){
        cols += i.toString() + ", ";
        vals += "'" + dataObj[i].toString() + "', ";
    }
     //remove the last comma
    cols = cols.substring(0, cols.length -2);
    vals = vals.substring(0, vals.length -2);
    const qry = "INSERT INTO my_pantry (" + cols + ") VALUES (" + vals + ")";
    return qry;
}