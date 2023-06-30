import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const UserDashboard = () => {
  const [questions, setQuestions] = React.useState([]);
  const [redirectToLogin, setRedirectToLogin] = React.useState(false);
  const [userID, setUserID] = React.useState("");
  const [questionsId, setQuestionsId] = React.useState([]);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isSent, setIsSent] = React.useState(false);
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    const spe = localStorage.getItem("specialite");
    const decoded = jwt_decode(token);
    const idUser = decoded.userId;
    setUserID(idUser);
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        const question = await axios.get(
          `http://localhost:3000/api/getTen?tag=${spe}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setQuestions(question.data);
      } catch (error) {
        console.error("Erreur lors du chargement des questions :", error);
      }
    };
    token ? setIsLoggedIn(true) : setIsLoggedIn(false);

    fetchQuestions();
  }, []);

  if (!isLoggedIn) {
    <Navigate to="/" />;
  }

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("specialite");
    setRedirectToLogin(true);
  };

  const sendAnswer = async () => {
    try {
      const token = localStorage.getItem("token");
      const idUser = userID;
      let qId = [];
      const questionId = questions.map(({ _id }) => {
        qId = [...qId, _id];
        setQuestionsId([...questionsId, _id]);
      });

      const answers = questions.map(({ _id }) => {
        const answerElement = document.getElementById(_id);
        const answerValue = answerElement.value;

        return {
          answer: answerValue,
        };
      });

      const decoded = jwt_decode(token);
      const email = decoded.email;

      await axios.post(
        "http://localhost:3000/api/answer",
        {
          idUser: idUser,
          email: email,
          questionId: qId,
          answer: answers,
        },
        {
          headers: {
            Authorization: `Bearer${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Erreur lors de l'envoi des réponses :", error);
    }
    setIsSent(true);
  };

  const confirmSubmission = async () => {
    if (window.confirm("Voulez-vous envoyez vos réponses ?")) {
      sendAnswer();
    }
  };

  if (isSent) {
    return <Navigate to="/QuestionnaireSubmission" />;
  }

  return (
    <div className="bg-user" style={{ minHeight: "100vh" }}>
      {redirectToLogin ? (
        <Navigate to="/" />
      ) : (
        <div className="bg-form" style={{ minHeight: "100vh" }}>
          <header className="py-1 d-flex align-items-center header1 fixed-top">
            <div class="image-container">
              <img src="logoAtixis.png" alt="Logo Atixis"></img>
            </div>

            <h1
              style={{
                fontFamily: "'Roboto Slab', serif",
                // fontFamily: "'Courier Prime', monospace",
              }}
              className="display-4 text-form text-center flex-grow-1"
            >
              Questionnaire
            </h1>
            <button
              onClick={logOut}
              className="btn btn-secondary me-4 my-4 py-2 px-2 rounded-circle"
              style={{
                color: "white",
                backgroundColor: "#2c4a91",
                marginLeft: "-110px",
              }}
            >
              <FontAwesomeIcon icon={faArrowRightFromBracket} size="2xl" />
            </button>
          </header>
          <div className="p-questionnaire" style={{ paddingTop: "180px" }}>
            {questions.map(
              ({ _id, statement, answer, multipleAnswer }, index) => {
                return (
                  <form className="bg-question shadow-form" key={_id}>
                    {multipleAnswer ? (
                      <div className="py-4">
                        <label
                          style={{ fontSize: "18px" }}
                          htmlFor={index + 1}
                          className="form-label text-form"
                        >
                          {statement}
                        </label>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          id={_id}
                        >
                          {answer.map((ans) => {
                            return <option value={ans}>{ans}</option>;
                          })}
                        </select>
                      </div>
                    ) : (
                      <div className="py-4">
                        <label
                          style={{ fontSize: "18px" }}
                          htmlFor={index + 1}
                          className="form-label text-form"
                        >
                          {statement}
                        </label>
                        <textarea
                          className="form-control"
                          id={_id}
                          placeholder="Votre réponse ..."
                          rows="3"
                        ></textarea>
                      </div>
                    )}
                  </form>
                );
              }
            )}
            <div className="py-4 text-center mx-auto my-auto">
              <button
                type="submit"
                onClick={confirmSubmission}
                className="btn my-4 "
                style={{
                  color: "white",
                  backgroundColor: "#2c4a91",
                }}
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
