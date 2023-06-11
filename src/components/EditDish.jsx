//Mygtukas, kuris leis edit'inti savo irasyta irasa.

import { useState, useEffect } from "react";
import axios from "axios";
import { Formik, ErrorMessage } from "formik";
import { Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import "./EditExpensesAndIncomes.scss";
import * as Yup from "yup";

const baseURL = "http://localhost:3000/expenses/";
const categoryURL = "http://localhost:3000/categories/";

function EditDish() {
  const { id } = useParams();
  const [selectedEdit, setSelectedEdit] = useState({
    name: "",
    category: "",
  });
  const [category, setCategory] = useState([new Set()]);

  let navigate = useNavigate();

  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    axios
      .get(baseURL + id)
      .then((response) => setSelectedEdit(response.data))
      .catch((err) => console.log(err));

    axios
      .get(categoryURL)
      .then((response) => setCategory(response.data))
      .catch((error) => console.log(error));
  }, [id]);

  const categoriesjsx = category.map((category, index) => (
    <option value={category.category} key={index}>
      {category.category}
    </option>
  ));

  return (
    <>
      <div className="incomes_expenses__background--color incomes_expenses-onMobile">
        <h1 className="editHeader">Redaguoti</h1>
        <Formik
          initialValues={selectedEdit}
          validationSchema={Yup.object({
            name: Yup.string()
              .required("langelis būtinas")
              .min(2, "pavadinimas per trumpas")
              .max(40, "pavadinimas per ilgas"),
            category: Yup.string().required("Būtina pasirinkti kategoriją"),
          })}
          onSubmit={(values) => {
            // console.log(values);
            axios
              .patch(baseURL + id, values)
              .then((response) => console.log(response.data));
            setUpdated(true);
            navigate("/dishes");
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
                <Form.Label>Pavadinimas</Form.Label>
                <Form.Control
                  className="incomes_expensesFields"
                  type="text"
                  placeholder="Pavadinimas"
                  name="name"
                  value={values.name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isInvalid={touched.name && !values.name}
                />
                <span className="formError">
                  <ErrorMessage name="name" />
                </span>
              </Form.Group>
              <Form.Group className="p-2">
                <Form.Label>Kategorija</Form.Label>
                <Form.Control
                  className="incomes_expensesFields"
                  as="select"
                  placeholder="Kategorija"
                  name="category"
                  value={values.category}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isInvalid={touched.category && !values.category}
                >
                  {categoriesjsx}
                </Form.Control>
                <span className="formError">
                  <ErrorMessage name="category" />
                </span>
              </Form.Group>
              <div className="income_expensesBtn">
                <Button
                  className="income_expensesBtn"
                  variant="secondary"
                  onClick={() => navigate("/dishes/")}
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

export default EditDish;
