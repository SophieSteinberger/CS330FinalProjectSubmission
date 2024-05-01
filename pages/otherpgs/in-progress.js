import Head from "next/head";
import { useEffect, useState } from "react";
import { parseItemsToShow } from "../conversions/conversions";
import ChecklistItem from "../components/checklist-item";
import Scaler from "../components/recipe-scaler";
import Layout from "../components/layout";
import styles from '../../styles/InProgressRecipesPage.module.css';

export default function InProgressRecipesPage(){
    //display recipies
    const [dataResponse1, setDataResponse1] = useState([]);
    const [dataResponse2, setDataResponse2] = useState([]);
    const [namesList, setNamesList] = useState([]);
    const [displayRecipe, setDisplayRecipe] = useState("");
    const [currentInstructions, setCurrentInstructions] = useState([]);
    const [currentNotes, setCurrentNotes] = useState([]);
    const [ingredientList, setIngredientList] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [showRecipe, setShowRecipe] = useState(false);

    const [editRecipe, setEditRecipe] = useState(false);
    const [instList, setInstList] = useState([]);
    const [notesList, setNotesList] = useState([]);
    const [triggerChange, setTriggerChange] = useState(0);
    
    const [showScaler, setShowScaler] = useState(false);
    const [showRegRecipe, setShowRegRecipe] = useState(false);
 
    //DB QUERYING (/API ACCESSING)/ASYNC FUNCTIONS:

    //get in-progress recipes from two tables, set list of recipe names to be displayed
    async function getPageData(){
        //the url/path where the db connection function is
        const apiURLEndpoint = 'http://localhost:3000/api/get-in-progress';
        const response = await fetch(apiURLEndpoint);
        const res = await response.json();
        //items is the key to access the value that is the array of ingredient objects
        console.log(res.items); 
        setDataResponse1(res.items[0]);
        setDataResponse2(res.items[1]); 
        setNamesList(res.items[0].map((r) => {return (r.recipe_name)}));
    }

    //call above function at beginning and when triggered
    useEffect(() => {
        //inside of useEffect run the async function
        getPageData();
    }, []);

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
        getPageData();
        if (showRecipe){
            setShowRecipe((showRecipe) => !showRecipe);
        }
        setTriggerChange(triggerChange+1);
    }

    //HANDLERS:

    //display recipe when name in list clicked
    function handleRecipeClick(rn, idx){
        console.log(rn);
        setDisplayRecipe(rn);
        collectRecipeIngredients(rn, idx);
        setShowRecipe(true);
        setShowRegRecipe(true);
    }

    //close the dispayed recipe + go back to showing recipes list
    function handleCloseRecipe(){
        if (editRecipe){
            setEditRecipe((editRecipe) => !editRecipe);
        }
        setShowRecipe((showRecipe) => !showRecipe);
        if (showRegRecipe) {
            setShowRegRecipe((showRegRecipe) => !showRegRecipe);
        }
        if (showScaler) {
            setShowScaler((showScaler) => !showScaler);
        }
    }

    //close the recipe display for scaling recipe ingredients
    function handleCloseScalerSection(e){
        e.preventDefault();
        setShowRegRecipe((showRegRecipe) => !showRegRecipe);
        setShowScaler((showScaler) => !showScaler);

    }

    //replace the regular recipe display with a scalable version
    function handleScaleRecipe(){
        //console.log("scale recipe");
        setShowRegRecipe((showRegRecipe) => !showRegRecipe);
        setShowScaler((showScaler) => !showScaler);
        //console.log(makeObjsToScaleAndShow(ingredientList, 1));
    }

    //create SQL queries to delete recipe from both tables it is stored in (the table storing the ingredients and the table storing the other recipe info) + confirm choice to delete with user
    function handleRemoveRecipe(e){
        e.preventDefault();
        const sqlDelStrs = ["DELETE FROM in_progress WHERE recipe_name = '" + displayRecipe + "'", "DELETE FROM in_progress_info WHERE recipe_name = '" + displayRecipe + "'"];
        //console.log(sqlDelStrs);
        let moveFwdDel = window.confirm("Are you sure you want to delete " + displayRecipe + " from your in-progress recipes?");
        if (moveFwdDel) {
            doTheDel(sqlDelStrs); 
        }
        
    }

    //HELPERS:

    //collect data for specified recipe--find and process ingredients from one table's data and instructions + notes from other table data
    function collectRecipeIngredients(rName, idx){
        let ingList = [];
        for (let x of dataResponse2){
            if (x.recipe_name == rName){
                ingList.push(x);
            }
        }
        setIngredientList(ingList);
        const preppedIngredients = parseItemsToShow(ingList);
        console.log(preppedIngredients);
        const ingredientLIs = preppedIngredients.map((ing, indx) => {
            if (ing.descriptors == ""){
                return (<li key={indx}>{ing.quantity + "  " + ing.ingredient_name}</li>);
            } else {
                return(<li key={indx}>{ing.quantity + "  " + ing.ingredient_name + ",  " + ing.descriptors}</li>);
            }
        });
        setIngredients(ingredientLIs);
        let instrArr = dataResponse1[idx].instructions.split('XXXX');
        instrArr = instrArr.slice(1);
        setInstList([...instrArr]);
        const instr = instrArr.map((i, ix) => {
            return <ChecklistItem key={ix} inst={i} isDone={false} />
        })
        setCurrentInstructions(instr);
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
    }


    return (
        <>
            <Layout pNum={4}>
            <Head>
                <title>Food Manager App - In-Progress Recipes</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
            </Head>
            <div id={styles.wholePage}>
            {showRecipe ? null :
                <div id={styles.recList}>
                    <h1>In-Progress Recipes</h1>
                    {<ul>
                        {namesList.map((r, idx) => 
                            <li key={idx} onClick={() => handleRecipeClick(r, idx)} >{r}</li>
                        )}
                    </ul>}
                </div>}
                
                {showRecipe ? <div id={styles.currentRecipe}>
                    <button id={styles.closeBtn} type="button" onClick={handleCloseRecipe}>X</button>
                        
                        <h3>{displayRecipe}</h3>
                        
                        {showRegRecipe? <div>
                            <button id={styles.scaleBtn} type="button" onClick={handleScaleRecipe}>Scale Recipe</button> 
                            <ul>
                            {ingredients}
                        </ul>
                        </div> : null}
                        {showScaler ? <div> <div id={styles.scaler}><Scaler ings={ingredientList} handleCloseScaler={handleCloseScalerSection} handleFinishUpdate={handleCloseRecipe} /></div> <br/><p><strong>Note:</strong>The amounts of ingredients mentioned in the instructions are <strong>not</strong> adjusted with the listed ingredients listed above</p> </div>: null}
                        <h4>Instructions</h4>
                        <ol>
                            {currentInstructions}
                        </ol>
                        <h4>Notes:</h4>
                        <ul>
                            {currentNotes}
                        </ul>   
                        <button className={styles.generalBtn} type="button" onClick={handleRemoveRecipe}>Remove from in-progress recipes</button>
                </div> : null}
            </div>
            </Layout>
        </>
    );
}