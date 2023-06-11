import { useState, useEffect } from "react";
import axios from "axios";
import { Formik, ErrorMessage } from "formik";
import { Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import "./EditExpensesAndIncomes.scss";
import * as Yup from "yup";

const baseURL = "http://localhost:3000/categories/";

function EditCategory() {
  const { id } = useParams();
  const [selectedEdit, setSelectedEdit] = useState({
    category: ""
  });
  let navigate = useNavigate();



  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    axios
      .get(baseURL + id)
      .then((response) => setSelectedEdit(response.data))
      .catch((err) => console.log(err));
      console.log();
  }, [id]);
  return (
    <>
      <div className="incomes_expenses__background--color incomes_expenses-onMobile">
        <h1 className="editHeader">Redaguoti</h1>
        <Formik
          initialValues={selectedEdit}
          validationSchema={Yup.object({
            category: Yup.string()
              .required("langelis būtinas")
              .min(2, "pavadinimas per trumpas")
              .max(40, "pavadinimas per ilgas"),
          })}
          onSubmit={(values) => {
            // console.log(values);
            axios
              .patch(baseURL + id, values)
              .then((response) => console.log(response.data));
            setUpdated(true);
            navigate("/categories/");
          }}
          enableReinitialize
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            dirty,
            touched,
          }) => (
            <Form onSubmit={handleSubmit} className="diagram-border p-4">
              <Form.Group className="p-2">
                <Form.Label>Kategorijos pavadinimas</Form.Label>
                <Form.Control
                  className="incomes_expensesFields"
                  type="text"
                  placeholder="Kategorijos pavadinimas"
                  name="category"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.category}
                  isInvalid={touched.category && !values.category}
                ></Form.Control>
                <span className="formError">
                  <ErrorMessage name="category" />
                </span>
              </Form.Group>
              <div className="income_expensesBtn">
                <Button
                  className="income_expensesBtn"
                  variant="secondary"
                  onClick={() => navigate("/categories/")}
                >
                  Atgal
                </Button>
                <Button
                  className="income_expensesBtn"
                  variant="secondary"
                  type="submit"
                  disabled={!dirty}
                >
                  Redaguoti
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default EditCategory;
