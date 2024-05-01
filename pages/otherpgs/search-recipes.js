import Head from "next/head";
import { useEffect, useState, useRef } from "react";
import SearchRecipesForm from "../components/recipe-search-form";
import { prepTastyRecForDB } from "../conversions/helpers";
import { parseItemsToShow, parseTastyItemsToShow} from "../conversions/conversions";
import {getTastyAPIConnInfo} from '../../lib/tasty-conn';
import Layout from "../components/layout";
import styles from '../../styles/SearchRecipesPage.module.css';

export default function SearchRecipesPage(){
    const [dataResponse1, setDataResponse1] = useState([]);
    const [dataResponse2, setDataResponse2] = useState([]);
    const [dataResponse3, setDataResponse3] = useState([]);
    const [namesList1, setNamesList1] = useState([]);
    //to hold names of recipes that match search
    const [namesList2, setNamesList2] = useState([]);
    const [showSearchForm, setShowSearchForm] = useState(true);
    //
    const [tastyDataResponse, setTastyDataResponse] = useState([]);
    const [cleanTastyData, setCleanTastyData] = useState([]);
    //show recipe for tasty recipe (when toggling showing of tasty or save recipe check if the other is showing and adjust both accordingly)
    const [showTastyRecipe, setShowTastyRecipe] = useState(false);
    const [tastyIngsList, setTastyIngsList] = useState([]);
    const [tastyInstructionsList, setTastyInstructionsList] = useState([]);
    const [currentTastyRec, setCurrentTastyRec] = useState({});
    const [currentTastyRecName, setCurrentTastyRecName] = useState((""));
    const [showSearchRes, setShowSearchRes] = useState(false);
    //
    const [displayRecipe, setDisplayRecipe] = useState("");
    const [currentInstructions, setCurrentInstructions] = useState([]);
    const [currentNotes, setCurrentNotes] = useState([]);
    const [ingredientList, setIngredientList] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [showRecipe, setShowRecipe] = useState(false);
    const [instArr, setInstArr] = useState([]);
    const [nsArr, setNsArr] = useState([]);

    const [expiringList, setExpiringList] = useState([]);
    const [whatIngInRec, setWhatIngInRec] = useState([]);

    const [triggerChange, setTriggerChange] = useState(0);

    const searchFormRef = useRef(null);

    //DB QUERYING/API ACCESSING/ASYNC FUNCTIONS:
    
    //initial function -- getting recipes data and user's items from SQL db
    useEffect(() => {
        async function getPageData(){
            //the url/path where the db connection function is
            const apiURLEndpoint = 'http://localhost:3000/api/getrecipes';
            const response = await fetch(apiURLEndpoint);
            const res = await response.json();
            //items is the key to access the value that is the array of ingredient objects
            setDataResponse1(res.items[0]);
            setDataResponse2(res.items[1]); 
            console.log(res.items[1]);
            setNamesList1(res.items[0].map((r,idx) => {return (r.recipe_name)}));
            setDataResponse3(res.items[2]);
            //order user items by date expiring
            let dataByExp = parseItemsToShow(res.items[2]).map((itm, idx) => {
                return {
                    ...itm,
                    exp_date : new Date(itm.exp_date),
                };
            });
            dataByExp = dataByExp.sort((a, b) => a.exp_date - b.exp_date);
            dataByExp = dataByExp.map((itm) => {
                return {
                    ...itm,
                    exp_date : itm.exp_date.getFullYear() + "-" + (itm.exp_date.getMonth()+1) + "-" + itm.exp_date.getDate(),
                }
            });
            setExpiringList([...dataByExp]);
            //only get data from tasty API (without a user search) at beginning
            if (cleanTastyData.length == 0){
                initialSearchPull([dataByExp[0].item_name, dataByExp[1].item_name]);
            }
        }
        //inside of useEffect run the async function
        getPageData();
    }, []);

    //get recipes from Tasty's API that use the two soonest expiring ingredients AND create lists of which expiring items are used in the recipe
    async function initialSearchPull(params){
        //do query for each of the items in exp list, combine the results to show initially
        searchMyRecipes(params);
        let initialResults = [];
        for (let a = 0; a < 2; a++){
            const baseURL = 'https://tasty.p.rapidapi.com/recipes/list?from=0&size=20';
            let qryURL = baseURL;
            qryURL += "&tags=under_30_minutes";
            const spaceCode = "%20";
            const commaCode = "%2C";
            let qParam = params[a].replace(/ /g, spaceCode);
            //console.log(qParam);
            const qParamUrl = "&q=" + qParam;
            qryURL += qParamUrl;
            const options = getTastyAPIConnInfo();
            try {
                const response = await fetch(qryURL, options);
                const result = await response.text();
                console.log(JSON.parse(result).results);
                let processedRecipes = cleanTastyDataResponse2(JSON.parse(result).results);
                //const newFuncData = cleanTastyDataResponse2(JSON.parse(result).results);
                initialResults = [...processedRecipes];
            } catch (error) {
                console.error(error);
            }
        }
        if (cleanTastyData.length <= 40){
            setCleanTastyData(initialResults);
            console.log(initialResults);
        }
        let recNames = {};
        for (let param of params){
            for (let r of initialResults) {
                for (let i of r.ingredients){
                    //look for recipe ingredients that match the param item names (or are very close) 
                    if ((i.ingredient_name.toLowerCase() == param.toLowerCase()) || (i.ingredient_name.toLowerCase().includes(param.toLowerCase())) || (param.toLowerCase().includes(i.ingredient_name.toLowerCase())) || (param.substring(0, (param.length - 2)).toLowerCase().includes(i.ingredient_name.toLowerCase()))){
                        if(i.recipe_name in recNames){
                            if (!recNames[i.recipe_name].includes(param)){
                                recNames[i.recipe_name].push(param);
                            }
                        } else{
                            recNames[i.recipe_name] = [param];
                        }
                    }
                }
            }
        }
        setWhatIngInRec({...recNames});
        console.log(recNames);
        
        if (!showSearchRes){
            setShowSearchRes((showSearchRes) => !showSearchRes);
        }
    }

    //used to make state changes take effect
    useEffect(() => {
        console.log(tastyDataResponse.length);
    }, [tastyDataResponse, triggerChange])

    //Create + use query with the Tasty API
    //https://rapidapi.com/apidojo/api/tasty/ --> queries with or without the 30-min or under
    //with tag: const url = 'https://tasty.p.rapidapi.com/recipes/list?from=0&size=20&tags=under_30_minutes';
    //without: 'https://tasty.p.rapidapi.com/recipes/list?from=0&size=20';
    //add on to search url: &q=Eggplant%20Parmesan'; where %20 is a space 
    async function getTastyApiData(p, fst){
        const baseURL = 'https://tasty.p.rapidapi.com/recipes/list?from=0&size=20';
        let qryURL = baseURL;
        if (fst){
            qryURL += "&tags=under_30_minutes"
        }
        const spaceCode = "%20";
        const commaCode = "%2C";
        let qParam = "";
        if (p.length > 1){
            for(let j of p) {
                console.log(j);
                qParam += j.replace(/ /g, spaceCode) + commaCode + spaceCode;
            }
            qParam = qParam.slice(0, qParam.length - 6);
        }else {
            qParam = p[0].replace(/ /g, spaceCode);
        }
        
        //console.log(qParam);
        const qParamUrl = "&q=" + qParam;
        qryURL += qParamUrl;

        console.log(qryURL);
        const options = getTastyAPIConnInfo();
        try {
            const response = await fetch(qryURL, options);
            const result = await response.text();
            console.log(JSON.parse(result).results);
            setTastyDataResponse(JSON.parse(result).results);
            const processedRecipes = cleanTastyDataResponse2(JSON.parse(result).results);
            //const newFuncData = cleanTastyDataResponse2(JSON.parse(result).results);
            setCleanTastyData(processedRecipes);
            console.log(processedRecipes);
            let recNames = {};
            for (let param of p){
                for (let r of processedRecipes) {
                    for (let i of r.ingredients){
                        //console.log(p);
                        //console.log(ob.ingredient_name.toLowerCase());
                        if ((i.ingredient_name.toLowerCase() == param.toLowerCase()) || (i.ingredient_name.toLowerCase().includes(param.toLowerCase())) || (param.toLowerCase().includes(i.ingredient_name.toLowerCase()))){
                            if(i.recipe_name in recNames){
                                recNames[i.recipe_name].push(param);
                            } else{
                                recNames[i.recipe_name] = [param];
                            }
                        }
                    }
                }
            }
            setWhatIngInRec({...recNames})
            
        } catch (error) {
            console.error(error);
        }
    }

    //save recipe to database
    async function addTastyRecToDB(rec){
        let qry = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({q: rec}),
        };
        //the url/path where the db connection function is
        const apiURLEndpoint = 'http://localhost:3000/api/add-recipe';
        let response = await fetch(apiURLEndpoint, qry);
        let res = await response.json();
        console.log(res);
        if (res.error){
            console.log(res.error);
            if (res.error.includes("Duplicate entry")){
                alert("This recipe is already saved");
            }
        } else {
            alert("Your Recipe Has Been Added!");
            if (!showSearchRes){
                setShowSearchRes((showSearchRes) => !showSearchRes);
            }
            if (!showSearchForm){
                setShowSearchForm((showSearchForm) => !showSearchForm)
            }
            if (showTastyRecipe){
                setShowTastyRecipe((showTastyRecipe) => !showTastyRecipe);
            }
            if (showRecipe){
                setShowRecipe((showRecipe) => !showRecipe);
            }
        }
    }

    //HANDLERS:

    //when recipe name clicked collect data for that recipe + display it
    function handleRecipeClick(rn, idx){
        console.log(rn);
        setDisplayRecipe(rn);
        collectRecipeIngredients(rn, idx);

        setShowRecipe(true);
        if (showTastyRecipe == true) {
            setShowTastyRecipe((showTastyRecipe) => !showTastyRecipe);
        }
        setShowTastyRecipe(false);
        if (showSearchRes == true) {
            setShowSearchRes((showSearchRes) => !showSearchRes);
        }
        setShowSearchRes(false);
        if (showSearchForm == true) {
            setShowSearchForm((showSearchForm) => !showSearchForm);
        }
        setShowSearchForm(false);

        setTriggerChange(triggerChange+1);
    }
    
    //close recipe dispay + return to search form and recipe list
    function handleCloseRecipe(){
        setShowRecipe((showRecipe) => !showRecipe);
        if (!showSearchRes) {
            setShowSearchRes((showSearchRes) => !showSearchRes);
        }

        if (!showSearchForm) {
            setShowSearchForm((showSearchForm) => !showSearchForm);
            //searchFormRef.current.reset();
        }
    }

    //same as above, but for the recipes coming from Tasty API
    function handleCloseTastyRecipe(){
        setShowTastyRecipe((showTastyRecipe) => !showTastyRecipe);
        if (!showSearchRes) {
            setShowSearchRes((showSearchRes) => !showSearchRes);
        }
        if (!showSearchForm) {
            setShowSearchForm((showSearchForm) => !showSearchForm);
            //searchFormRef.current.reset();
        }
    }

    //handler for recipe query submission
    function handleSubmitSearch(e){
        e.preventDefault();
        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        //as a plain object:
        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson);
        //const numTerms = Object.keys(formJson).length;
        let params = [];
        let fastRecipes = false;
        for (let i in formJson){
            if (i == "fast_recipe") {
                fastRecipes = true;
            } else{
                if(formJson[i] != ""){
                    params.push(formJson[i]);
                }
            }
        }
        if (params != []){
            // get the api data
            getTastyApiData(params, fastRecipes);
            searchMyRecipes(params);
            if (!showSearchRes){
                setShowSearchRes((showSearchRes) => !showSearchRes);
            }
        }
    }

    //process recipe object to display -->set states that will display recipe AND set the processed object in a state var in case want to save recipe
    function handleTastyRecClick(rec, idx){
        //console.log(rec);
        setCurrentTastyRecName(rec.recipe_name);
        setTastyIngsList(parseTastyItemsToShow(rec.ingredients).map((ing, indx) => {
            if ("items" in ing) {
                return (<li key={indx}>{ing.quantity + "  " + ing.ingredient_name}{(ing.descriptors == "") ? "" : ",  " + ing.descriptors} </li>);
            } else {
                return (<li key={indx}>{ing.quantity + "  " + ing.ingredient_name}{(ing.descriptors == "") ? "" : ",  " + ing.descriptors} </li>);
            }
        }));
        
        const instr = rec.instructions.map((i, ix) => {
            return(<li key={ix}>{i}</li>);
        })
        setTastyInstructionsList([...instr]);
        
        setShowTastyRecipe((showTastyRecipe) => !showTastyRecipe);
        if (showRecipe){
            setShowRecipe((showRecipe) => !showRecipe);
        }

        if (showSearchRes) {
            setShowSearchRes((showSearchRes) => !showSearchRes);
        }
        
        if (showSearchForm) {
            setShowSearchForm((showSearchForm) => !showSearchForm);
        }

        console.log(rec);
        setCurrentTastyRec(rec);
    }

    //save recipe to the in-progress recipe (instead of the regular saved recipes)
    function handleAddToMaking(e) {
        e.preventDefault();
        const tastyAddQs = prepTastyRecForDB(currentTastyRec, "p");
        console.log(tastyAddQs);
        addTastyRecToDB(tastyAddQs);
    }

    //save recipe to the in-progress recipe (instead of the regular saved recipes) -- from own recipes instead of the Tasty API ones
    function handleAddToMaking2(e) {
        e.preventDefault();
        const rec = {
            recipe_name: displayRecipe,
            recipe_by: null,
            instructions: instArr,
            ingredients: parseItemsToShow(ingredientList),
            notes: nsArr,
        };
        console.log(rec);
        const addQrys = prepTastyRecForDB(rec, "p");
        console.log(addQrys);
        addTastyRecToDB(addQrys);
    }

    //Add recipe to regular saved recipes (not the in-progress ones)
    function handleAddToSaved(e){
        e.preventDefault();
        const addQueries = prepTastyRecForDB(currentTastyRec, "s");
        console.log(addQueries);
        addTastyRecToDB(addQueries);
    }

    //OTHER/HELPER FUNCTIONS:

    //Search user's recipes pulled from DB for any that contain the named ingredients
    function searchMyRecipes(params){
        console.log(dataResponse2);
        let recNames = {};
        for (let p of params){
            for (let ob of dataResponse2){
                if ((ob.ingredient_name.toLowerCase() == p.toLowerCase()) || (ob.ingredient_name.toLowerCase().includes(p.toLowerCase())) || (p.toLowerCase().includes(ob.ingredient_name.toLowerCase()))){
                    if(ob.recipe_name in recNames){
                        recNames[ob.recipe_name].push(p);
                    } else{
                        recNames[ob.recipe_name] = [p];
                    }
                }
            }
        }
        let count = 0;
        let tempList = [];
        for (let r in recNames){
            tempList.push([<li key={"recipe" + count} id={"recipe" + count} onClick={() => {handleRecipeClick(r)}}><strong>{r}</strong>   (uses: {recNames[r].join(", ")})</li>]);
            count += 1;
        }
        setNamesList2([...tempList]);
        setTriggerChange(triggerChange+1);
    }

    //get all the data for the specified recipe (ingredients are in differet db table than other recipe info)
    function collectRecipeIngredients(rName){
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
            return(<li key={indx}>{ing.quantity + "  " + ing.ingredient_name + ",  " + ing.descriptors}</li>);
        });
        setIngredients(ingredientLIs);
        let idx = dataResponse1.findIndex((recinfo) => recinfo.recipe_name == rName);
        //console.log(idx);
        let instrArr = dataResponse1[idx].instructions.split('XXXX');
        instrArr = instrArr.slice(1);
        setInstArr([...instrArr]);
        const instr = instrArr.map((i, ix) => {
            return(<li key={ix}>{i}</li>);
        })
        setCurrentInstructions(instr);

        let notesArr = dataResponse1[idx].notes.split("XXXX");
        notesArr = notesArr.slice(1);
        setNsArr([...notesArr]);
        const notes = notesArr.map((y, i) => {
            return(<li key={i}>{y}</li>);
        });
        setCurrentNotes(notes);
    }


    return (
        <>
            <Head>
                <title>Food Manager App - Search Recipes</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
            </Head>
            <Layout pNum={2}>
            <div id={styles.wholePage}>
                <div id={styles.searchAndRes}>
                    <div id={styles.topContainer}>
                        {showSearchForm ? <form ref={searchFormRef} id={styles.searchForm} onSubmit={handleSubmitSearch}>
                            <SearchRecipesForm />
                        </form> : null}
                        {showSearchRes && showSearchForm ? <div id={styles.expSoon}>
                                    <p>Expiring Soon:</p>
                                    <p>{expiringList[0].item_name + "  (expires " + expiringList[0].exp_date + ")"}</p>
                                    <p>{expiringList[1].item_name + "  (expires " + expiringList[1].exp_date + ")"}</p>
                                </div> : null}
                    </div>

                    <br/>
                    <div>
                        {showSearchRes && showSearchForm ?
                            <div id={styles.searchRes}>
                                <h2>Search Results</h2>
                                <div id={styles.displayRes}>
                                        <ul>
                                        {cleanTastyData.map((obj, idx) => {
                                            if (whatIngInRec[obj.recipe_name] != undefined){
                                                return <li id={"tastyrec" + idx} key={"tastyrec" + idx} onClick={() => handleTastyRecClick(obj, idx)}><strong>{obj.recipe_name}</strong> (uses:  {whatIngInRec[obj.recipe_name].join(", ")})</li>
                                            }
                                        })}
                                        </ul>
                                    <h3>From Your Saved Recipes:</h3>
                                        {<ul>
                                            {namesList2}
                                        </ul>}
                                </div>
                            </div> : null}
                    </div>
                    </div>
                    
                    <br />
                    {showTastyRecipe ? <div className={styles.currentRecipeDisplay}>
                        <div className={styles.btnsSection}>
                            <button className={styles.btns} type="button" onClick={(e) => handleAddToMaking(e)}>Add to Currently Making</button>
                            <button className={styles.btns} type="button" onClick={(e) => handleAddToSaved(e)}>Save Recipe to Your Collection</button>
                            <button className={styles.btns} type="button" onClick={handleCloseTastyRecipe}>X</button>
                        </div>
                            <h3>{currentTastyRecName}</h3>
                            <ul>
                                {tastyIngsList}
                            </ul>
                            <h4>Instructions</h4>
                            <ol>
                                {tastyInstructionsList}
                            </ol>  
                    </div> : null}

                    {showRecipe ? <div className={styles.currentRecipeDisplay}>
                        <div className={styles.btnsSection}>
                            <button className={styles.btns} type="button" onClick={(e) => handleAddToMaking2(e)}>Add to Currently Making</button>
                            <button className={styles.btns} type="button" onClick={handleCloseRecipe}>X</button>
                        </div>
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
                    </div> : null}
                
            </div>
            
            </Layout>
        </>
    );
}