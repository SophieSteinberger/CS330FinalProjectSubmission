import { query } from '../../lib/db';

export default async function insertItem(req, res) {
    try {
        const qry = "SELECT * FROM recipe_ingredients";
        const vals = [];
        //sends an array with results (and fields)
        const data = await query(qry, vals);

        res.status(200).json({ items: data });
    } catch (error) {
        
        console.log("Error: " + error.message);
        res.status(500).json({ error: error.message});
    }
}