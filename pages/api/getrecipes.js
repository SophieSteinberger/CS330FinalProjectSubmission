import { query } from '../../lib/db';

export default async function insertItem(req, res) {
    try {
        const qry = "SELECT * FROM recipe_info";
        const vals = [];
        //sends an array with results (and fields)
        const data = await query(qry, vals);

        const data2 = await query("SELECT * FROM recipe_ingredients", []);

        const data3 = await query("SELECT * FROM my_pantry", []);

        res.status(200).json({ items: [data, data2, data3] });
    } catch (error) {
        
        console.log("Error: " + error.message);
        res.status(500).json({ error: error.message});
    }
}