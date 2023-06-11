import React, { useEffect, useState } from "react";
import { deleteHandler } from "./servicces/deleteHandler";
import { RiDeleteBinLine } from "react-icons/ri";
import axios from "axios";
import "./ReadExpense.scss";

const ReadMenu = ({ selectedExpense, onClose }) => {
  const [dishDetails, setDishDetails] = useState(null);
  const [dish, setDishes] = useState([]);

  const dishURL = "http://localhost:3000/incomes";

  useEffect(() => {
    axios
      .get("http://localhost:3000/incomes/")
      .then((response) => setDishDetails(response.data))
      .catch((error) => console.log(error));
  }, []);

  if (!dishDetails) {
    return null;
  }
function deleteDish(id) {
  axios
    .delete(dishURL + "/" + id)
    .then(() => {
      setDishes((prevExpenses) =>
        prevExpenses.filter((dish) => dish._id !== id)
      );

      setDishDetails((prevDetails) =>
        prevDetails.filter((dish) => dish._id !== id)
      );
    })
    .catch((error) => console.log(error));
}
  return (
    <div>
      <div className="dashboard-background">
         <div className="readExpenseIncomejsx">
         <div className="cardsWrapper">
      <h2>Menu Details</h2>
  
      {dishDetails.map((dish, index) => (
            <div className="cardsContainerBorder">
            <div className="cardsContainer overflowHidden">
        <div className="card" key={index}>
          <div className="cardInfoWrapper">
          <p>Name: {dish.name}</p>
          <p>Category: {dish.category}</p>
          <p>Amount: {dish.amount}</p>
          <hr />
          <div className="buttonIcons">
            <RiDeleteBinLine
              size={30}
              onClick={() => {
                deleteHandler(dish, deleteDish);
              }}
            />
          </div>
          </div>
        </div>
        </div>
        </div>
        
      ))}
      </div>
      </div>
        </div>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ReadMenu;
