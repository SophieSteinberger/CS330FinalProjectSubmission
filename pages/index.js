import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { parseItemsToShow } from './conversions/conversions';
import Layout from './components/layout';
import styles2 from '../styles/Home2.module.css';

export default function Home() {
  const [dataResponse, setDataResponse] = useState([]);
  const [cleanedData, setCleanedData] = useState([]);
  const [cleanedByExp, setCleanedByExp] = useState([]);
  const [byExp, setByExp] = useState([]);
  const [expThisWeek, setExpThisWeek] = useState([]);


  //get user ingredients info from DB, order by date, display the ones with expiration dates in the next week
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
        let today = new Date();
        let nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        let dataByExp1 = parseItemsToShow(res.items).map((itm, idx) => {
            return {
                ...itm,
                exp_date : new Date(itm.exp_date),
            };
        });
        dataByExp1 = dataByExp1.sort((a, b) => a.exp_date - b.exp_date);
        //only the ones that expire in the next week
        let expWithinWeek = dataByExp1.filter((obj) => obj.exp_date.getTime() <= nextWeek.getTime());
        //array of recipes expire this week (sorted)
        expWithinWeek = expWithinWeek.map((itm) => {
          return {
            ...itm,
            exp_date : itm.exp_date.getFullYear() + "-" + (itm.exp_date.getMonth()+1) + "-" + itm.exp_date.getDate(),
          }
        });
        console.log(expWithinWeek);
        //below is properly formatted items sorted by expiration date
        let dataByExp = dataByExp1.map((itm) => {
            return {
                ...itm,
                exp_date : itm.exp_date.getFullYear() + "-" + (itm.exp_date.getMonth()+1) + "-" + itm.exp_date.getDate(),
            }
        });
        setCleanedByExp([...dataByExp]);
        setExpThisWeek([...expWithinWeek]);
        console.log(dataByExp);
        setByExp(expWithinWeek.map((item, idx) =>
        <tr key={idx}>
            <td>{item.item_name}</td>
            <td>{item.quantity}</td> 
            <td>{item.exp_date}</td>
        </tr>
        ));
    }
    //inside of useEffect run the async function
    getPageData();
  }, []);


  return (
    <Layout pNum={0}>
    <div className={styles.container}>
      <Head>
        <title>Food Manager App - Home</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      </Head>

      <main id={styles2.wholePage}>
        <div id={styles2.myIngredientsSection}>
          <h2>Items Expiring This Week</h2>
          <table>
              <thead>
                    <tr>
                        <td>Ingredient</td>
                        <td>Quantity</td>
                        <td>Expiration Date</td>
                    </tr>
              </thead>
              <tbody>
                {byExp}
              </tbody>
          </table>
          <div id={styles2.link}><Link href="/otherpgs/search-recipes">Find recipes to use them up!</Link></div>
        </div>
        
      </main>
      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family:
            Menlo,
            Monaco,
            Lucida Console,
            Liberation Mono,
            DejaVu Sans Mono,
            Bitstream Vera Sans Mono,
            Courier New,
            monospace;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            Fira Sans,
            Droid Sans,
            Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
    </Layout>
  );
}
