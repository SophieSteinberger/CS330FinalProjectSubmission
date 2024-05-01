import { useEffect, useState } from "react";
import styles from '../../styles/componentstyles/SearchRecipesForm.module.css';

export default function SearchRecipesForm(){
    const [paramCount, setParamCount] = useState(1);
    const [searchForm, setSearchForm] = useState([<div id={"div0"}><input className={styles.paramInput} type="text" id={0} name="search_item0" /></div>]);

    useEffect(() => {
       console.log("updating State");
    }, [paramCount]);

    //add an input to the form for entering another search parameter
    function handleAddSearchParam(e){
        e.preventDefault();
        setSearchForm([...searchForm, <div id={"div"+paramCount}><input className={styles.paramInput} type="text" id={"search_item" + paramCount} name={"search_item" + paramCount} /><button className={styles.buttonGeneralSm} type="button" id={paramCount} onClick={handleRemoveParam}>X</button></div>]);
        setParamCount((paramCount) => paramCount+1);
    }

    //remove a search parameter from the form
    function handleRemoveParam(e){
        e.preventDefault();
        setSearchForm([searchForm.slice(0, parseInt(e.target.id))]);
        setParamCount((paramCount) => paramCount - 1);
    }


    return (
        <>  <div id={styles.wholeThing}>
                <h1 id={styles.header}>Search Recipes: </h1>
                {searchForm}
                <button id={styles.addParam} className={styles.buttonGeneralSm} type="button" onClick={handleAddSearchParam}>+</button>
                <div className={styles.fastRec}>
                    <input type="checkbox" name="fast_recipe" id="fast_recipe" value={true} />
                    <label htmlFor="fast_recipe">Search Under-30-Minute Recipes</label>
                </div>
                <br/><br/>
                <button className={styles.buttonGeneralLg} type="submit">Search</button>
            </div>
        </>
    );
}