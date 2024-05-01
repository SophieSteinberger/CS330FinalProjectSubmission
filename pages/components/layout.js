import { useState } from "react";
import styles from "../../styles/componentstyles/Layout.module.css";
import Link from "next/link";

export function NavBar({ pageNum }){
    return (
        <>
            <ul className={styles.navList}>
                <li id="nav0" className={pageNum != 0 ? styles.navLi : styles.activeLi}><Link className={styles.navLink} href="/">Home</Link></li>
                <li id="nav1" className={pageNum != 1 ? styles.navLi : styles.activeLi}><Link className={styles.navLink} href="/otherpgs/my-ingredients">My Items</Link></li>
                <li id="nav2" className={pageNum != 2 ? styles.navLi : styles.activeLi}><Link className={styles.navLink} href="/otherpgs/search-recipes">Search Recipes</Link></li>
                <li id="nav4" className={pageNum != 3 ? styles.navLi : styles.activeLi}><Link className={styles.navLink} href="/otherpgs/saved-recipes">Saved Recipes</Link></li>
                <li id="nav4" className={pageNum != 4 ? styles.navLi : styles.activeLi}><Link className={styles.navLink} href="/otherpgs/in-progress">In-Progress Recipes</Link></li>
            </ul>
        </>
    )
}

export default function Layout({ children, pNum }){
    return (
        <>
            <div className="pageContainer">
                <NavBar pageNum={pNum} />
                <main id={styles.main}>{children}</main>
            </div>
        </>
    )
}