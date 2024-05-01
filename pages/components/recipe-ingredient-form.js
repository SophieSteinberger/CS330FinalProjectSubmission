import { FormEvent, useState, useRef, useEffect } from 'react';
import styles from '../../styles/componentstyles/RecipeIngredientForm.module.css';

export function QuantityInputAreaV2({ unitType, recipeid }){
    if(unitType === "cupsTbsTsp"){
        return (
            <> 
                <br/>
                <label className={styles.inputLabel} htmlFor={"wholeCups"+recipeid}>Cups:</label>
                <input className={styles.ingInput} type="number" step="1" min="0" id={"wholeCups"+recipeid} name={"wholeCups" + recipeid}/> 
                <label className={styles.inputLabel} htmlFor={"partialCups"+recipeid}> + </label>
                <select className={styles.ingInput} id={"partialCups"+recipeid} name={"partialCups" + recipeid}>
                    <option value=""> </option>
                    <option value="0.25">1/4</option>
                    <option value="0.33">1/3</option>
                    <option value="0.5">1/2</option>
                    <option value="0.66">2/3</option>
                    <option value="0.75">3/4</option>
                </select>
                <br />
                <label className={styles.inputLabel} htmlFor={"tbs"+recipeid}>Tablespoons: </label>
                <input className={styles.ingInput} type="number" step="1" min="0" id={"tbs"+recipeid} name={"tbs" + recipeid} /> 
                <br/>
                <label className={styles.inputLabel} htmlFor={"wholeTsp"+recipeid}>Teaspoons: </label>
                <input className={styles.ingInput} type="number" step="1" min="0" id={"wholeTsp"+recipeid} name={"wholeTsp" + recipeid} /> 
                <label className={styles.inputLabel} htmlFor={"partialTsp"+recipeid}> + </label>
                <select className={styles.ingInput} id={"partialTsp"+recipeid} name={"partialTsp" + recipeid}>
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
            <br/>
                <label className={styles.inputLabel} htmlFor={"grams"+recipeid}>Grams: </label>
                <input className={styles.ingInput} type="number" step="0.1" min="0" id={"grams"+recipeid} name={"grams"+recipeid} />
            </>
        );
    }else if (unitType === "lbsOz"){
        return (
            <>
            <br/>
                <label className={styles.inputLabel} htmlFor={"lbs"+recipeid}>Pounds: </label>
                <input className={styles.ingInput} type="number" step="0.1" min="0" id={"lbs"+recipeid} name={"lbs"+recipeid} />
                <label className={styles.inputLabel} htmlFor={"oz"+recipeid}>Ounces: </label>
                <input className={styles.ingInput} type="number" step="0.1" min="0" id={"oz"+recipeid} name={"oz" + recipeid} />
            </>
        );
    } else {
        return(
            <>
            <br/>
                <label className={styles.inputLabel}>Quantity: </label> 
                <input className={styles.ingInput} type="text" id={"itms"+recipeid} name={"items"+recipeid} />
            </>
        );
    }
}


export default function RecipeIngredientForm({ recipeid, clickHandler, id }){
    const [unitsValue, setUnitsValue] = useState("itm");

    function handleSelect(newVal){
        setUnitsValue(newVal);
    }

    return(
        <>
            <div className={styles.ingArea} recipeid={recipeid}>
                <label className={styles.inputLabel} htmlFor={'item_name'+recipeid} >Ingredient Name: </label>
                <input className={styles.ingInput} size='30' type="text" id={"item_name"+recipeid} name={"item_name" + recipeid} /> <br/>   
                <div id='quantity'>
                    <label className={styles.inputLabel} htmlFor={'units'+recipeid}>Units: </label>
                    <select className={styles.ingInput} onChange={e => handleSelect(e.target.value)} id={"units"+recipeid} name={"units" + recipeid}>
                            <option value="items">Items</option>
                            <option value="cupsTbsTsp">Cups, Tablespoons, Teaspoons</option>
                            <option value="lbsOz">Pounds, Ounces</option>
                            <option value="grams">Grams</option>
                    </select>
                    <QuantityInputAreaV2 unitType={unitsValue} recipeid={recipeid} />
                    <br/>
                    <label className={styles.inputLabel} htmlFor={'descriptors'+recipeid}>Descriptors (ex: chopped, minced, melted, etc.):</label>
                    <input className={styles.ingInput} size={50} type='text' id={'descriptors'+recipeid} name={'descriptors' + recipeid} />
                    <button type="button" className={styles.buttonGeneral} onClick={clickHandler} id={recipeid}>Remove Ingredient</button>
                    <br/><br/>
                </div>  
            </div>
        </>
    )

}