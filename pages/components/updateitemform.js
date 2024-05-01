import { useState, useEffect } from 'react';
import { prepItemEdit } from '../conversions/helpers';
import styles from '../../styles/componentstyles/UpdateItemInputForm.module.css';


export function QuantityInputArea({ unitType, itmInfo }){
    let initialTbs;
    if (!("tbs" in itmInfo) || itmInfo.tbs == null){
        initialTbs = "";
    } else {
        initialTbs = itmInfo.tbs;
    }
    let initialLbs;
    if (!("lbs" in itmInfo) || itmInfo.lbs == null) {
        initialLbs = "";
    } else {
        initialLbs = itmInfo.lbs;
    }
    let initialOz;
    if (!("oz" in itmInfo) || itmInfo.oz == null) {
        initialOz = "";
    } else {
        initialOz = itmInfo.oz;
    }

    //declare state variables
    const [tbs, setTbs] = useState(initialTbs);
    const [partialCups, setPartialCups] = useState(("cups" in itmInfo) ? prepItemEdit(itmInfo.cups)[1] : "");
    const [wholeCups, setWholeCups] = useState(("cups" in itmInfo) ? prepItemEdit(itmInfo.cups)[0] : "");
    const [partialTsp, setPartialTsp] = useState(("tsp" in itmInfo) ? prepItemEdit(itmInfo.tsp)[1]: "");
    const [wholeTsp, setWholeTsp] = useState(("tsp" in itmInfo) ? prepItemEdit(itmInfo.tsp)[0] : "");

    let ogGrams;
    if (!("grams" in itmInfo) || itmInfo.grams != null){
        ogGrams = itmInfo.grams;
    }else {
        ogGrams = "";
    }
    const [grams, setGrams] = useState(ogGrams);
    const [lbs, setLbs] = useState(initialLbs);
    const [oz, setOz] = useState(initialOz);
    let ogItms;
        if (!("items" in itmInfo) || itmInfo.items != null){
            ogItms = itmInfo.items;
        } else {
            ogItms = "";
        }
    const [itms, setItms] = useState(ogItms);

    useEffect( () => {

    }, [wholeCups, partialCups, tbs, wholeTsp, partialTsp, grams, oz, lbs, itms]);

    
    if(unitType === "cupsTbsTsp"){
        //functions that update displayed values when changed

        function handleSelectPartialCups(newVal){
            setPartialCups(newVal);
        }
    
        function handleSelectWholeCups(newVal){
            setWholeCups(newVal);
        }
    
        function handleSetTbs(newVal){
            setTbs(newVal);
        }
    
        function handleSelectPartialTsp(newVal){
            setPartialTsp(newVal);
        }
    
        function handleSelectWholeTsp(newVal){
            setWholeTsp(newVal);
        }

        return (
            <>
                <label className={styles.inputLabels} htmlFor="wholeCups">Cups:</label>
                <input className={styles.inputs} type="number" step="1" min="0" id="wholeCups" name="wholeCups" value={wholeCups} onChange={(e) => handleSelectWholeCups(e.target.value)} /> 
                <label className={styles.inputLabels} htmlFor="partialCups"> + </label>
                <select id="partialCups" name="partialCups" value={partialCups} onSelect={e => handleSelectPartialCups(e.target.value)} onChange = {e => handleSelectPartialCups(e.target.value)} >
                    <option value=""> </option>
                    <option value="0.25">1/4</option>
                    <option value="0.33">1/3</option>
                    <option value="0.5">1/2</option>
                    <option value="0.66">2/3</option>
                    <option value="0.75">3/4</option>
                </select>
                <br />
                <label className={styles.inputLabels} htmlFor="tbs">Tablespoons: </label>
                <input className={styles.inputs} type="number" step="1" min="0" id="tbs" name="tbs" value={tbs} onChange={(e) => handleSetTbs(e.target.value)} /> 
                <br/>
                <label className={styles.inputLabels} htmlFor="wholeTsp">Teaspoons: </label>
                <input className={styles.inputs} type="number" step="1" min="0" id="wholeTsp" name="wholeTsp" value={wholeTsp} onChange={(e) => handleSelectWholeTsp(e.target.value)} /> 
                <label className={styles.inputLabels} htmlFor="partialTsp"> + </label>
                <select className={styles.inputs} id="partialTsp" name="partialTsp" value={partialTsp} onChange={(e) => handleSelectPartialTsp(e.target.value)}>
                    <option value=""> </option>
                    <option value="0.25">1/4</option>
                    <option value="0.5">1/2</option>
                    <option value="0.75">3/4</option>
                </select>
            </>
        );
    } else if (unitType === "grams"){

        function handleChangeGrams(newVal){
            setGrams(newVal);
        }

        return (
            <>
                <label className={styles.inputLabels} htmlFor="grams">Grams: </label>
                <input className={styles.inputs} type="number" step="0.1" min="0" id="grams" name="grams" value={grams} onChange={(e) => handleChangeGrams(e.target.value)} />
            </>
        );
    }else if (unitType === "lbsOz"){
       
        function handleChangeLbs(newVal){
            setLbs(newVal);
        }

        function handleChangeOz(newVal){
            setOz(newVal);
        }

        return (
            <>
                <label className={styles.inputLabels} htmlFor="lbs">Pounds: </label>
                <input className={styles.inputs} type="number" step="0.1" min="0" id="lbs" name="lbs" value={lbs} onChange={(e) => handleChangeLbs(e.target.value)} />
                <label className={styles.inputLabels} htmlFor="oz">Ounces: </label>
                <input className={styles.inputs} type="number" step="0.1" min="0" id="oz" name="oz" value={oz} onChange={(e) => handleChangeOz(e.target.value)}/>
            </>
        );
    } else {
        
        function handleChaneItms(newVal) {
            setItms(newVal);
        }

        return(
            <>
                <label className={styles.inputLabels} >Quantity: </label>  
                <input className={styles.inputs} type="number" step="0.1" min="0" id="itms" name="items" value={itms} onChange={(e) => handleChaneItms(e.target.value)} />
            </>
        );
    }
}

export default function UpdateItemInputForm({ itmInfo }){

    let u;
    if (itmInfo.cups != null || itmInfo.tbs != null || itmInfo.tsp != null){
        u = "cupsTbsTsp";
    } else if (itmInfo.grams != null){
        u = "grams";
    } else if (itmInfo.oz != null || itmInfo.lbs != null){
        u = "lbsOz";
    } else {
        u = "items";
    }

    const [unitsValue, setUnitsValue] = useState(u);
    const [expDate, setExpDate] = useState(itmInfo.exp_date);

    //functions to update values displayed when changed

    function handleSelect(newVal){
        setUnitsValue(newVal);
    }

    function handleChangeDate(newVal){
        setExpDate(newVal);
    }

    useEffect(() => {
        
    }, [unitsValue, expDate]);

    return(
        <>
        <label className={styles.inputLabels}  >{"Item Name: "}</label>
            <input className={styles.inputs} type="text" id="item_name" name="item_name" readOnly={true} value={itmInfo.item_name}/> <br/>  
            <div id='quantity'>
            <label className={styles.inputLabels} htmlFor='units'>Units: </label>
                <select className={styles.inputs} value={unitsValue} onChange={e => handleSelect(e.target.value)} id="units" name="units">
                        <option value="items">Items</option>
                        <option value="cupsTbsTsp">Cups, Tablespoons, Teaspoons</option>
                        <option value="lbsOz">Pounds, Ounces</option>
                        <option value="grams">Grams</option>
                </select>
                <br/>
                <QuantityInputArea unitType={unitsValue} itmInfo={itmInfo}/>
            </div>
            <label className={styles.inputLabels} htmlFor='exp_date'>Expiration Date: </label>
            <input className={styles.inputs} type='date' name='exp_date' id='exp_date' value={expDate} onChange={e => handleChangeDate(e.target.value)} /> <br/>
            <button className={styles.subBtn} type='submit'>submit</button>   

        </>
    );

}