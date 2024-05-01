import { useState } from "react";
import styles from '../../styles/componentstyles/FavBtn.module.css';

export default function FavBtn({ itm }){
    const [isFav, setIsFav] = useState(itm.is_fav);

    //when favorites button clicked toggle favorite/not favorite, make query to update recipe's DB entry accordingly
    function handleMakeFav(e){
        e.preventDefault();
        let num;
        if (isFav){
            num = 0;
        } else {
            num = 1;
        }
        setIsFav((isFav) => !isFav);
        updateFav(["UPDATE recipe_info SET is_fav = '" + num + "' WHERE recipe_name = '" + itm.recipe_name + "'"]);
    }

    //update recipe entry in DB
    async function updateFav(queryStr){
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
    }

    return <button className={styles.favBtn} type="button" title={isFav? "Click to remove from favorites" : "Add to favorites"} onClick={e => handleMakeFav(e)}>{isFav ? "❤️" : "♡"}</button>;
}