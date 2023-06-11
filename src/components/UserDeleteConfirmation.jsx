import { useState } from "react";
import { deleteUser } from "../../services/api";

function UserDeleteConfirmation({ setIsBeingDeleted, selectedUser }) {
  const [isDeleted, setIsDeleted] = useState(false);
  const [error, setError] = useState(null);
  const baseURL = "http://localhost:3000/users/";
  async function handleDelete() {
    try {
      // show loading icon
      setIsDeleted("loading");

      // send delete request
      await deleteUser(baseURL + selectedUser._id);

      // set isDeleted to true after timeout
      setTimeout(() => {
        setIsDeleted(true);
      }, 1500);

      // reset form after timeout
      setTimeout(() => {
        setIsBeingDeleted(false);
        setIsDeleted(false);
      }, 3000);
    } catch (error) {
      setError(error);
      console.log(error);
    }
  }

  return (
    <div>
      <p style={{textAlign: "center", color: "#8d0b7e"}}>Ar tikrai norite pašalinti vartotoją?</p>
      <div className="admin-buttons">
        <button
          type="button"
          onClick={() => handleDelete()}
          className="gradient-class"
        >
          Taip
        </button>
        <button
          type="button"
          onClick={() => setIsBeingDeleted(false)}
          className="gradient-class"
        >
          Atšaukti
        </button>
      </div>
      {isDeleted === "loading" && <div>Palaukite...</div>}
      {isDeleted === true && <div>Vartotojas sėkmingai pašalintas</div>}
    </div>
  );
}

export default UserDeleteConfirmation;
