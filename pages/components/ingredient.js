//
export default function IngredientList({ ingredientsInfo }) {
    const listItems = ingredientsInfo.map((ingredient, index) =>
        <li key={ingredient.index}>
            {(ingredient.units == null) ? <b>{ingredient.name}</b> + ingredient.quantity + ", " + ingredient.description : <b>{ingredient.name}</b> + "  " + ingredient.quantity + " " + ingredient.units + " " + ingredient.description}
        </li>
    );
    return (
        <ul>
            {listItems}
        </ul>
    );
}