import Head from "next/head";
import { useEffect, useState} from "react";
import ItemInputForm from "../components/item-input-form";
import { parseItemsToShow } from "../conversions/conversions";
import { prepDataForDB, createInsertQuery} from '../conversions/helpers';
import EditButton from "../components/edit-button";
import UpdateItemInputForm from "../components/updateitemform";
import Layout from "../components/layout";
import styles from '../../styles/UserIngredientsPage.module.css';

export default function UserIngredientsPage(){
    //state variable to be able to use pulled data in returned component (make sure default is an empty array)
    //can then pull this state variable in to use
    const [dataResponse, setDataResponse] = useState([]);
    const [cleanedData, setCleanedData] = useState([]);
    const [itemsCount, setItemsCount] = useState(0);
    const [itemsList, setItemsList] = useState([]);
    const [itemsTable, setItemsTable] = useState([]);
    //const [itemTableTemp, setItemTableTemp] = useState([]);
    const [currentForm, setCurrentForm] = useState(<ItemInputForm />);
    const [showEdit, setShowEdit] = useState(false);
    const [showAddItem, setShowAddItem] = useState(false);
    //const [shouldRerun, setShouldRerun] = useState(0);
    const [editingForm, setEditingForm] = useState(<></>);
    const [editingItemIdx, setEditingItemIdx] = useState(0);
    const [editItemInfo, setEditItemInfo] = useState({});
    const [preEditItem, setPreEditItem] = useState({});
    const [triggerUpdate, setTriggerUpdate] = useState(0);

    const [byExp, setByExp] = useState([]);
    const [cleanedByExp, setCleanedByExp] = useState([]);
    const [sortBy, setSortBy] = useState(true);

    //DB QUERYING (/API ACCESSING)/ASYNC FUNCTIONS:

    //runs at beginning/ (+when triggered) to get user items data from DB + turn that data into a display table that can be sorted by expiration date or alphabetically
    useEffect(() => {
        async function getPageData(){
            //the url/path where the db connection function is
            const apiURLEndpoint = 'http://localhost:3000/api/getdata-lib';
            const response = await fetch(apiURLEndpoint);
            const res = await response.json();
            //items is the key to access the value that is the array of ingredient objects
            setDataResponse(res.items);
            console.log(res.items);
            setCleanedData(parseItemsToShow(res.items));
            setItemsTable(parseItemsToShow(res.items).map((item, idx) =>
                <tr className={styles.tRow} key={idx}>
                    <td className={(idx%2 == 0) ? styles.rows1 :styles.rows2}>{item.item_name}</td>
                    <td className={(idx%2 == 0) ? styles.rows1 :styles.rows2}>{item.quantity}</td> 
                    <td className={(idx%2 == 0) ? styles.rows1 :styles.rows2}>{item.exp_date.substring(0, 10)}</td>
                    {<td className={(idx%2 == 0) ? styles.rows1 :styles.rows2}><EditButton id={idx} handleClick={handleEditItem} /></td>}
                    <td className={(idx%2 == 0) ? styles.rows1 :styles.rows2}><button className={styles.smBtns} id={"del" + idx} type="button" onClick={handleItemDel}>Delete</button></td>
                </tr>
            ));
            let dataByExp = parseItemsToShow(res.items).map((itm, idx) => {
                return {
                    ...itm,
                    exp_date : new Date(itm.exp_date),
                };
            });
            dataByExp = dataByExp.sort((a, b) => a.exp_date - b.exp_date);
            dataByExp = dataByExp.map((itm) => {
                console.log(itm.exp_date);
                itm.exp_date = new Date(itm.exp_date.getTime() + (24 * 60 * 60 * 1000));
                return {
                    ...itm,
                    exp_date : itm.exp_date.getFullYear() + "-" + (itm.exp_date.getMonth()+1) + "-" + itm.exp_date.getDate(),
                }
            });
            setCleanedByExp([...dataByExp]);
            console.log(dataByExp);
            setByExp(dataByExp.map((item, idx) =>
            <tr className={styles.tRow} key={idx}>
                <td className={(idx%2 == 0) ? styles.rows1 :styles.rows2}>{item.item_name}</td>
                <td className={(idx%2 == 0) ? styles.rows1 :styles.rows2}>{item.quantity}</td> 
                <td className={(idx%2 == 0) ? styles.rows1 :styles.rows2}>{item.exp_date}</td>
                {<td className={(idx%2 == 0) ? styles.rows1 :styles.rows2}><EditButton id={idx} handleClick={handleEditItem} /></td>}
                <td className={(idx%2 == 0) ? styles.rows1 :styles.rows2}><button className={styles.smBtns} id={"del" + idx} ype="button" onClick={handleItemDel}>Delete</button></td>
            </tr>
            ));
            //sort((a, b) => a.exp_date - b.exp_date)
            //console.log("Items Table:");
            //console.log(itemsTable);
            setItemsCount(res.items.length);
            setItemsList(dataResponse.map((itm) => 
                {return itm.item_name;}
            ));
        }
        //inside of useEffect run the async function
        getPageData();
    }, [itemsCount, triggerUpdate]);

    //add new ingredient to DB
    async function addItemToDB(qryObj){
        const qry = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({q: qryObj}),
        };
        //the url/path where the db connection function is
        const apiURLEndpoint = 'http://localhost:3000/api/additem';
        const response = await fetch(apiURLEndpoint, qry);
        const res = await response.json();
        console.log(res.items);
        setItemsCount((itemsCount) => itemsCount + 1);
    }

    //deletes item from DB
    async function doTheDel(queryStr){
        const qry = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({q: queryStr}),
        };
        //the url/path where the db connection function is
        const apiURLEndpoint = 'http://localhost:3000/api/updateitem';
        const response = await fetch(apiURLEndpoint, qry);
        const res = await response.json();
        console.log(res.items);
        setItemsCount((itemsCount) => itemsCount+1);
        setTriggerUpdate(triggerUpdate+1);
    }

    //update item info in DB
    async function handleItemUpdate(e){
        //e.preventDefault();
        // Read the form data
        const editForm = e.target;
        const editFormData = new FormData(editForm);
        //as a plain object:
        const editFormJson = Object.fromEntries(editFormData.entries());
        const processedItem = prepDataForDB(editFormJson);
        //console.log(processedItem);
        const queryStr = makeUpdateQuery(processedItem);
        //console.log(queryStr);
        const qry = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({q: queryStr}),
        };
        //the url/path where the db connection function is
        const apiURLEndpoint = 'http://localhost:3000/api/updateitem';
        const response = await fetch(apiURLEndpoint, qry);
        const res = await response.json();
        console.log(res.items);
        if (res.error) {
            console.log("error" + res.error); 
        } else {
            cancelEdit()
            setTriggerUpdate(triggerUpdate+1);
        }
    }

    //HANDLERS:

    //handle submission of new ingredient item
    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();
        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        //as a plain object:
        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson);
        if (formJson.item_name != "" && !(itemsList.includes(formJson.item_name))){
            const dbReadyQuery = createInsertQuery(prepDataForDB(formJson));
            addItemToDB(dbReadyQuery);
            setItemsList([...itemsList, formJson.item_name]);
            setCurrentForm(<ItemInputForm />);
        } else {
            alert("The item you entered either does not have a name or is already an item listed in your list");
        }
        handleShowAdd();
    }

    //sets a form for user to edit item/ingredient info (and saves information in state for use in submitting update)
    function handleEditItem(e){
        let rowToEdit = parseInt(e.target.id);
        let rowVals;
        if (sortBy){
            console.log(cleanedByExp);
            rowVals = cleanedByExp[rowToEdit];
        } else {
            rowVals = cleanedData[rowToEdit];
        }
        //console.log(rowToEdit);
        //console.log(rowVals);
        //console.log(showEdit);
         if (showEdit == false && rowVals != undefined){
            setEditItemInfo(rowVals);
            setEditingItemIdx(rowToEdit);
            setPreEditItem(rowVals);
            setEditingForm(<UpdateItemInputForm itmInfo={rowVals} />);
            setShowEdit(showEdit => !showEdit);
            console.log(showEdit);
        } 
    }

    //state change to show form for adding an item to user's items
    function handleShowAdd(){
        setShowAddItem((showAddItem) => !showAddItem);
    }

    //toggles between displaying items by expiration date and alphabetically
    function handleSortBy(e){
        setSortBy((sortBy) => !sortBy);
    }

    //creates SQL query for deleting an item and confirms with the user their choice
    function handleItemDel(e){
        let rowToDel = parseInt(e.target.id.slice(3));
        console.log(rowToDel);
        let rowVals;
        if (!sortBy){
            rowVals = cleanedData[rowToDel];

        } else {
            rowVals = cleanedByExp[rowToDel];
            console.log(rowVals);
        }

        let sqlDelStr = "DELETE FROM my_pantry WHERE item_name = '" + rowVals.item_name + "'";
        console.log(sqlDelStr);

        let moveFwdDel = window.confirm("Are you sure you want to delete " + rowVals.item_name + " from your items?");
        if (moveFwdDel) {
            doTheDel(sqlDelStr);
        }
    }

    //clear relevant state info + remove the form for item editing
    function cancelEdit(){
        setEditItemInfo({});
        setPreEditItem({});
        setShowEdit((showEdit) => !showEdit);
        //console.log(showEdit);
    }

    //HELPERS:

    //trigger an update in state
    useEffect( () => {
        console.log("updating state");
    }, [showEdit, editItemInfo, editingItemIdx, editingForm]);

    //create SQL query for updating item in DB
    function makeUpdateQuery(newVals){
        //console.log(prepDataForDB(preEditItem));
        //console.log(newVals);
        let qryObj = prepDataForDB(preEditItem);
        delete qryObj.quantity;

        let queryStatement = "UPDATE my_pantry SET ";

        //update vals
        for (let x in qryObj){
            if (x != 'item_name'){
                if (x in newVals){
                    qryObj[x] = newVals[x];
                    queryStatement += x + " = '" + newVals[x] + "', ";
                } else {
                    if (qryObj[x] == null) {
                        queryStatement += x + " = " + qryObj[x] + ", ";
                    } else {
                        queryStatement += x + " = '" + qryObj[x] + "', ";
                    }    
                }
            }
        }
        queryStatement = queryStatement.slice(0, (queryStatement.length - 2)) + " WHERE item_name = '" + qryObj.item_name + "'";
        console.log(queryStatement);
        return queryStatement;
    }

    return (
        <>
            <Head>
                <title>Food Manager App - My Ingredients</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
            </Head>
            <Layout pNum={1}>
            <div id={styles.wholePg}>
                <div id={styles.itemsDisplay}>
                <div>
                {showEdit ? <div id="editItem">
                <form onSubmit={handleItemUpdate}>{editingForm}</form><button id = {styles.cancelBtn} className={styles.smBtns} type="button" onClick={() => cancelEdit()}>Cancel</button>
                </div>: <div>
                    <button id={styles.sortBtn} type="button" onClick={handleSortBy}>{sortBy ? "Sort Items Alphabetically" : "Sort by Expiration Date"}</button><br/><br/>
                    <table id={styles.ingTable}>
                    {<thead>
                        <tr id={styles.tableHead}>
                            <td>Ingredient</td>
                            <td>Quantity</td>
                            <td>Expiration Date</td>
                        </tr>
                    </thead>}
                    <tbody>
                        {sortBy ? byExp : itemsTable}
                    </tbody>
                </table></div>}
                <br/>
                </div>
                {showEdit ? null : <button className={showAddItem ? styles.cancelAdd : styles.buttonGeneralLg} type="button" onClick={handleShowAdd}>{showAddItem? "X" : "+ Add an Item To Your Ingredients List"}</button>}
                { showAddItem ? <div id="addToItems">
                    <form onSubmit={handleSubmit} method="post">
                        {currentForm}
                    </form>
                </div> : null }
                </div>
            </div>
            </Layout>
        </>
    );
}