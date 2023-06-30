import React from "react";
import { Navigate } from "react-router-dom";

const QuestionnaireSubmission = () => {
  const [redirectToLogin, setRedirectToLogin] = React.useState(false);

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("specialite");
    setRedirectToLogin(true);
  };

  return (
    <div
      style={{ minHeight: "100vh", height: "100vh" }}
      className="bg-redirect text-form text-align-center justify-items-center"
    >
      <h1>Questionnaire envoyé</h1>
      <p>Votre questionnaire à été envoyé avec succes</p>
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
export default QuestionnaireSubmission;
