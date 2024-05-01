import styles from '../../styles/componentstyles/RecipeNote.module.css';

export default function RecipeNote({num}){
    return (
        <input className={styles.recNote} type="text" id={"note"+num} name={"note"+num} />
    );
}
