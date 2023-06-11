import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ReadExpense.scss";
import Vector from "./../assets/images/Vector.svg";
import { deleteHandler } from "./servicces/deleteHandler";
import { RiDeleteBinLine, RiEdit2Line } from "react-icons/ri";
import Papa from "papaparse";
import { Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const categoryURL = "http://localhost:3000/categories/";
const AdminsDishesURL = "http://localhost:3000/expenses";

function AdminDishes() {
  const [dish, setdishes] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [category, setCategory] = useState([new Set()]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  useEffect(() => {
    const params = {
      from: fromDate ? fromDate.toISOString() : null,
      to: toDate ? toDate.toISOString() : null,
    };
    axios
      .get(AdminsDishesURL, { params })
      .then((response) => setdishes(response.data))
      .catch((error) => console.log(error));

    axios
      .get(categoryURL)
      .then((response) => setCategory(response.data))
      .catch((error) => console.log(error));
  }, [fromDate, toDate]);

  function deleteExpense(id) {
    axios
      .delete(AdminsDishesURL + "/" + id)
      .then((response) => {
        setdishes(dish.filter((dish) => dish._id !== id));
      })
      .catch((error) => console.log(error));
  }

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

  const filteredExpenses = dish.filter((dish) => {
    if (selectedCategory && dish.category !== selectedCategory) {
      return false;
    }
    return true;
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

  let dishjsx = filteredExpenses.map((dish, index) => {
    return (
      <div className="card" key={dish._id}>
        <div className="cardInfoWrapper">
          <div>{dish.name}</div>

          <div>
            <b>Menu kategorija : </b> {dish.category}
          </div>
        </div>
        <div className="cardPriceGreen">{dish.amount} €</div>
        <div className="ButtonsContainer">
          <div className="buttonIcons">
            <Link to={"/dishes/" + dish._id} className="buttonIcons">
              <RiEdit2Line size={30} />
            </Link>
          </div>
          <div className="buttonIcons">
            <RiDeleteBinLine
              size={30}
              onClick={() => {
                deleteHandler(dish, deleteExpense);
              }}
            />
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
              <span>Menu kategorija:</span>
              <br />
              <select
                style={{ width: "150px" }}
                className="customDatePicker"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="">Visos kategorijos</option>
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
            <div className="cardsContainer overflowHidden">{dishjsx}</div>
          </div>
          <div className="budgetBtnContainer">
            <Button className="budgetBtn" onClick={handleExport}>
              eksportuoti CSV
            </Button>
          </div>
          <div className="LinkWrapper">
            <Link to="/addexpense/" className="LinkButton">
              <button className="buttonAdd">
                <img src={Vector} alt="" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDishes;




