//ISLAIDU PUSLAPIS. JAME GRAFIKAS RODANTIS VISU METU ISLAIDU SUMA SUSKIRSTYTAS PAGAL MENESIUS IR SALIA PIRKIMU ISTORIJA (TIK ISLAIDOS)
import { Formik, ErrorMessage } from "formik";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { postData } from "../../services/api";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import axios from "axios";

const DishURL = "http://localhost:3000/dishes";
const categoryURL = "http://localhost:3000/categories/";

function AddDish() {
  const [submitted, setSubmitted] = useState(false);
  const [dish, setDishes] = useState([]);
  const [budgets, setBudgets] = useState([]);
  // const [category, setCategory] = useState([]);
  const [category, setCategory] = useState([new Set()]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(DishURL)
      .then((response) => setDishes(response.data))
      .catch((error) => console.error("Error fetching data:", error));
    axios
      .get(categoryURL)
      .then((response) => setCategory(response.data))
      .catch((error) => console.log(error));
  }, []);

  const handleCategoryChange = (event) => {
    // Update selectedCategory state with selected category from form
    setSelectedCategory(event);
    console.log(selectedCategory);
  };

  const categoriesjsx = category.map((category, index) => (
    <option value={category.category} key={index}>
      {category.category}
    </option>
  ));

  return (
    <>
      <div className="incomes_expenses__background--color incomes_expenses-onMobile">
        <Formik
          initialValues={{
            name: "",
            amount: "",
            category: "",
          }}
          validationSchema={Yup.object({
            name: Yup.string()
              .required("Langelis būtinas")
              .min(2, "Pavadinimas per trumpas")
              .max(40, "Pavadinimas per ilgas"),
            amount: Yup.number()
              .required("Langelis būtinas")
              .lessThan(100, "Suma turi būti mažesnė nei šimtas"),
            category: Yup.string().required("Būtina pasirinkti kategoriją"),
          })}
          onSubmit={(values, { resetForm }) => {
            postData(values, DishURL);
            console.log(values);
            resetForm();
            setSubmitted(true);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            dirty,
            isSubmitting,
            resetForm,
          }) => (
            <Form onSubmit={handleSubmit} className="diagram-border p-4">
              {submitted && <h4 style={{ color: "orange" }}>Pateikta!</h4>}

              <Form.Group className="p-2">
                <Form.Label>Pavadinimas</Form.Label>
                <Form.Control
                  className="incomes_expensesFields"
                  type="text"
                  placeholder="Pavadinimas"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  isInvalid={touched.name && !values.name}
                  maxLength={50}
                />
                <span className="formError">
                  <ErrorMessage name="name" />
                </span>
              </Form.Group>

              <Form.Group className="p-2">
                <Form.Label>Kaina</Form.Label>
                <Form.Control
                  className="incomes_expensesFields"
                  type="number"
                  step="0.01"
                  placeholder="Kaina"
                  name="amount"
                  onChange={handleChange}
                  onBlur={(e) => {
                    let value = parseFloat(e.target.value).toFixed(2);
                    if (isNaN(value)) {
                      value = "";
                    }
                    e.target.value = value;
                    handleBlur(e);
                  }}

                />
                <span className="formError">
                  <ErrorMessage name="amount" />
                </span>
              </Form.Group>

              <Form.Group className="p-2">
                <Form.Label>Kategorija</Form.Label>
                <Form.Control
                  as="select"
                  className="incomes_expensesFields select-dark"
                  name="category"
                  onChange={(e) => {
                    handleChange(e);
                    handleCategoryChange(e.target.value);
                  }}
                  onBlur={handleBlur}
                  value={values.category}
                  isInvalid={touched.category && !values.category}
                >
                  <option value="">Pasirinkite Kategoriją</option>
                  {categoriesjsx}
                </Form.Control>
                <span className="formError">
                  <ErrorMessage name="category" />
                </span>
              </Form.Group>

              <div className="income_expensesBtn">
                <Button
                  className="income_expensesBtn"
                  type="button"
                  onClick={resetForm}
                  disabled={!dirty || isSubmitting}
                >
                  Atšaukti
                </Button>
                <Button
                  className="income_expensesBtn"
                  variant="secondary"
                  type="submit"
                  disabled={!dirty || isSubmitting}
                >
                  Pateikti
                </Button>
                <Button
                  variant="primary"
                  onClick={() => navigate("/dishes/")}
                >
                  Išlaidų sąrašas
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default AddDish;
