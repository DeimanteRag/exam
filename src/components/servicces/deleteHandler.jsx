import { Button } from "react-bootstrap";
import { confirmAlert } from "react-confirm-alert";
import { Modal } from "react-bootstrap";

export let deleteHandler = (item, deleteFunction) => {
  confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <div
          className="react-confirm-alert-overlay confirmation-modal income_expensesBtn income_expensesBtn deleteCard button:hover deleteCard"
          style={{ zIndex: 9999 }}
        >
          <div className="react-confirm-alert">
            <div className="react-confirm-alert-body">
              <h1>Ar tikrai norite pašalinti šį įrašą?</h1>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  className="deleteBtn"
                  onClick={onClose}
                  variant="secondary"
                >
                  Atšaukti
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    deleteFunction(item._id);
                    onClose();
                    // window.location.reload();
                  }}
                >
                  Ištrinti
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    },
  });
};
