import { query } from '../../lib/db';

export default async function insertItem(req, res) {
    const qrys = req.body.q;
    for (let qry of qrys){
        try {
            let message;
            
            const vals = [];
            //sends an array with results (and fields)
            const data = await query(qry, vals);
    
            if (data.insertId){
                message = "success";
            } else {
                message = "error";
            }
    
            res.status(200).json({ items: data });
        } catch (error) {
            
            console.log("Error: " + error.message);
            res.status(500).json({ error: error.message});
        }   
    }
}