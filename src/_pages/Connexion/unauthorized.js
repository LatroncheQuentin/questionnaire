import React from "react";
import { Navigate } from "react-router-dom";

const Unauthorized = () => {
  const [redirectToLogin, setRedirectToLogin] = React.useState(false);

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("specialite");
    setRedirectToLogin(true);
  };

  return (
    <div
      style={{ minHeight: "100vh" }}
      className="unauthorized-page bg-redirect text-form text-align-center justify-items-center"
    >
      <h1>Accès refusé</h1>
      <p>
        Vous n'avez pas les autorisations nécessaires pour accéder à cette page.
      </p>
      <div>
        {redirectToLogin ? (
          <Navigate to="/" />
        ) : (
          <div className="bg-redirect" style={{ minHeight: "100vh" }}>
            <header className="py-4 ">
              <button
                onClick={logOut}
                className="btn btn-warning ms-2 float-left"
              >
                retourner a l'accueil
              </button>
            </header>
          </div>
        )}
      </div>
    </div>
  );
};
export default Unauthorized;
