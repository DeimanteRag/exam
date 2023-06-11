//VISA NAVIGACIJA. JOJE KEISIS TARPUSAVY TURINYS, PRIKLAUSOMAI NUO TO, AR VARTOTOJAS PRISIJUNGES AR NE
//IF LOGGED IN = TRUE, TADA RODOME NavMainButtons ir NavLogoutButton, IF LOGGED IN = FALSE, RODOME NavLoginForm

import { NavigationLogo, NavUserLogo, NavLogoutButton } from "./NavIcons";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function Navigation() {
  const { getLoggedIn } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const { isAdmin } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get("http://localhost:3000/users/getName")
      .then((res) => setUserData(res.data))
      .catch((error) => console.log(error));
  }, []);

  const logOut = async () => {
    await axios.get("http://localhost:3000/users/logout");
    getLoggedIn();
  };

  return (
    <>
      <div className="nav__background--color     width: 25%; pt-5">
       
        <div className="mt-5 d-flex flex-column justify-between gap-5">
          <div id="navButtons" className="w-75 mx-auto">
            <Link to="/" className="mb-2 w-50 mx-auto text-decoration-none">
              <Button className="w-100 mx-auto gradient-class">Meniu</Button>
            </Link>

            <Link
              to="/readmmenu/"
              className="mb-2 w-50 mx-auto text-decoration-none"
            >
              <Button className="w-100 mx-auto gradient-class">
                Pateiktas Sąrašas
              </Button>
            </Link>
            {isAdmin && (
              <>
                <Link
                  to="/dishes/"
                  className="mb-2 w-50 mx-auto text-decoration-none"
                >
                  <Button className="w-100 mx-auto gradient-class">
                    Patiekalai
                  </Button>
                </Link>
                <Link
                  to="/categories/"
                  className="mb-2 w-50 mx-auto text-decoration-none"
                >
                  <Button className="w-100 mx-auto gradient-class">
                    Kategorijos
                  </Button>
                </Link>
                <Link
                  to="/users/"
                  className="mb-2 w-50 mx-auto text-decoration-none"
                >
                  <Button className="w-100 mx-auto gradient-class">
                    Vartotojai
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="container__Bottom--Margin">
          <div className="user-logo">
            <NavUserLogo />
            <span className="user-profile">{userData.name}</span>
          </div>
          <button className="logout-button" onClick={logOut}>
            <NavLogoutButton />
          </button>
        </div>
      </div>
    </>
  );
}

export default Navigation;
