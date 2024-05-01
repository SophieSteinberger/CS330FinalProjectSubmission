import { useState } from "react";
import styles from '../../styles/componentstyles/ChecklistItem.module.css';

export default function ChecklistItem({inst, isDone}){
    const [checked, setChecked] = useState(isDone);

    //toggle check of checkbox
    function handleCheckClick(e){
        e.preventDefault();
        setChecked((checked) => !checked);
    }

    return  <li className="instruction">{inst + "       "}<button type="button" className={ checked ? styles.checkBtn : styles.unCheckBtn} onClick={e => handleCheckClick(e)}>{checked ? "✔" : ""}</button></li>;
}