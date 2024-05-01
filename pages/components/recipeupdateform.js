import { useState, useRef, useEffect } from 'react';
import RecipeIngredientForm from './recipe-ingredient-form';
import { prepItemEdit } from '../conversions/helpers';
import styles from '../../styles/componentstyles/RecipeIngredientUpdateForm.module.css';

export function QuantityInputAreaV2Update({ unitType, recipeid, itmInfo }){
    
    let initialTbs;
    if (itmInfo.tbs == null){
        initialTbs = "";
    } else {
        initialTbs = itmInfo.tbs;
    }
    let initialLbs;
    if (itmInfo.lbs == null) {
        initialLbs = "";
    } else {
        initialLbs = itmInfo.lbs;
    }
    let initialOz;
    if (itmInfo.oz == null) {
        initialOz = "";
    } else {
        initialOz = itmInfo.oz;
    }

    //declare state variables
    const [tbs, setTbs] = useState(initialTbs);
    const [partialCups, setPartialCups] = useState(prepItemEdit(itmInfo.cups)[1]);
    const [wholeCups, setWholeCups] = useState(prepItemEdit(itmInfo.cups)[0]);
    const [partialTsp, setPartialTsp] = useState(prepItemEdit(itmInfo.tsp)[1]);
    const [wholeTsp, setWholeTsp] = useState(prepItemEdit(itmInfo.tsp)[0]);

    let ogGrams;
    if (itmInfo.grams != null){
        ogGrams = itmInfo.grams;
    }else {
        ogGrams = "";
    }
    const [grams, setGrams] = useState(ogGrams);
    const [lbs, setLbs] = useState(initialLbs);
    const [oz, setOz] = useState(initialOz);
    let ogItms;
        if (itmInfo.items != null){
            ogItms = itmInfo.items;
        } else {
            ogItms = "";
        }
    const [itms, setItms] = useState(ogItms);

    useEffect( () => {
        //console.log("in quantity section");
    }, [wholeCups, partialCups, tbs, wholeTsp, partialTsp, grams, oz, lbs, itms]);


    if(unitType === "cupsTbsTsp"){
        //functions to display updated values when entered

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
                <label  className={styles.inputLabel} htmlFor={"wholeCups"+recipeid}>Cups:</label>
                <input className={styles.ingInput} type="number" step="1" min="0" id={"wholeCups"+recipeid} name={"wholeCups" + recipeid} value={wholeCups} onChange={(e) => handleSelectWholeCups(e.target.value)} /> 
                <label className={styles.inputLabel} htmlFor={"partialCups"+recipeid}> + </label>
                <select className={styles.ingInput} id={"partialCups"+recipeid} name={"partialCups" + recipeid} value={partialCups} onSelect={e => handleSelectPartialCups(e.target.value)} onChange = {e => handleSelectPartialCups(e.target.value)}>
                    <option value=""> </option>
                    <option value="0.25">1/4</option>
                    <option value="0.33">1/3</option>
                    <option value="0.5">1/2</option>
                    <option value="0.66">2/3</option>
                    <option value="0.75">3/4</option>
                </select>
                <br />
                <label className={styles.inputLabel} htmlFor={"tbs"+recipeid}>Tablespoons: </label>
                <input className={styles.ingInput} type="number" step="1" min="0" id={"tbs"+recipeid} name={"tbs" + recipeid} value={tbs} onChange={(e) => handleSetTbs(e.target.value)} /> 
                <br/>
                <label className={styles.inputLabel} htmlFor={"wholeTsp"+recipeid}>Teaspoons: </label>
                <input className={styles.ingInput} type="number" step="1" min="0" id={"wholeTsp"+recipeid} name={"wholeTsp" + recipeid} value={wholeTsp} onChange={(e) => handleSelectWholeTsp(e.target.value)}/> 
                <label className={styles.inputLabel} htmlFor={"partialTsp"+recipeid}> + </label>
                <select className={styles.ingInput} id={"partialTsp"+recipeid} name={"partialTsp" + recipeid} value={partialTsp} onChange={(e) => handleSelectPartialTsp(e.target.value)}>
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
                <label className={styles.inputLabel} htmlFor={"grams"+recipeid}>Grams: </label>
                <input className={styles.ingInput} type="number" step="0.1" min="0" id={"grams"+recipeid} name={"grams"+recipeid} value={grams} onChange={(e) => handleChangeGrams(e.target.value)} />
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
                <label className={styles.inputLabel} htmlFor={"lbs"+recipeid}>Pounds: </label>
                <input className={styles.ingInput} type="number" step="0.1" min="0" id={"lbs"+recipeid} name={"lbs"+recipeid} value={lbs} onChange={(e) => handleChangeLbs(e.target.value)} />
                <label className={styles.inputLabel} htmlFor={"oz"+recipeid}>Ounces: </label>
                <input className={styles.ingInput} type="number" step="0.1" min="0" id={"oz"+recipeid} name={"oz" + recipeid} value={oz} onChange={(e) => handleChangeOz(e.target.value)} />
            </>
        );
    } else {
        function handleChaneItms(newVal) {
            setItms(newVal);
        }

        return(
            <>
                <label className={styles.inputLabel} >Quantity: </label>
                <input className={styles.ingInput} type="number" step="0.1" min="0" id={"itms"+recipeid} name={"items"+recipeid} value={itms} onChange={(e) => handleChaneItms(e.target.value)} />
            </>
        );
    }
}


export function RecipeIngredientUpdateForm({ recipeid, itmInfo, handleDel }){
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

    let desc;
    if (desc == null) {
        desc = "";
    } else {
        desc = itmInfo.descriptors;
    }

    const [unitsValue, setUnitsValue] = useState(u);
    const [descriptors, setDescriptors] = useState(itmInfo.descriptors);


    //functions to display updated values when entered
    function handleSelect(newVal){
        setUnitsValue(newVal);
    }

    function handleChangeDesc(newVal){
        setDescriptors(newVal);
    }

    useEffect(() => {
        console.log("switching units or desc");
    }, [unitsValue]);


    return(
        <>
            <div recipeid={recipeid}>
                <label className={styles.inputLabel} htmlFor={'item_name'+recipeid} >Ingredient Name: </label>
                <input className={styles.ingInput} type="text" id={"item_name"+recipeid} name={"item_name" + recipeid} readOnly={true} value={itmInfo.ingredient_name} size={itmInfo.ingredient_name.length}/> <br/> 
                <div id='quantity'>
                    <label className={styles.inputLabel} htmlFor={'units'+recipeid}>Units: </label>
                    <select onChange={e => handleSelect(e.target.value)} id={"units"+recipeid} name={"units" + recipeid} value={unitsValue}>
                            <option value="items"> </option>
                            <option value="cupsTbsTsp">Cups, Tablespoons, Teaspoons</option>
                            <option value="lbsOz">Pounds, Ounces</option>
                            <option value="grams">Grams</option>
                    </select>
                    <br/>
                    <QuantityInputAreaV2Update unitType={unitsValue} recipeid={recipeid} itmInfo={itmInfo} />
                    <br/>
                    <label className={styles.inputLabel} htmlFor={'descriptors'+recipeid}>Descriptors (ex: chopped, minced, melted, etc.)</label>
                    <input className={styles.ingInput} type='text' id={'descriptors'+recipeid} name={'descriptors' + recipeid} value={descriptors} size={descriptors.length} onChange={e => handleChangeDesc(e.target.value)}/>
                    <button className={styles.ingDelBtn} type="button" id={recipeid} onClick={handleDel}>Delete Ingredient</button>
                    <br/><br/>
                </div>  
            </div>
        </>
    )

}

export default function UpdateRecipeInputForm({ings, insts, notes}){
    const [ogIngredients, setOgIngredients] = useState([...ings]);
    const [ingInputs, setIngInputs] = useState([]);
    const [ingCount, setIngCount] = useState(ings.length);
    const [recipePos, setRecipePos] = useState([]);
    const [triggerChange, setTriggerChange] = useState(0);
    const [newIngCount, setNewIngCount] = useState(0);
    const [newIngInputs, setNewIngInputs] = useState([]);
    const [recNotes, setRecNotes] = useState([]);
    const [recInst, setRecInst] = useState([]);
    const [instVals, setInstVals] = useState([...insts]);
    const [notesVals, setNotesVals] = useState([...notes]);
    const [editInst, setEditInst] = useState("");
    const [editNote, setEditNote] = useState("");
    const [editInstIdx, setEditInstIdx] = useState(0);
    const [editNoteIdx, setEditNoteIdx] = useState(0);
    const [showEditInst, setShowEditInst] = useState(false);
    const [showEditNote, setShowEditNote] = useState(false);
    const [newNoteInputs, setNewNoteInputs] = useState([]);
    const [notesCount, setNotesCount] = useState(notes.length);
    const [toDel, setToDel] = useState([]);
    const [toDelStr, setToDelStr] = useState("");

    var itemNamesForDel = [];
    var itemsStrForDel = ""
    const inputRef = useRef(null);


    useEffect( () => {
        setIngInputs(ogIngredients.map((itm, idx) => {
            return <div className={styles.ingArea}><RecipeIngredientUpdateForm key={idx} recipeid={idx} itmInfo={itm} handleDel={handleDelIng} /></div>
        }));

        setRecInst(instVals.map((itm, idx) => {
            return <div><input className={styles.insts} type='text' value={itm} size={itm.length} name={"instruction"+idx} readOnly={true} /><button className={styles.buttonGeneral} type='button' id={"instruction"+idx} onClick={e => handleEditInst(e)}>Edit</button></div>
        }));

        setRecNotes(notesVals.map((itm, idx) => {
            return <div><input className={styles.notesInp} type='text' value={itm} size={itm.length} name={"note"+idx} readOnly={true} /><button className={styles.buttonGeneral} type='button' id={"note"+idx} onClick={e => handleEditNote(e)}>Edit</button></div>
        }));

        console.log(notes);
        /*setRecInst(insts.map((i, idx) => {
            return <div><input type="text" id={"instruction"+idx} name={"instruction"+idx} value={eval("inst" + idx)} onChange={e => handleChangeInst(e)} /><button type='button'>Edit</button></div>
        }));*/

    }, [showEditInst, showEditNote, ingCount]);

    useEffect( () => {
        //console.log(ingCount);
        //console.log(recipePos);
        console.log(editInst);
    }, [triggerChange, showEditInst, showEditNote, toDel, toDelStr]);

    function handleChangeInst(newVal){
        setEditInst(newVal);
    }

    function handleChangeNote(newVal){
        setEditNote(newVal);
    }

    function handleEditInst(e){
        e.preventDefault()
        const indx = parseInt(e.target.id.substring(11));
        console.log(indx);
        setEditInst(instVals[indx]);
        setEditInstIdx(indx);
        setTriggerChange(triggerChange+1);
       // do {setTriggerChange(triggerChange+1)}while(editInst == "");
        //console.log(instVals);
        console.log(editInst);
        //setEditInstInput(<div id={"instruction"+indx} ><input type="text" name={"instruction"+indx} onChange={e => handleChangeInst(e.target.value)} value={editInst} /><button type='button'>Cancel</button><button type='button' onClick={handleUpdateInstVal}>Save</button></div>);
        setShowEditInst(showEditInst => !showEditInst);
    }

    function handleUpdateInstVal(e){
        e.preventDefault();
        console.log(editInstIdx);
        console.log(editInst);
        setInstVals(instVals.map((itm, idx) => {
            if (idx == editInstIdx){
                return editInst;
            } else {
                return itm;
            }
        }));
        setTriggerChange(triggerChange+1);
        setShowEditInst(showEditInst => !showEditInst);
        setEditInst("");
        setEditInstIdx(0);
        console.log(instVals);
    }

    function handleCancelUpdateInst(e){
        e.preventDefault();
        setShowEditInst(showEditInst => !showEditInst);
    }

    function handleCancelUpdateNote(e){
        e.preventDefault();
        setShowEditNote(showEditNote => !showEditNote);
    }

    function handleEditNote(e){
        console.log(e.target.id);
        e.preventDefault()
        const indx = parseInt(e.target.id.substring(4));
        console.log(indx);
        setEditNote(notesVals[indx]);
        setEditNoteIdx(indx);
        setTriggerChange(triggerChange+1);
        console.log(editNote);
        setShowEditNote(showEditNote => !showEditNote);
    }

    function handleUpdateNoteVal(e){
        e.preventDefault();
        console.log(editNoteIdx);
        console.log(editNote);
        setNotesVals(notesVals.map((itm, idx) => {
            if (idx == editNoteIdx){
                return editNote;
            } else {
                return itm;
            }
        }));
        setTriggerChange(triggerChange+1);
        setShowEditNote(showEditNote => !showEditNote);
        setEditNote("");
        setEditNoteIdx(0);
        console.log(notesVals);
    }
    
    function handleAddIngredient(e){
        e.preventDefault();
        setRecipePos([...recipePos, ingCount]);
        setNewIngInputs([...newIngInputs, <RecipeIngredientForm key={ingCount} recipeid={ingCount} clickHandler={handleRemoveIngredient} />]);
        setIngCount(ingCount + 1);
        setNewIngCount(newIngCount + 1);
        setTriggerChange(triggerChange+1);
    }


    function handleRemoveIngredient(e){
        e.preventDefault();
        const itm = parseInt(e.target.id);
        console.log(itm);
        //find index of item to remove (id != index)
        const itmIdx = recipePos.indexOf(itm);
        //const secondHalfArr = ingInputs.slice((itm+1));
        const tempArr = newIngInputs.slice(0, itmIdx).concat(newIngInputs.slice((itmIdx+1)));
        console.log(tempArr);
        setNewIngInputs(tempArr);
        //adjust the array of ingredient ids
        const tempPos = recipePos.slice(0, itmIdx).concat(recipePos.slice(itmIdx+1));
        console.log("new pos list");
        console.log(tempPos)
        setRecipePos([...tempPos]);
        setNewIngCount(newIngCount - 1);
        setTriggerChange(triggerChange+1);
    }

    function handleAddNote(e){
        e.preventDefault();
        //setRecipePos([...recipePos, ingCount]);
        setNewNoteInputs([...newNoteInputs, <div><input className={styles.notesInp} type="text" name={"note"+notesCount} /><button id={"note"+notesCount} className={styles.buttonGeneral} type='button' onClick={handleRemoveNote}>Remove</button></div>]);
        setNotesCount(notesCount + 1);
        setTriggerChange(triggerChange+1);
    }

    function handleRemoveNote(e){
        e.preventDefault();
        const itm = parseInt(e.target.id.substring(4));
        console.log(itm);
        const tempArr = newNoteInputs.slice(0, itm).concat(newNoteInputs.slice((itm+1)));
        console.log(tempArr);
        setNewNoteInputs(tempArr);
        setNotesCount(notesCount - 1);
        setTriggerChange(triggerChange+1);
    }

    function handleDelIng(e){
        e.preventDefault();
        const itmIdx = e.target.id;
        console.log(ogIngredients[itmIdx]);
        if (!itemNamesForDel.includes(ogIngredients[itmIdx].ingredient_name)){
            let temparr = [...toDel, ogIngredients[itmIdx].ingredient_name];
            //console.log(temparr);
            setToDel(temparr);
            let temp = toDelStr+ "XXXX" + ogIngredients[itmIdx].ingredient_name;
            setToDelStr(temp);
            itemNamesForDel.push(ogIngredients[itmIdx].ingredient_name);
            itemsStrForDel += "XXXX" + ogIngredients[itmIdx].ingredient_name;
            setTriggerChange(triggerChange+1);
            //console.log(toDel);
            //console.log(toDelStr);
            console.log(itemNamesForDel);
            inputRef.current.value = itemsStrForDel;
        } else {
            alert(ogIngredients[itmIdx].ingredient_name + " already set to delete when all edits submitted");
        }
    }

    return (
        <>  
            <div id={styles.recNameArea}>
                <label id={styles.recName} htmlFor='recipe_name'>Recipe Name: </label>
                <input className={styles.recNameInp} type='text' id='recipe_name' name='recipe_name' value={ings[0].recipe_name} size={ings[0].recipe_name.length} />
            </div>
             <br/>
            <div id={styles.editList}>
                {ingInputs}
            </div>
            {newIngInputs}
            <button className={styles.buttonGeneral} id={styles.btnAddIngredient} type="button" onClick={handleAddIngredient}>Add Ingredient</button>
            <br/><br/><br/>
            <label className={styles.inputLabelLg}>Instructions:</label>
            {/*INSTRUCTIONS */}
            {showEditInst? <div id={"instruction"+ editInstIdx} ><input className={styles.instrList} type="text" name={"new_instruction"} onChange={e => handleChangeInst(e.target.value)} value={editInst} size={editInst.length} /><button className={styles.buttonInstEdit} type='button' onClick={handleCancelUpdateInst}>Cancel</button><button className={styles.buttonInstEdit} type='button' onClick={handleUpdateInstVal}>Save</button></div>
             : <ol id={styles.instrList}>{recInst.map((itm, idx) => {
                return <li key={"instrct"+idx}>{itm}</li>
             })}</ol>}
            {/*<button type="button" onClick={handleAddInstruction}>Add Another Instruction</button>*/}
            <br/>
            <label className={styles.inputLabelLg}>Notes:</label>
            {/*NOTES*/}
            {showEditNote? <div id={"note"+ editNoteIdx} ><input className={styles.notesInp} type="text" name={"new_note"} onChange={e => handleChangeNote(e.target.value)} value={editNote} /><button className={styles.buttonGeneral} type='button' onClick={handleCancelUpdateNote}>Cancel</button><button className={styles.buttonGeneral} type='button' onClick={handleUpdateNoteVal}>Save</button></div>
             : recNotes}
            {newNoteInputs}
            <button className={styles.buttonGeneral} type="button" onClick={handleAddNote}>Add New Note</button> 
            {/*<button type="button" onClick={handleAddNote}>{hasNote ? "Add Another Note" : "Add Notes"}</button>*/}
            <br/><br/>
            <input type='hidden' name='item_count' id='item_count' value={ingCount} />
            <input type='hidden' name='new_item_count' id='item_count' value={newIngCount} />
            <input type='hidden' name='inst_count' id='inst_count' value={insts.length} />
            <input type='hidden' name='note_count' id='note_count' value={notesCount} />
            <input ref={inputRef} type='hidden' name='to_del' id='to_del' />
            <button id={styles.saveBtn} type="submit">Save Recipe</button>
        </>
    );

}