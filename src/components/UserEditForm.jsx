import { useFormik } from "formik";
import { editUser } from "../../services/api";
import { useEffect, useState } from "react";

function UserEditForm({ setIsEditing, selectedUser }) {
  const baseURL = "http://localhost:3000/users/";
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formik = useFormik({
    initialValues: {
      name: selectedUser?.name || "",
      email: selectedUser?.email || "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        await editUser(baseURL + selectedUser._id, values);
        setIsSubmitted(true);
      } catch (error) {
        setError(error);
      }
    },
  });

  useEffect(() => {
    if (selectedUser) {
      formik.setValues({
        name: selectedUser.name,
        email: selectedUser.email,
        password: "",
      });
    }
  }, [selectedUser]);

  if (!selectedUser) {
    return null; // Render nothing if selectedUser is not available
  }

  return (
    <div>
      <form onSubmit={formik.handleSubmit} className="loginForm">
        <input
          type="text"
          placeholder="Vardas"
          name="name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          className="gradient-class"
          style={{ cursor: "text" }}
        />
        <input
          type="email"
          placeholder="El. Paštas"
          name="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          className="gradient-class"
          style={{ cursor: "text" }}
        />
        <input
          type="password"
          placeholder="Slaptažodis"
          name="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          className="gradient-class"
          style={{ cursor: "text" }}
        />
        <div className="admin-buttons">
          <button
            type="submit"
            className="gradient-class"
            style={{ cursor: "pointer" }}
          >
            Redaguoti
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="gradient-class"
            style={{ cursor: "pointer" }}
          >
            Atšaukti
          </button>
        </div>
        {isSubmitted && !error && <div>Vartotojas sėkmingai redaguotas</div>}
        {error && <div className="error">Įvyko klaida</div>}
      </form>
    </div>
  );
}

export default UserEditForm;
