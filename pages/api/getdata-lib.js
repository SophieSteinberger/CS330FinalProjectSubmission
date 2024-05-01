import { query } from '../../lib/db';

export default async function getDataHandler(req, res){
    //add whatever was posted to a variable
    //const item_name = req.body.item_name;
    try {
        const qry = "SELECT * FROM my_pantry";
        //put the variable(s) into the values
        const vals = [];
        //sends an array with results (and fields)
        const data = await query(qry, vals);

        res.status(200).json({ items: data });
    } catch (error) {
        res.status(500).json({ error: error.message});
    }

}