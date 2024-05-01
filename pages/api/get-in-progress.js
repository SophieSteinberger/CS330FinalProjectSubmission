import { query } from '../../lib/db';

export default async function insertItem(req, res) {
    try {
        //sends an array with results (and fields)
        const data = await query("SELECT * FROM in_progress_info", []);

        const data2 = await query("SELECT * FROM in_progress", []);

        res.status(200).json({ items: [data, data2] });
    } catch (error) {
        
        console.log("Error: " + error.message);
        res.status(500).json({ error: error.message});
    }
}