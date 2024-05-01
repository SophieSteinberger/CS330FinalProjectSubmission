import { query } from '../../lib/db';

export default async function updateItem(req, res) {
    const qrys = req.body.q;
    console.log(req.body.q);
    //for (let qry of qrys){
    for (let i = 0; i < qrys.length; i++){
        try {
            let qry = qrys[i];
            console.log(qry);
            const vals = [];
            //sends an array with results (and fields)
            const data = await query(qry, vals);
    
            res.status(200).json({ items: data });
        } catch (error) {
            
            console.log("Error: " + error.message);
            res.status(500).json({ error: error.message});
        }   
    }
}
