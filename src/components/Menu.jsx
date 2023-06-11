import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./ReadExpense.scss";
import Vector from "./../assets/images/Vector.svg";
import { Button } from "react-bootstrap";
import Papa from "papaparse";

const categoryURL = "http://localhost:3000/categories/";
const expensesURL = "http://localhost:3000/expenses/";


function Menu({ userRole, currentUserId }) {
  const [dish, setDishes] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [category, setCategory] = useState([]);
  const navigate = useNavigate();

  const handleOptionSubmission = (dish) => {
    console.log(dish); 
    axios
      .post("http://localhost:3000/incomes/", dish)
      .then((response) => {
         console.log(response);
        setDishes([response.data]);
        navigate("/readmmenu");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  
  
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  useEffect(() => {
    const params = {
      from: fromDate ? fromDate.toISOString() : null,
      to: toDate ? toDate.toISOString() : null,
    };
    axios
      .get(expensesURL, { params })
      .then((response) => setDishes(response.data))
      .catch((error) => console.log(error));

    axios
      .get(categoryURL)
      .then((response) => setCategory(response.data))
      .catch((error) => console.log(error));
  }, [fromDate, toDate]);

  const handleExport = () => {
    const csv = Papa.unparse(dish, {
      header: true,
    });

    const csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const csvURL = URL.createObjectURL(csvData);
    const link = document.createElement("a");
    link.href = csvURL;
    link.setAttribute("download", "expenses.csv");
    link.click();
  };
  const filteredMenu = dish.filter((dish) => {
    if (selectedCategory && dish.category !== selectedCategory) {
      return false;
    }

    if (userRole === "admin" || dish.userId === currentUserId) {
      return true;
    }
    return false;
  });

  

  const categoriesOptions = category.map((category, index) => (
    <option value={category.category} key={index}>
      {category.category}
    </option>
  ));
  const handleResetFilters = () => {
    setSelectedCategory("");
    setFromDate(null);
    setToDate(null);
  };

  let dishesjsx = filteredMenu.map((dish, index) => {
    return (
      <div className="card" key={dish._id}>
        <div className="cardInfoWrapper">
          <div>{dish.name}</div>

          <div>
            <b>Menu kategorija: </b> {dish.category}
          </div>
        </div>
        <div className="cardPriceGreen">{dish.amount} €</div>
        <div className="ButtonsContainer">
          <div className="buttonIcons">
            <Button
              className="income_expensesBtn"
              variant="secondary"
              type="submit"
              onClick={() => handleOptionSubmission(dish)}
            >
              Pateikti
            </Button>
          </div>
        </div>
      </div>
    );
  });
  return (
    <>
      <div className="readExpenseIncomejsx">
        <div className="cardsWrapper">
          <div className="filtersContainer">
            <div className="filterItem">
              <span> kategorija:</span>
              <br />
              <select
                style={{ width: "150px" }}
                className="customDatePicker"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="" >Visos kategorijos</option>
                {categoriesOptions}
              </select>
            </div>

            <Button
              style={{ width: "100px" }}
              className="budgetBtn"
              onClick={handleResetFilters}
            >
              Atstatyti
            </Button>
          </div>
          <div className="cardsContainerBorder">
            <div className="cardsContainer overflowHidden">{dishesjsx}</div>
          </div>
          <div className="budgetBtnContainer">
            <Button className="budgetBtn" onClick={handleExport}>
              eksportuoti CSV
            </Button>
          </div>

        </div>
      </div>
    </>
  );
}

export default Menu;
