import "bootstrap/dist/css/bootstrap.min.css";

import Layout from "./components/Layout";
import MainPage from "./components/MainPage";
import { Route, Routes } from "react-router-dom";
import Menu from "./components/Menu";
import AddExpenses from "./components/AddDish";
import EditDish from "./components/EditDish";
import Users from "./components/Users";
import ReadMenu from "./components/ReadMenu";
import AddMenu from "./components/AddMenu";
import EditCategory from "./components/EditCategory";
import RegisterForm from "./components/RegisterForm";
import LoginPage from "./components/LoginPage";
import Categories from "./components/CategoryCreate";



import axios from "axios";
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import CreateDish from "./components/AdminDishes";

axios.defaults.withCredentials = true;

function App() {
  const { loggedIn, isAdmin } = useContext(AuthContext);

  return (
    <Layout>
      <Routes>
        {loggedIn ? (
          <Route path="/" element={<MainPage />}>
            <Route path="/" element={<Menu />} />
            <Route path="readmmenu" element={<ReadMenu />} />
            
            {isAdmin && (
              <>
              
                <Route path="addexpense" element={<AddExpenses />} />
                <Route path="dishes/:id" element={<EditDish />} />
                <Route path="dishes" element={<CreateDish />}/>
                <Route path="addmenu" element={<AddMenu />} />
                <Route path="categories" element={<Categories />}/>
                <Route path="categories/:id" element={<EditCategory />} />
                <Route path="users" element={<Users />} />
              </>
            )}
          </Route>
        ) : (
          <Route path="/" element={<LoginPage />} />
        )}
        <Route path="/signup" element={<RegisterForm />} />
      </Routes>
    </Layout>
  );
}

export default App;
