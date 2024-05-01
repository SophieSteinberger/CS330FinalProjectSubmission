import styles from '../../styles/componentstyles/EditButton.module.css';

export default function EditButton({handleClick, id}){
    return (
        <button id={id} className={styles.editBtn} onClick={handleClick}>Edit</button>
    );
}