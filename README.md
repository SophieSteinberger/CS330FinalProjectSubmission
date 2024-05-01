# Food Manager App
This app was created using Next.js, React.js, and Node.js as a final project for CS330 - Structure and Organization of Programing Languages at Simmons University (spring 2024 semester).

The app:
- Keeps a list of the ingredients that the user has on hand (entered by the user)
    - Lets the user add, update, and delete items
- Displays/emphasizes items that are expiring soon
- Lets the user input and save their own recipes as well as those fetched from an API for Buzzfeed Tasty's recipes
    - User can edit and/or add to any of their saved recipes
    - User can mark their favorite recipes
    - Users can add notes to saved recipes
- Lets user keep list of recipes they are currently making (or making soon)
    - Allows user to scale the recipe up or down depending on the portion they are making
    - Recipes can be scaled based on the amount of one ingredient (only have 1/3 cup of flour but the recipe calls for 
    1/2 cup? Need to use up all 10 tomatoes that are about to go bad?)
    - Scaled recipes can be saved
    - Scaled recipes from the user's saved recipes can be saved without altering the original
- Lets user search for recipes from Buzzfeed Tasty and from their own saved recipes by ingredient or name
    - Can save new recipes to the user's collection and/or to the user's in-progress/currently making recipes
    - Reminds user of their two soonest expiring items and shows recipes that use one or both of those ingredients


This project was created using [this](https://nextjs.org/learn) is a starter template from Next.js.

## Set up:
- Have Node installed (npm is included)
- In the terminal `cd` to the directory in which you would like to create the app in
- Run the command `npx create-next-app@latest foodmanagerapp --use-npm --example "https://github.com/vercel/next-learn/tree/main/basics/learn-starter"` (foodmanagerapp is what I named the application when I made it, however you can name it whatever you want)
- `cd` into the foodmanagerapp directory
- install mysql2 by running `npm install --save mysql2`
- Replace the template `pages` directory with the `pages` directory from this repository
- In the `styles` directory replace the files with the files and nested directory provided in this repository
- Create a MySQL database for the project called `myapp`. The code for setting up the tables is here (ADD LINK)
- In the top level directory (`foodmanagerapp`) create a directory called `lib` and in that directory create the file 
 `db.js`
    - `db.js` should contain the following code BUT replace "YourPasswordHere" with your database password, if your socket path is different change it, same with user, etc.:
    ```
    import mysql from 'mysql2/promise';

    export async function query(query, values){
        const dbconn = await mysql.createConnection({
            host: "localhost",
            database: "myapp",
            user: "root",
            password: "YourPasswordHere",
            socketPath: "/tmp/mysql.sock",
            multipleStatements: true,
        });

        try {
            const [results] = await dbconn.execute(query, values);
            dbconn.end();
            console.log(results);
            return results;
        } catch (error) {
            dbconn.end()
            throw Error(error.message);
            return {error};
        }

    }
    ```
- If you do not have one, create a free account on RapidAPI. [Subscribe/get a key for the Tasty API](https://rapidapi.com/apidojo/api/tasty/).
- In the `lib` directory create a file named `tasty-conn.js` with the following code (replacing 'YourAPIKeyHere' with your own key):
    ```
    export function getTastyAPIConnInfo(){
    return {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'YourAPIKeyHere',
            'X-RapidAPI-Host': 'tasty.p.rapidapi.com'
        }
        };
    }
    ```
- To run the development server, make sure you are in the `foodmanagerapp` directory and your MySQL server is running run, then run the command `npm run dev`
- Open your browser and go to `http://localhost:3000/` and you will see the home page


### File Structure
The following does NOT include what is automatically created by npm/next NOR does it include the names of files in directories that contain ONLY files (that do not contain other directories) (the one exception being the lib directory containing the files created in the above directions):

- foodmanagerapp
    - Pages
        - index.js
        - otherpgs
        - conversions
        - components
        - api
    - Public (this can be deleted/doesn't matter, unless you want to add images to the app)
    - styles
        - global.css
        - Home.module.css
        - Home.module2.css
        - InProgressRecipesPage.module.css
        - SavedRecipesPage.module.css
        - SearchRecipesPage.module.css
        - UserIngredientsPage.module.css
        - componentstyles
    - lib
        - db.js
        - tasty-conn.js
