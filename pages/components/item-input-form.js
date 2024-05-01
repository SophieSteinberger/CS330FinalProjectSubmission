import { useState } from 'react';
import styles from '../../styles/componentstyles/ItemInputForm.module.css';

export function QuantityInputArea({ unitType }){
    if(unitType === "cupsTbsTsp"){
        return (
            <>
                <label className={styles.inputLabel} htmlFor="wholeCups">Cups:</label>
                <input className={styles.ingInput} type="number" step="1" min="0" id="wholeCups" name="wholeCups" /> 
                <label className={styles.inputLabel} htmlFor="partialCups"> + </label>
                <select className={styles.ingInput} id="partialCups" name="partialCups">
                    <option value=""> </option>
                    <option value="0.25">1/4</option>
                    <option value="0.33">1/3</option>
                    <option value="0.5">1/2</option>
                    <option value="0.66">2/3</option>
                    <option value="0.75">3/4</option>
                </select>
                <br />
                <label className={styles.inputLabel} htmlFor="tbs">Tablespoons: </label>
                <input className={styles.ingInput} type="number" step="1" min="0" id="tbs" name="tbs" /> 
                <br/>
                <label className={styles.inputLabel} htmlFor="wholeTsp">Teaspoons: </label>
                <input className={styles.ingInput} type="number" step="1" min="0" id="wholeTsp" name="wholeTsp" /> 
                <label className={styles.inputLabel} htmlFor="partialTsp"> + </label>
                <select id="partialTsp" name="partialTsp">
                    <option value=""> </option>
                    <option value="0.25">1/4</option>
                    <option value="0.5">1/2</option>
                    <option value="0.75">3/4</option>
                </select>
            </>
        );
    } else if (unitType === "grams"){
        return (
            <>
                <label className={styles.inputLabel} htmlFor="grams">Grams: </label>
                <input className={styles.ingInput} type="number" step="0.1" min="0" name="grams" />
            </>
        );
    }else if (unitType === "lbsOz"){
        return (
            <>
                <label className={styles.inputLabel} htmlFor="lbs">Pounds: </label>
                <input className={styles.ingInput} type="number" step="0.01" min="0" id="lbs" name="lbs" />
                <br/>
                <label className={styles.inputLabel} htmlFor="oz">Ounces: </label>
                <input className={styles.ingInput} type="number" step="0.1" min="0" id="oz" name="oz" />
            </>
        );
    } else {
        return(
            <>
                <label className={styles.inputLabel} >Quantity: </label>
                <input className={styles.ingInput} type="number" step="0.1" min="0" id="itms" name="items" />
            </>
        );
    }
}

export default function ItemInputForm(){
    //const [formInput, setFormInput] = useState([]);
    const [unitsValue, setUnitsValue] = useState("itm");

    //track in state what type of units user has selected (used to produce the correct quantity input area)
    function handleSelect(newVal){
        setUnitsValue(newVal);
    }

    return(
        <>
            <label className={styles.inputLabel} htmlFor='item_name' >Item Name: </label>
            <input className={styles.ingInput} type="text" id="item_name" name="item_name" /> <br/>
                <label className={styles.inputLabel} htmlFor='units'>Units: </label>
                <select className={styles.ingInput} onChange={e => handleSelect(e.target.value)} id="units" name="units">
                        <option value="items"> </option>
                        <option value="cupsTbsTsp">Cups, Tablespoons, Teaspoons</option>
                        <option value="lbsOz">Pounds, Ounces</option>
                        <option value="grams">Grams</option>
                </select>
                <br/>
                <QuantityInputArea unitType={unitsValue} />
                <br/>
            <label className={styles.inputLabel} htmlFor='exp_date'>Expiration Date: </label>
            <input className={styles.ingInput} type='date' name='exp_date' id='exp_date' /> <br/>
            <button className={styles.buttonGeneral} type='submit'>Submit</button>   

        </>
    )

}