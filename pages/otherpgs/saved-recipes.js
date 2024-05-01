import Head from "next/head";
import { useEffect, useState } from "react";
import RecipeIngredientForm from "../components/recipe-ingredient-form";
import { parseItemsToShow } from "../conversions/conversions";
import { prepRecipeIngredientsForDB, makeInputQueries, processNotesAndInstructions, processNotesAndInstForUpdate, makeIngredientUpdateQs } from "../conversions/helpers";
import RecipeNote from "../components/recipe-note";
import RecipeInstruction from "../components/recipe-instruction";
import UpdateRecipeInputForm from "../components/recipeupdateform";
import FavBtn from "../components/fav-btn";
import styles from '../../styles/SavedRecipesPage.module.css';
//"../components/SavedRecipesPage.module.css";
import Layout from "../components/layout";

export default function SavedRecipesPage(){
    //display recipes
    const [dataResponse1, setDataResponse1] = useState([]);
    const [dataResponse2, setDataResponse2] = useState([]);
    //literally just list of names from data response 1
    const [namesList, setNamesList] = useState([]);
    const [displayRecipe, setDisplayRecipe] = useState("");
    const [currentInstructions, setCurrentInstructions] = useState([]);
    const [currentNotes, setCurrentNotes] = useState([]);
    //list of ingredient objects for selected recipe
    const [ingredientList, setIngredientList] = useState([]);
    //List items for the selected recipe's ingredients
    const [ingredients, setIngredients] = useState([]);
    const [showRecipe, setShowRecipe] = useState(false);
    //input new recipe
    const [recipePos, setRecipePos] = useState([0])
    const [showForm, setShowform] = useState(false);
    const [ingCounter, setIngCounter] = useState(0);
    const [ingInputs, setIngInputs] = useState([<RecipeIngredientForm recipeid={0} className={styles.buttonGeneral2} clickHandler={handleRemoveIngredient} />]);
    const [noteCounter, setNoteCounter] = useState(0);
    const [instCounter, setInstCounter] = useState(0);
    const [recNotes, setRecNotes] = useState([<RecipeNote num={noteCounter}/>]);
    const [recInstructions, setRecInstructions] = useState([<RecipeInstruction num={instCounter}/>]);
    const [hasNote, setHasNote] = useState(false);
    //edit recipe
    const [editRecipe, setEditRecipe] = useState(false);
    const [instList, setInstList] = useState([]);
    const [notesList, setNotesList] = useState([]);
    const [triggerChange, setTriggerChange] = useState(0);
    //to show and hide top part/freeze it being clickable while edit form out
    const [showTopList, setShowTopList] = useState(true);
    const [showRecList, setShowRecList] = useState(true);
    
    //DB QUERYING (/API ACCESSING)/ASYNC FUNCTIONS:

    //get saved recipes from two tables, set list of recipe names to be displayed
    async function getPageData(){
        //the url/path where the db connection function is
        const apiURLEndpoint = 'http://localhost:3000/api/getrecipes';
        const response = await fetch(apiURLEndpoint);
        const res = await response.json();
        //items is the key to access the value that is the array of ingredient objects
        console.log(res.items); 
        setDataResponse1(res.items[0]);
        setDataResponse2(res.items[1]); 
        setNamesList(res.items[0].map((r,idx) => {return (r.recipe_name)}));
    }
    
    //calls above async function at beginning and when triggered
    useEffect(() => {
        getPageData();
    }, [triggerChange]);

    //force a state update
    useEffect(() => {
        //console.log(editRecipe);
    }, [editRecipe]);

    //update one or more rows in db
    async function updateRowInDB(queryStr){
        const qry = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({q: queryStr}),
        };
        //the url/path where the db connection function is
        const apiURLEndpoint = 'http://localhost:3000/api/updaterecipe';
        const response = await fetch(apiURLEndpoint, qry);
        const res = await response.json();
        //setTriggerChange(triggerChange+1);
        console.log(res.items);
        if (res.error){
            console.log(res.error);
        } else {
            if (editRecipe){
                setEditRecipe((editRecipe) => !editRecipe);
            }
            if (showRecipe){
                setShowRecipe((showRecipe) => !showRecipe);
            }
            if (!showTopList) {
                setShowTopList((showTopList) => !showTopList);
            }
        }
        //getPageData();
    }

    //add 1 or more new rows to database
    async function addToDataBase(qryStr, rName){    
        let qry = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({q: qryStr}),
        };
        //the url/path where the db connection function is
        const apiURLEndpoint = 'http://localhost:3000/api/add-recipe';
        let response = await fetch(apiURLEndpoint, qry);
        let res = await response.json();
        console.log(res);
        if (res.error){
            console.log(res.error);
        } else {
            setNamesList([...namesList, rName]);
            setTriggerChange(triggerChange+1);
            if (!showRecList) {
                setShowRecList((showRecList) => !showRecList);
            }
        }
    }

    //delete recipe from DB
    async function doTheDel(queryStr){
        const qry = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({q: queryStr}),
        };
        //the url/path where the db connection function is
        const apiURLEndpoint = 'http://localhost:3000/api/updaterecipe';
        const response = await fetch(apiURLEndpoint, qry);
        const res = await response.json();
        console.log(res.items);
        if (showRecipe){
            setShowRecipe((showRecipe) => !showRecipe);
        }
        if(editRecipe){
            setEditRecipe((editRecipe) => !editRecipe);
        }
        if (!showTopList){
            setShowTopList((showTopList) => !showTopList);
        }
        setTriggerChange(triggerChange+1);
    }

    //delete any ingredients from DB that were removed during an recipe update
    async function delDuringUpdate(queryStr){
        const qry = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({q: queryStr}),
        };
        //the url/path where the db connection function is
        const apiURLEndpoint = 'http://localhost:3000/api/updaterecipe';
        const response = await fetch(apiURLEndpoint, qry);
        const res = await response.json();
        console.log(res.items);
    }

    //HANDLERS:

    //remove an ingredient input section from the recipe adding form
    function handleRemoveIngredient(e){
        e.preventDefault();
        const itm = parseInt(e.target.id);
        console.log(itm);
        if (itm != 0){
            //find index of item to remove (id != index)
            const itmIdx = recipePos.indexOf(itm);
            //const secondHalfArr = ingInputs.slice((itm+1));
            const tempArr = ingInputs.slice(0, itmIdx).concat(ingInputs.slice((itmIdx+1)));
            console.log(tempArr);
            setIngInputs(tempArr);
            //adjust the array of ingredient ids
            setRecipePos([...recipePos.slice(0, itmIdx), itmIdx+1]);
        }
    }
 
    //close displayed recipe
    function handleCloseRecipe(){
        if (editRecipe){
            setEditRecipe((editRecipe) => !editRecipe);
        }
        setShowRecipe((showRecipe) => !showRecipe);
    }

    //display recipe editing form
    function handleEditRecipe(e){
        e.preventDefault();
        //console.log(ingredientList);
        if (!editRecipe){
            setEditRecipe((editRecipe) => !editRecipe);
        }
        if (showRecipe){
            setShowRecipe((showRecipe) => !showRecipe);
        }
        if (showTopList) {
            setShowTopList((showTopList) => !showTopList);
        }
        if (showRecList) {
            setShowRecList((showRecList) => !showRecList);
        }
    }

    //display recipe when its name in list is clicked
    function handleRecipeClick(rn, idx){
        console.log(rn);
        //set name of recipe to display
        setDisplayRecipe(rn);
        //compile the ingredients
        collectRecipeIngredients(rn, idx);
        setShowRecipe(true);
    }

    //toggle between showing the recipe entry form and not showing it
    function handleToggleForm(){
        setShowform((showForm) => !showForm);
        
        setShowRecList((showRecList) => !showRecList);
        
    }

    //add new ingredient input section to add new recipe form
    function handleAddIngredient(e){
        e.preventDefault();
        setRecipePos([...recipePos, ingCounter + 1]);
        setIngInputs([...ingInputs, <RecipeIngredientForm recipeid={ingCounter+1} clickHandler={handleRemoveIngredient} />]);
        setIngCounter(ingCounter + 1);
    }

    //add new input for adding a recipe instruction
    function handleAddInstruction(e){
        e.preventDefault();
        setRecInstructions([...recInstructions, <RecipeInstruction num={instCounter +1} />]);
        setInstCounter(instCounter + 1);
    }

    //add new input for recipe note entry
    function handleAddNote(e){
        e.preventDefault();
        if (!hasNote) {
            setHasNote(true);
        }
        setRecNotes([...recNotes, <RecipeNote num={noteCounter+1}/>]);
        setNoteCounter(noteCounter +1);
    }

    //handle submission of new recipe--have input data processed/preped for DB, have query statements made, call func to add to DB
    function handleSubmit(e){
        e.preventDefault();
        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        //as a plain object:
        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson);
        const recipeInfo = processNotesAndInstructions(formJson, instCounter, noteCounter);
        console.log(recipeInfo);
        const ingredientsProcessed = prepRecipeIngredientsForDB(formJson, ingCounter);
        console.log(ingredientsProcessed)
        const insertStatements = makeInputQueries(ingredientsProcessed);
        console.log(insertStatements);
        const recipeName = formJson.recipe_name;
        console.log(recipeName);
        addToDataBase([recipeInfo, ...insertStatements], recipeName);
    }

    //take data from edit form, process it, create queries, call func for DB 
    function handleEditSubmit(e){
        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        //as a plain object:
        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson);
        //processes notes and instructions from submitted form
        const notesInstQuery = processNotesAndInstForUpdate(formJson);
        //process ingredients from form 
        const ingObjsParsed = prepRecipeIngredientsForDB(formJson, formJson.item_count);
        console.log(ingObjsParsed);
        //console.log(ingObjsParsed); = ALL GOOD
        //items to update
        const ingItemsToUpdate = ingObjsParsed.slice(0, ((formJson.item_count) - (formJson.new_item_count)));
        //items to add --> make into insert queries
        const ingItemsToInsert = ingObjsParsed.slice(((formJson.item_count) - (formJson.new_item_count)));
        //list of which items to delete
        const toDelList = formJson.to_del.split('XXXX').slice(1);
        console.log(ingItemsToUpdate);
        //console.log(toDelList);
        console.log(ingredientList);
        //console.log(ingItemsToInsert);
        const updateAndDelQueries = makeIngredientUpdateQs(ingItemsToUpdate, ingredientList, toDelList);
        console.log(updateAndDelQueries);
        //console.log(updateQueries);
        //console.log(inputQueries);
        //compile the list of queries to make-->start with update to recipe info
        const queryStrs = [notesInstQuery, ...updateAndDelQueries[0]];
        if (ingItemsToInsert != []){
            const inputQueries = makeInputQueries(ingItemsToInsert);
            addToDataBase(inputQueries);
        }

        if (updateAndDelQueries[1] != []){
            delDuringUpdate(updateAndDelQueries[1]);
        }

        if (queryStrs != []){
            console.log(queryStrs);
            updateRowInDB(queryStrs);
        }
        setTriggerChange(triggerChange+1);
    }

    function handleCancelEdit(e){
        e.preventDefault();
        setEditRecipe((editRecipe) => !editRecipe);
        //setShowRecipe((showRecipe) => !showRecipe);
        setShowTopList((showTopList) => !showTopList);
        if (!showRecList) {
            setShowRecList((showRecList) => !showRecList);
        }
    }

    //create SQL queries for deleting a recipe (one statement for each table recipe stored in) + confirm choice to delete with user before allowing delete to proceed
    function handleDeleteRecipe(e){
        e.preventDefault();
        const sqlDelStrs = ["DELETE FROM recipe_ingredients WHERE recipe_name = '" + displayRecipe + "'", "DELETE FROM recipe_info WHERE recipe_name = '" + displayRecipe + "'"];
        //console.log(sqlDelStrs);
        let moveFwdDel = window.confirm("Are you sure you want to delete " + displayRecipe + " from your recipes?");
        if (moveFwdDel) {
            doTheDel(sqlDelStrs); 
        }
    }

    //HELPERS:

    //collect data for specified recipe--find and process ingredients from one table's data and instructions + notes from other table data
    function collectRecipeIngredients(rName, idx){
        let ingList = [];
        //make list of all ingredient objects where recipe_name matches selected recipe
        for (let x of dataResponse2){
            console.log(x);
            if (x.recipe_name == rName){
                ingList.push(x);
            }
        }
        //list of ingredient objects for selected recipe
        setIngredientList([...ingList]);
        //adds a quantity property with units to display
        const preppedIngredients = parseItemsToShow(ingList);
        console.log(ingList);
        console.log(preppedIngredients);
        //list items for listing ingredients
        const ingredientLIs =preppedIngredients.map((ing, indx) => {
            if (ing.descriptors == ""){
                return (<li key={indx}>{ing.quantity + "  " + ing.ingredient_name}</li>);
            } else {
                return(<li key={indx}>{ing.quantity + "  " + ing.ingredient_name + ",  " + ing.descriptors}</li>);
            }
        });
        setIngredients(ingredientLIs);
        let instrArr = dataResponse1[idx].instructions.split('XXXX');
        instrArr = instrArr.slice(1);
        //array of instruction strings
        setInstList([...instrArr]);
        const instr = instrArr.map((i, ix) => {
            return(<li key={ix}>{i}</li>);
        })
        //instructions list items
        setCurrentInstructions([...instr]);
        //console.log(instr);
        let notesArr;
        if (dataResponse1[idx].notes != null){
            notesArr = dataResponse1[idx].notes;
        } else {
            notesArr = "";
        }
        notesArr = notesArr.split("XXXX");
        notesArr = notesArr.slice(1);
        setNotesList([...notesArr]);
        const notes = notesArr.map((y, i) => {
            return(<li key={i}>{y}</li>);
        });
        setCurrentNotes(notes);
        //console.log(notes);
    }

    return (
        <>
            <Head>
                <title>Food Manager App - Saved Recipes</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
            </Head>
            <Layout pNum={3}>
            <div className={styles.wholePage}>
                {showRecList ? <div id={styles.myRecList}>
                <h1 className={styles.pageHead}>My Recipes</h1>
                    {<ul className={styles.savedRecList}> 
                        {showTopList ? 
                        namesList.map((r, idx) => 
                            <li className={styles.recList} key={idx} ><FavBtn itm={dataResponse1[idx]} /><section style={{display: "inline"}} onClick={() => handleRecipeClick(r, idx)}>{r}</section></li>
                        ) : null}
                    </ul>}
                </div> : null}
                
                {showRecipe ? <div id="current-recipe" className={styles.recDisplay}>
                    <button type="button" className={styles.closeRecBtn} onClick={handleCloseRecipe}>X</button>
                        <h3>{displayRecipe}</h3>
                        <ul>
                            {ingredients}
                        </ul>
                        <h4>Instructions</h4>
                        <ol>
                            {currentInstructions}
                        </ol>
                        <h4>Notes:</h4>
                        <ul>
                            {currentNotes}
                        </ul>  
                        <button className={styles.buttonGeneral} type="button" onClick={handleEditRecipe}>Edit Recipe</button>   
                        <button className={styles.buttonGeneral} type="button" onClick={handleDeleteRecipe}>Delete Recipe</button>
                </div> : null}
                <br/>
                {editRecipe ? <div id={styles.wholeForm}><form onSubmit={handleEditSubmit}><UpdateRecipeInputForm ings={ingredientList} notes={notesList} insts={instList} /><button className={styles.buttonGeneral} type='button' onClick={handleCancelEdit}>Cancel</button><button className={styles.buttonGeneral} type="button" onClick={handleDeleteRecipe}>Delete Recipe</button></form></div> : null}
                <div id={styles.recipeinput} >
                    {editRecipe ? null : <button className={showForm ? styles.cancelAddRecipeBtn : styles.addRecipeBtn} onClick={handleToggleForm}>{showForm ? "X" : "+ Add Recipe"}</button>}
                    <br/>
                    {showForm ? 
                    <div id={styles.newrecipe}>
                        <form className={styles.recipeInput} method="post" onSubmit={handleSubmit}>
                            <label className={styles.recName} htmlFor='recipe_name'>Recipe Name: </label>
                            <input size={50} type='text' id='recipe_name' name='recipe_name' /> <br/>
                            {ingInputs}
                            <button type="button" className={styles.buttonGeneral} onClick={handleAddIngredient}>Add Ingredient</button>
                            <br/><br/>
                            <div className={styles.instAndNotes}>
                                <label className={styles.miscLabel}>Instructions:</label>
                                <ol className={styles.instList}>
                                {recInstructions.map((itm, idx) => {
                                    return <li key={"instr"+idx}>{itm}</li>;
                                })}
                                </ol>
                                <button type="button" className={styles.buttonGeneral2} onClick={handleAddInstruction}>Add Another Instruction</button>
                                <br/><br/>
                                <label className={styles.miscLabel}>Notes:</label>
                                {recNotes}
                                <button type="button" className={styles.buttonGeneral2} onClick={handleAddNote}>{hasNote ? "Add Another Note" : "Add Notes"}</button>
                            </div>
                            <br/><br/>
                            <button className={styles.buttonGeneral} type="submit">Save Recipe</button>
                            <button className={styles.buttonGeneral} type="reset">Clear</button>
                        </form>
                    </div> : null}

                    {/* <form method="post" onSubmit={handleSubmit}>
                        <label htmlFor='recipe_name'>Recipe Name: </label>
                        <input type='text' id='recipe_name' name='recipe_name' />
                        
                        <button onClick={handleAddIngredient}>Add Ingredient</button>
                    </form> */}
                </div>
            </div>
            </Layout>
        </>
    );
}