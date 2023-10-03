import { useEffect, useState } from "react"
import { FaSearch } from 'react-icons/fa';
import MealBox from "./../components/mealBox";
import './stylePageMain.css'

import axios from 'axios';

type ItemMeal = {
    strMeal: string,
    strMealThumb: any,
    ingredientMedal: string[],
    strIngredient1: string,
    strIngredient2: string,
    strIngredient3: string,
    strIngredient4: string,
    strIngredient5: string,
    strIngredient6: string,
    strIngredient7: string,
    strIngredient8: string,
    strIngredient9: string,
    strIngredient10: string,
}


export default function App() {

    const [search, setSearch] = useState<string>('')

    const [mealItem, setMealItem] = useState<ItemMeal[]>([])

    const [notFound, setNotFound] = useState<boolean>(false);

    const [handleIngredient, setHandleIngredient] = useState<boolean>(false);

    const [notIngredient, setNotIngredient] = useState<boolean>(false)

    const [loading, setLoading] = useState<boolean>(false);


    const onSubmit = () => {

        if (search.length === 1) {
            mealLetter();
            setHandleIngredient(false)
        }

        if (search.length !== 1) {
            mealName();
            setHandleIngredient(true)
        }

        if (!search) {
            setHandleIngredient(false)
        }

    }

    useEffect(() => {
        if (search === '') {
            mealName();
            setLoading(true)
            setHandleIngredient(false)
            setNotFound(false);
            setNotIngredient(false)
        }
    }, [search]);

    async function reloadTitle() {

        try {
            await setSearch('')            
        } catch (error) {
            console.error('erro ao atualiza')
        }

    }

    async function mealName() {

        try {
            const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`);

            if (response.data && response.data.meals) {
                setMealItem(response.data.meals);
                setNotFound(false);
            } 
            else {
                setMealItem([]);
                setNotFound(true);
                setHandleIngredient(true)
                setNotIngredient(false)
            }
        } 
        catch (error) {
            console.error("Erro ao buscar refeições:", error);
        } 
        finally {
            setLoading(false)
        }

    }


    async function mealLetter() {

        try {
            const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?f=${search}`);
            if (response.data && response.data.meals) {
                setMealItem(response.data.meals);
                setNotFound(false);
            }
            else {
                setMealItem([]);
                setNotFound(true);
                setHandleIngredient(false)
            }
        } 
        catch (error) {
            console.error("Erro ao buscar refeições:", error);
        }
    }

    async function queryIds() {

        try {
            const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${search}`);

            if (response.data && response.data.meals) {

                const mealIds = response.data.meals.map((meal: any) => meal.idMeal);
                setLoading(true);
                setHandleIngredient(false)
                setNotIngredient(false)
                console.log(mealIds)
                await mealIngredient(mealIds)
            }
            else {
                setNotIngredient(true)
                setNotFound(false);
            }
        } 
        catch (error) {
            console.log('error ao consulta ids')
        }
    }


    async function mealIngredient(ids: any) {

        try {
            const responses = await Promise.all(ids.map((id: any) => axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)));

            const meals = responses
                .filter((response) => response.data && response.data.meals)
                .map((response) => response.data.meals[0]);


            if (meals.length > 0) {
                setMealItem(meals);
                setNotFound(false);
            } 
            else {
                setMealItem([]);
                setNotFound(true);
                setHandleIngredient(false);
            }
        } 
        catch (error) {
            console.error("Erro ao buscar refeições:", error);
        } 
        finally {
            setLoading(false)
            setHandleIngredient(true)
        }
    }




    return (
        <div className="container">

            <header>

                <div className="title-text">

                    <button onClick={reloadTitle} className="title-api-header">API TheMealDB</button>

                </div>

                <div className="box-input">

                    <input type="text" placeholder="pesquise ..." className="input-search" onChange={(e) => setSearch(e.target.value)} onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            onSubmit();
                        }
                    }} value={search} />
                    <button onClick={onSubmit} className="button-search"><FaSearch /></button>

                </div>

            </header>

            <div className="container-content-meal">

                <div className="container-handleIngredient">

                    {handleIngredient && <button onClick={queryIds} className="button-handleIngredient"> Visualizar pratos com {search}</button>}

                    {loading && <div className="box-loading"><div className="loading"></div></div>}

                </div>

                {notIngredient && <h2>Não há pratos com esse ingrediente !</h2>}
                {notFound && <h2>não há pratos com esse nome !</h2>}


                <div className="content-meal-food">

                    {mealItem.map((item) => (
                        <MealBox
                            titleMeal={item.strMeal}
                            imgMeal={item.strMealThumb}
                            ingredientMedal={[
                                item.strIngredient1,
                                item.strIngredient2,
                                item.strIngredient3,
                                item.strIngredient4,
                                item.strIngredient5,
                                item.strIngredient6,
                                item.strIngredient7,
                                item.strIngredient8,
                                item.strIngredient9,
                                item.strIngredient10
                            ]}
                        />
                    ))}

                </div>


            </div>

        </div>
    )
}
