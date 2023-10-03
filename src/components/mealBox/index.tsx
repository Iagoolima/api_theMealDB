import { useState } from "react";
import './styleBoxMeal.css'

interface MealBoxProps {
    titleMeal: string; 
    imgMeal: string;
    ingredientMedal: string[];
   
}

const MealBox: React.FC<MealBoxProps> = ({ titleMeal, imgMeal, ingredientMedal }) => {
    
    const [confirmIngredient, setConfirmIngredient] = useState<Boolean>(false);
  
    return (

      <div className="box-meal">

        {!confirmIngredient && <img className="img-food" src={imgMeal} />}

        <h2 className="title-food">{titleMeal}</h2>

        {confirmIngredient && (
          <div>
            <h3 className="title-ingredient">Ingredientes:</h3>

            <ol>
              {ingredientMedal.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ol>

          </div>
        )}

        <button
          onClick={() => {
            setConfirmIngredient(!confirmIngredient);
          }}
          className="button-ingredient"
        >
          {confirmIngredient ? "VOLTAR" : "INGREDIENTES"}
        </button>

      </div>

    );

  };

export default MealBox