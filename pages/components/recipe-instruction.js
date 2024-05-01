import styles from '../../styles/componentstyles/RecipeInstruction.module.css';

export function RecipeInstructionEdit({num, val, changeHandler}){
    return (
        <input className={styles.recInst} type="text" id={"instruction"+num} name={"instruction"+num} value={val} onChange={changeHandler} />
    );
}

export default function RecipeInstruction({num}){
    return (
        <input className={styles.recInst} type="text" id={"instruction"+num} name={"instruction"+num} />
    );
}