import { useState, useEffect } from "react";
import { toOz, toTsp, makeObjsToScaleAndShow, scaleCupsTbsTsp, scaleLbsOz, } from "../conversions/conversions";
import { QuantityInputArea } from "./updateitemform";
import styles  from  '../../styles/componentstyles/Scaler.module.css';

export function ScalableIngredient({ ingInfo, amtObj }){

    useEffect( () => {
        //console.log("in quantity section");

    }, []);

    //if a standard measuring amount return string to display amount as a fraction, otherwise return a decimal rounded to two places
    function prepForDisplay(num){
        if (parseFloat(num.toFixed(2)) == 0.75){
            return "3/4";
        } else if (parseFloat(num.toFixed(2)) == 0.67){
            return "2/3";
        } else if (parseFloat(num.toFixed(2)) == 0.50){
            return "1/2";
        } else if (parseFloat(num.toFixed(2)) == 0.33){
            return "1/3";
        } else if (parseFloat(num.toFixed(2)) == 0.25){
            return "1/4";
        } else {
            return num.toFixed(2).substring(-3);
        }
    }

    //return different li format based on units
    if (amtObj.units == "cupsTbsTsp"){
        let tspsValsAsOne;
        if ((amtObj.amt.whole_tsp > 0)&&(amtObj.amt.partial_tsp > 0)){
            if (prepForDisplay(amtObj.amt.partial_tsp).includes(".")){
                tspsValsAsOne = (parseFloat(prepForDisplay(amtObj.amt.partial_tsp)) + amtObj.amt.whole_tsp).toFixed(2);
            } else{
                tspsValsAsOne = amtObj.amt.whole_tsp + " " + prepForDisplay(amtObj.amt.partial_tsp);
            }
        } else if (amtObj.amt.whole_tsp > 0) {
            tspsValsAsOne = amtObj.amt.whole_tsp;
        } else if (amtObj.amt.partial_tsp > 0){
            tspsValsAsOne = prepForDisplay(amtObj.amt.partial_tsp);
        }
        
        return (
            <li>{(amtObj.amt.whole_cups > 0) ? <span className={styles.adjNum}>{amtObj.amt.whole_cups}</span> : null} {(amtObj.amt.partial_cups > 0) ? <span className={styles.adjNum}>{prepForDisplay(amtObj.amt.partial_cups)}</span> : null} {((amtObj.amt.partial_cups > 0) && (amtObj.amt.whole_cups > 0)) ? " " : null}{((amtObj.amt.partial_cups > 0)|| (amtObj.amt.whole_cups > 0)) ? "cups" : null}{((amtObj.amt.partial_cups > 0)|| (amtObj.amt.whole_cups > 0)) && ((amtObj.amt.tbs > 0) || (amtObj.amt.partial_tsp > 0)|| (amtObj.amt.whole_tsp > 0)) ? ",    " : null} {(amtObj.amt.tbs > 0) ? <span className={styles.adjNum}>{amtObj.amt.tbs}</span> : null} {(amtObj.amt.tbs > 0) ? "tbs" : null} {(amtObj.amt.tbs > 0) && ((amtObj.amt.partial_tsp > 0)|| (amtObj.amt.whole_tsp > 0)) ? ",   " : null} {((amtObj.amt.whole_tsp > 0) || (amtObj.amt.partial_tsp > 0)) ? <span className={styles.adjNum}>{tspsValsAsOne}</span> : null} {((amtObj.amt.whole_tsp > 0)||(amtObj.amt.partial_tsp > 0)) ? "tsp" : null}   {ingInfo.ingredient_name}{ingInfo.descriptors != "" ? ", " + ingInfo.descriptors : null}</li>
           /*  <>
           {((amtObj.amt.partial_tsp > 0) && (amtObj.amt.whole_tsp > 0)) ? "+" : null}
           /*  <>
                <li>{(wholeCups > 0) ? wholeCups : null} {(partialCups > 0) ? prepForDisplay(partialCups) : null} {((partialCups > 0) && (wholeCups > 0)) ? " " : null}  {((partialCups > 0)|| (wholeCups > 0)) ? "c" : null} {((partialCups > 0)|| (wholeCups > 0)) && ((tbs > 0) || (partialTsp > 0)|| (wholeTsp > 0)) ? ",  " : null} {(tbs > 0) ? tbs + "tbs" : null} {(tbs > 0) && ((partialTsp > 0)|| (wholeTsp > 0)) ? ",  " : null}  {(wholeTsp > 0) ? wholeTsp : null} {((partialTsp > 0) && (wholeTsp > 0)) ? " " : null} {(partialTsp > 0) ? prepForDisplay(partialTsp) : null} {((partialTsp > 0)|| (wholeTsp > 0)) ? "tsp  " : null}  {ingInfo.ingredient_name} {ingInfo.descriptors != "" ? ", " + ingInfo.descriptors : null}</li>
            </> */
        );
    } else if (amtObj.units == "lbsOz"){
        return (
            <>
                <li>{(amtObj.amt.lbs > 0) ? <span className={styles.adjNum}>{amtObj.amt.lbs}</span> + "lbs" : null} {((amtObj.amt.lbs > 0) && (amtObj.amt.oz > 0)) ? ",  " : null}  {(amtObj.amt.oz > 0) ? <span className={styles.adjNum}>{amtObj.amt.oz}</span> + "oz " : null}  {ingInfo.ingredient_name} {ingInfo.descriptors != "" ? ",  " + ingInfo.descriptors : null}</li>
            </>
        );
    } else if (amtObj.units == "grams"){
        return <li>{(amtObj.amt.grams > 0) ? <span className={styles.adjNum}>{amtObj.amt.grams}</span> + " grams  " : null} {ingInfo.ingredient_name} {ingInfo.descriptors != "" ? ",  " + ingInfo.descriptors : null}</li>;
    } else {
        return <li>{(amtObj.amt.items > 0) ? <span className={styles.adjNum}>{amtObj.amt.items}</span> : null} {ingInfo.misc_unit != null ? "  " + ingInfo.misc_unit : null}  {ingInfo.ingredient_name} {ingInfo.descriptors != "" ? ",  " + ingInfo.descriptors : null}</li>;
    }
}



export function ScalableIngredientExpanded({ ingInfo, amtObj, isSelected, id, onSel, handleCancel, handleSetScale}){
     useEffect( () => {
 
     }, []);
     
     function handleSelect(e){
        onSel(e, id);
     }
     
    //if a standard measuring amount return string to display amount as a fraction, otherwise return a decimal rounded to two places
     function prepForDisplay(num){
         if (parseFloat(num.toFixed(2)) == 0.75){
             return "3/4";
         } else if (parseFloat(num.toFixed(2)) == 0.67){
             return "2/3";
         } else if (parseFloat(num.toFixed(2)) == 0.50 || parseFloat(num.toFixed(2)) == 0.5){
             return "1/2";
         } else if (parseFloat(num.toFixed(2)) == 0.33){
             return "1/3";
         } else if (parseFloat(num.toFixed(2)) == 0.25){
             return "1/4";
         } else {
             return num.toFixed(2).substring(-3);
         }
     }

     //return different li format based on units
     if (amtObj.units == "cupsTbsTsp"){
        if (isSelected){
            return (    
               <li>{ingInfo.ingredient_name}{ingInfo.descriptors != "" ? ", " + ingInfo.descriptors : null} <form onSubmit={handleSetScale}><QuantityInputArea unitType={amtObj.units} itmInfo={amtObj} />    <button className={styles.generalBtnSm} type="button" onClick={(e) => handleCancel(e)}>Cancel</button><button className={styles.generalBtnSm} type="submit" >Scale</button></form></li>
            );
        } else{
            let tspsValsAsOne;
            if ((amtObj.amt.whole_tsp > 0)&&(amtObj.amt.partial_tsp > 0)){
                if (prepForDisplay(amtObj.amt.partial_tsp).includes(".")){
                    tspsValsAsOne = (parseFloat(prepForDisplay(amtObj.amt.partial_tsp)) + amtObj.amt.whole_tsp).toFixed(2);
                } else{
                    tspsValsAsOne = amtObj.amt.whole_tsp + " " + prepForDisplay(amtObj.amt.partial_tsp);
                }
            } else if (amtObj.amt.whole_tsp > 0) {
                tspsValsAsOne = amtObj.amt.whole_tsp;
            } else if (amtObj.amt.partial_tsp > 0){
                tspsValsAsOne = prepForDisplay(amtObj.amt.partial_tsp);
            }
            
            return (
                <li id={id} onClick={(e) => handleSelect(e, id)}><span className="scale-by-ing">{(amtObj.amt.whole_cups > 0) ? <span className={styles.adjNum}>{amtObj.amt.whole_cups}</span>: null} {(amtObj.amt.partial_cups > 0) ? <span className={styles.adjNum}>{prepForDisplay(amtObj.amt.partial_cups)}</span> : null}</span> {((amtObj.amt.partial_cups > 0) && (amtObj.amt.whole_cups > 0)) ? "  " : null}{((amtObj.amt.partial_cups > 0)|| (amtObj.amt.whole_cups > 0)) ? "cups" : null}{((amtObj.amt.partial_cups > 0)|| (amtObj.amt.whole_cups > 0)) && ((amtObj.amt.tbs > 0) || (amtObj.amt.partial_tsp > 0)|| (amtObj.amt.whole_tsp > 0)) ? ",   " : null} <span className="scale-by-ing">{(amtObj.amt.tbs > 0) ? <span className={styles.adjNum}>{amtObj.amt.tbs}</span> : null}</span> {(amtObj.amt.tbs > 0) ? "tbs" : null} {(amtObj.amt.tbs > 0) && ((amtObj.amt.partial_tsp > 0)|| (amtObj.amt.whole_tsp > 0)) ? ",   " : null}  <span className="scale-by-ing">{((amtObj.amt.whole_tsp > 0) || (amtObj.amt.partial_tsp > 0)) ? <span className={styles.adjNum}>{tspsValsAsOne}</span> : null}</span> {((amtObj.amt.whole_tsp > 0)||(amtObj.amt.partial_tsp > 0)) ? "tsp" : null}   {ingInfo.ingredient_name}{ingInfo.descriptors != "" ? ", " + ingInfo.descriptors : null}</li>
        );}
         
     } else if (amtObj.units == "lbsOz"){
        if (isSelected){
            return (
                <li>{ingInfo.ingredient_name}{ingInfo.descriptors != "" ? ", " + ingInfo.descriptors : null} <form onSubmit={handleSetScale}><QuantityInputArea unitType={amtObj.units} itmInfo={amtObj} />  <button className={styles.generalBtnSm} type="button" onClick={(e) => handleCancel(e)}>Cancel</button><button className={styles.generalBtnSm} type="submit" >Scale</button></form></li>
            );
        } else{
            return (
                <>
                    <li id={id} onClick={(e) => onSel(e, id)}><span className="scale-by-ing">{(amtObj.amt.lbs > 0) ? <span className={styles.adjNum}>{amtObj.amt.lbs}</span> : null}</span>{(amtObj.amt.lbs > 0) ? "lbs" : null} {((amtObj.amt.lbs > 0) && (amtObj.amt.oz > 0)) ? ",  " : null}  <span className="scale-by-ing">{(amtObj.amt.oz > 0) ? <span className={styles.adjNum}>{amtObj.amt.oz}</span> : null}</span>{(amtObj.amt.oz > 0) ? "oz" : null}  {ingInfo.ingredient_name} {ingInfo.descriptors != "" ? ", " + ingInfo.descriptors : null}</li>
                </>
            );
        }
     } else if (amtObj.units == "grams"){
        if (isSelected){
            return (
                <li>{ingInfo.ingredient_name}{ingInfo.descriptors != "" ? ", " + ingInfo.descriptors : null} <form onSubmit={handleSetScale}><QuantityInputArea unitType={amtObj.units} itmInfo={amtObj} />  <button className={styles.generalBtnSm} type="button" onClick={(e) => handleCancel(e)}>Cancel</button><button className={styles.generalBtnSm} type="submit">Scale</button></form></li>
            );
        } else{
            return <li id={id} onClick={(e) => onSel(e, id)}><span className="scale-by-ing">{(amtObj.amt.grams > 0) ? <span className={styles.adjNum}>{amtObj.amt.grams}</span> : null}</span>{(amtObj.amt.grams > 0) ? " grams  " : null} {ingInfo.ingredient_name} {ingInfo.descriptors != "" ? ", " + ingInfo.descriptors : null}</li>;
        }
     } else {
            if (isSelected){
                return (
                    <li>{ingInfo.ingredient_name}{ingInfo.descriptors != "" ? ", " + ingInfo.descriptors : null} <form onSubmit={handleSetScale}><QuantityInputArea unitType={amtObj.units} itmInfo={amtObj} />  <button className={styles.generalBtnSm} type="button" onClick={(e) => handleCancel(e)}>Cancel</button><button className={styles.generalBtnSm} type="submit">Scale</button></form></li>
                );
            } else{
                return <li id={id} onClick={(e) => onSel(e, id)}><span className="scale-by-ing">{(amtObj.amt.items > 0) ? <span className={styles.adjNum}>{amtObj.amt.items}</span> : null}</span>{(amtObj.amt.items > 0) ? " " : null} {ingInfo.misc_unit != null ? ingInfo.misc_unit : null}  {ingInfo.ingredient_name} {ingInfo.descriptors != "" ? ", " + ingInfo.descriptors : null}</li>;
            }
     }
 }

export function ScalableRecipe({ amtsArr, ingObjs, handleSave }){
    const [ogAmtObjs, setOgAmtObjs] = useState([...amtsArr]);
    const [currentAmts, setCurrentAmts] = useState([...amtsArr]);
    const [scaleBy, setScaleBy] = useState(1);
    const [isSel, setIsSel] = useState(null);
    const [okToSel, setOkToSel] = useState(true);
    const [inProcess, setInProcess] = useState(false);

    useEffect(() => {
        console.log("working in scalable recipe");
    }, [isSel]);

    //make sure that only one ingredient can be selected to set the proportion by which the recipe is scaled
    function handleIngSel(e, idx){
        console.log(e.target);
        let recIdx = idx;
        //console.log(recIdx);
        if (okToSel){
            setIsSel(recIdx);
            console.log(recIdx);
            setOkToSel((okToSel) => !okToSel);
        }
    }

    //process/prep the scaled values to put in correct form for database entry
    function processAdjVal(obj, units){
        if (units == "cupsTbsTsp") {
            let cups = 0;
            let tbs = 0;
            let tsp = 0;
            if (obj.wholeCups != ""){
                cups += parseFloat(obj.wholeCups);
            }
            if (obj.partialCups != ""){
                cups += parseFloat(obj.partialCups);
            }
            if (obj.tbs != ""){
                tbs += parseFloat(obj.tbs);
            }
            if (obj.wholeTsp != ""){
                tsp += parseFloat(obj.wholeTsp);
            }
            if (obj.partialTsp != ""){
                tsp += parseFloat(obj.partialTsp);
            }
            return {
                cups : cups,
                tbs : tbs,
                tsp : tsp,
            };
        } else if (units == "lbsOz"){
            let l = 0;
            let o = 0;
            if (obj.lbs != ""){
                l = parseFloat(obj.lbs);
            }
            if (obj.oz != ""){
                o = parseFloat(obj.oz);
            }
            return {
                lbs : l,
                oz : o,
            };
        } else if (units == "grams"){
            return {grams: parseFloat(obj.grams)};
        } else {
            return {items : parseFloat(obj.items)};
        }
    }

    //calculate the amount to scale all ingredients by using an adjusted amount of one ingredient
    function determineMultiplier(formJson){
        let oldAmt;
        let newAmt = processAdjVal(formJson, ogAmtObjs[isSel].units);
        let multiplier;
        if (ogAmtObjs[isSel].units == "cupsTbsTsp"){
            oldAmt = toTsp((ogAmtObjs[isSel].amt.whole_cups + ogAmtObjs[isSel].amt.partial_cups), ogAmtObjs[isSel].amt.tbs, (ogAmtObjs[isSel].amt.whole_tsp + ogAmtObjs[isSel].amt.partial_tsp));
            multiplier = toTsp(newAmt.cups, newAmt.tbs, newAmt.tsp) / oldAmt;
        } else if (ogAmtObjs[isSel].units == "lbsOz"){
            oldAmt = toOz(ogAmtObjs[isSel].amt.lbs, ogAmtObjs[isSel].amt.oz);
            multiplier = toOz(newAmt[0], newAmt[1]) / oldAmt;
        } else if (ogAmtObjs[isSel].units == "grams"){
            oldAmt = ogAmtObjs[isSel].amt.grams;
            multiplier = newAmt.grams / oldAmt;
        } else {
            oldAmt = ogAmtObjs[isSel].amt.items;
            multiplier = newAmt.items / oldAmt;
            //console.log(multiplier);
        }
        return multiplier;
    }

    //initiate the scaling of all ingredients based on the submitted new value of one
    function handleSetSelection(e){
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        //as a plain object:
        const formJson = Object.fromEntries(formData.entries());
        setInProcess((inProcess) => !inProcess);
        //console.log(formJson);
        const multiplier = determineMultiplier(formJson);
        setScaleBy(multiplier);
        //actually reset the numbers
        makeScaledAmounts(multiplier);
    }

    //scale all ingredients in recipe, updating their objects holding current values
    function makeScaledAmounts(newVal){
        setScaleBy(newVal);
        setCurrentAmts(ogAmtObjs.map((obj, idx) => {
            if (obj.units == "cupsTbsTsp") {
                return {
                    ...obj,
                    amt: scaleCupsTbsTsp((obj.amt.whole_cups + obj.amt.partial_cups), obj.amt.tbs, (obj.amt.whole_tsp + obj.amt.partial_tsp), newVal),
                };
            } else if (obj.units == "lbsOz"){
                return {
                    ...obj,
                    amt: scaleLbsOz(obj.amt.lbs, obj.amt.oz, newVal),
                };
            } else if (obj.units == "grams"){
                return {
                    ...obj,
                    amt: {grams: parseFloat((obj.amt.grams * newVal).toFixed(2))},
                };
            } else {
                return {
                    ...obj,
                    amt: {items: parseFloat((obj.amt.items * newVal).toFixed(2))},
                };
            }
        }));
    }

    //reset to original/unscaled ingredient values + make it so that a different ingredient can be selected to scale by
    function handleCancelScaling(e){
        setIsSel(null);
        e.preventDefault();
        if (inProcess){
            setInProcess((inProcess) => !inProcess);
        }
        if (!okToSel){
            setOkToSel((okToSel) => !okToSel);
        }
        let resetVals = currentAmts.map((itm, idx) => {
            return ogAmtObjs[idx];
        });
        setCurrentAmts([...resetVals]);
    }

    //cancel selection of ingredient to scale by + make it so that a different ingredient can be selected to scale by
    function handleSelCancel(e){
        e.preventDefault();
        setOkToSel((okToSel) => !okToSel);
        setIsSel(null);
    }

    return (
        <>
            {inProcess ? <button id={styles.clearScale} className={styles.generalBtnSm} type="button" onClick={(e) => handleCancelScaling(e)}>Clear Scaling</button> : null}
            <ul>
                {currentAmts.map((itm, idx) => {
                    if (okToSel){
                        return <ScalableIngredientExpanded key={"scalable" + idx} id={idx} onSel={(e, idx) => handleIngSel(e, idx)}  ingInfo={ingObjs[idx]} amtObj={itm} isSelected={false} handleCancel={handleSelCancel} handleSetScale={handleSetSelection} />;
                    } else {
                        if ((idx == isSel) && !inProcess){
                            return <ScalableIngredientExpanded key={"scalable" + idx} id={idx} onSel={(e, idx) => handleIngSel(e, idx)}  ingInfo={ingObjs[idx]} amtObj={itm} isSelected={true} handleCancel={handleSelCancel} handleSetScale={handleSetSelection} />;
                        } else {
                            return <ScalableIngredientExpanded key={"scalable" + idx} id={idx} onSel={(e, idx) => handleIngSel(e, idx)}  ingInfo={ingObjs[idx]} amtObj={itm} isSelected={false} handleCancel={handleSelCancel} handleSetScale={handleSetSelection} />;
                        }
                    }
                    //console.log(itm);
                    
                })}
            </ul> 
            <button className={styles.generalBtnLg} type="button" onClick={(e) => handleSave(e, currentAmts, ingObjs)}>Save Scaled Recipe</button>
        </>
    );
}


export default function Scaler({ ings, handleCloseScaler, handleFinishUpdate }){
    const [sliderVal, setSliderVal] = useState(1);
    const [ingObjs, setIngObjs] = useState([...ings]);
    const [ogAmtObjs, setOgAmtObjs] = useState([...makeObjsToScaleAndShow(ings, 1)]);
    const [currentAmts, setCurrentAmts] = useState([...makeObjsToScaleAndShow(ings, 1)]);
    const [scaleUp, setScaleUp] = useState(false);
    const [scaleDown, setScaleDown] = useState(false);
    const [sliderScale, setSliderScale] = useState(true);

    useEffect(() => {
        console.log("use effect happening");
    }, []);

    //in response to new value set by slider input scale all ingredients in recipe by that amount
    function handleSliderChange(newVal){
        setSliderVal(newVal);
        setCurrentAmts(ogAmtObjs.map((obj, idx) => {
            if (obj.units == "cupsTbsTsp") {
                return {
                    ...obj,
                    amt: scaleCupsTbsTsp((obj.amt.whole_cups + obj.amt.partial_cups), obj.amt.tbs, (obj.amt.whole_tsp + obj.amt.partial_tsp), newVal),
                };
                //return scaleCupsTbsTsp((obj.amt.whole_cups + obj.amt.partial_cups), obj.amt.tbs, (obj.amt.whole_tsp + obj.amt.partial_tsp), newVal);
            } else if (obj.units == "lbsOz"){
                return {
                    ...obj,
                    amt: scaleLbsOz(obj.amt.lbs, obj.amt.oz, newVal),
                };
            } else if (obj.units == "grams"){
                return {
                    ...obj,
                    amt: {grams: parseFloat((obj.amt.grams * newVal).toFixed(2))},
                };
            } else {
                return {
                    ...obj,
                    amt: {items: parseFloat((obj.amt.items * newVal).toFixed(2))},
                };
            }
        }));
    }
    
    //if scale up chosen show the scale up input slider and hide the components for other kinds of scaling
    function handleScaleUp(e){
        e.preventDefault();
        if(!scaleUp){
            setScaleUp((scaleUp) => !scaleUp);
            setSliderVal(1);
        }
        if (!sliderScale){
            setSliderScale((sliderScale) => !sliderScale);
        }
        if(scaleDown){
            setScaleDown((scaleDown) => !scaleDown);
            setSliderVal(1);
        }
    }

    //if scale down chosen show the scale down input slider and hide the components for other kinds of scaling
    function handleScaleDown(e){
        e.preventDefault();
        if(scaleUp){
            setScaleUp((scaleUp) => !scaleUp);
            setSliderVal(1);
        }
        if(!scaleDown){
            setScaleDown((scaleDown) => !scaleDown);
            setSliderVal(1);
        }
        if (!sliderScale){
            setSliderScale((sliderScale) => !sliderScale);
        }
    }

    //if scale based on ingredient chosen show the component for this kind of scaling and hide the components for other kinds of scaling
    function handleByIng(e){
        e.preventDefault();
        if (sliderScale) {
            setSliderScale((sliderScale) => !sliderScale);
        }
        if (scaleUp) {
            setScaleUp((scaleUp) => !scaleUp);
        }
        if (scaleDown) {
            setScaleDown((scaleDown) => !scaleDown);
        }
    }

    //process scaled values to put in correct form for DB + have queries made to update the db entries
    function handleSaveScaled(e, cAmts, ingObjects){
        e.preventDefault();
        console.log(cAmts);
        console.log(ingObjects);
        const preppedAmts = processAmtsForDb(cAmts);
        const qrys = makeUpdateAmtSQL(preppedAmts, ingObjects);
        for (let qr of qrys){
            updateRowInDB([qr]);
        }
        alert("Ingredient quantities have been updated!");
        handleCloseScaler(e);
        handleFinishUpdate();
    }

    //put data in correct form for DB
    function processAmtsForDb(data){
        let cleanData = [];
        for (let dataObj of data){
            console.log(dataObj);
            let tempObj = {};
            if (dataObj['units'] == "cupsTbsTsp"){
                if (dataObj.amt['whole_cups'] != 0 && dataObj.amt["partial_cups"] != 0){
                    tempObj.cups = (parseFloat(dataObj.amt['whole_cups']) + parseFloat(dataObj.amt["partial_cups"])).toString();
                } else if (dataObj.amt['whole_cups'] != 0) {
                    tempObj.cups = dataObj.amt['whole_cups'];
                } else if (dataObj.amt["partial+cups"] != 0){
                    tempObj.cups = dataObj.amt["partial_cups"];
                }
                
                if (dataObj.amt["whole_tsp"] != 0 && dataObj.amt["partial_tsp"] != 0){
                    tempObj.tsp = (parseFloat(dataObj.amt.whole_tsp) + parseFloat(dataObj.amt["partial_tsp"])).toString();
                } else if (dataObj.amt["whole_tsp"] != 0) {
                    tempObj.tsp = dataObj.amt["whole_tsp"];
                } else if (dataObj.amt["partial_tsp"] != 0){
                    tempObj.tsp = dataObj.amt["partial_tsp"];
                }
                
                if (dataObj.amt["tbs"] != 0) {
                    tempObj.tbs = dataObj.amt["tbs"];
                }
    
            } else if (dataObj["units"] == "lbsOz"){
                if (dataObj.amt["oz"] != 0) {
                    tempObj.oz = dataObj.amt["oz"];
                }
                if (dataObj.amt["lbs"] != 0){
                    tempObj.lbs = dataObj.amt["lbs"];
                }
            } else if (dataObj["units"] == "grams"){
                tempObj.grams = dataObj.amt["grams"];
            } else {
                tempObj.items = dataObj.amt["items"];
            }
            cleanData.push(tempObj);
        }
       return cleanData;
    }

    //create SQL queries to update the ingredient amounts in the DB
    function makeUpdateAmtSQL(cAmts, ingObjects){
        let queries =[];
        
        for (let i = 0; i < cAmts.length; i++){
            let q = "UPDATE in_progress SET ";
            for (let a in cAmts[i]){
                q += a + " = '" + cAmts[i][a] + "', ";
            }
            q = q.substring(0, q.length-2);
            q +=  " WHERE recipe_name = '" + ingObjects[i].recipe_name + "' AND ingredient_name = '" + ingObjects[i].ingredient_name + "'";
            queries.push(q);
        }
        return queries;
    }

    //actually do the update queries
    async function updateRowInDB(queryStrs){
        const qry = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({q: queryStrs}),
        };
        //the url/path where the db connection function is
        const apiURLEndpoint = 'http://localhost:3000/api/updaterecipe';
        const response = await fetch(apiURLEndpoint, qry);
        const res = await response.json();
        //setTriggerChange(triggerChange+1);
        console.log(res.items);
        if (res.error){
            console.log(res.error);
            return true;
        } else {
            return false;
        }
    }
    

    return (
        <>
            
            {scaleUp ? <div><input className={styles.input2} type="range" name="sliderup" id="sliderup" min="1" max="10" step="0.05" value={sliderVal} onChange={e => handleSliderChange(e.target.value)} />
            <input className={styles.input} type="number" name="sVal" id="sVal" step="0.01" readOnly value={sliderVal} /></div> : null}
            
            {scaleDown ? <div><input className={styles.input2} type="range" min="0.01" max="1" step="0.01" value={sliderVal} onChange={e => handleSliderChange(e.target.value)} />
            <input className={styles.input} type="number" name="sVal" id="sVal" onChange={e => handleSliderChange(e.target.value)} value={sliderVal} step={0.01} /></div> : null}
            <br/>
            <button className={styles.generalBtnSm2} type="button" id="scaleDown" name="scaleDown" onClick={handleScaleDown}>Scale Down</button><button className={styles.generalBtnSm2} type="button" id="scaleUp" name="scaleUp" onClick={handleScaleUp}>Scale Up</button><button className={styles.generalBtnSm2} type="button" id="scaleByIng" onClick={handleByIng}>Scale By Ingredient</button><button className={styles.scalerClose} type="button" onClick={(e) => handleCloseScaler(e)} >Cancel Scale</button><br/>
            {sliderScale? <><ul>
                {currentAmts.map((itm, idx) => {
                    //console.log(itm);
                    return <div className={styles.scalableIng}><ScalableIngredient key={"scalable" + idx} ingInfo={ingObjs[idx]} amtObj={itm} /></div>;
                })}
            </ul> <button className={styles.generalBtnLg} type="button" onClick={(e) => handleSaveScaled(e, currentAmts, ingObjs)}>Save Scaled Recipe</button> </> : <div id={styles.byIng}><p>Click on an ingredient, enter the amount of that ingredient you want to use, and hit "scale"--the other ingredients will adjust proportionally!</p><ScalableRecipe amtsArr={ogAmtObjs} ingObjs={ingObjs} handleSave={handleSaveScaled} /></div>}
        </>
    );
}