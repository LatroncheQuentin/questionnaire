import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faMagnifyingGlass,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Question from "./Question";
import Answer from "./Answer";
import User from "./User";

// améliorer le css avec un background image
//améliorer l'affichage et la recherche des questionnnaires

const AdminDashboard = () => {
  const [showQuestion, setShowQuestion] = React.useState(true);
  const [questionActive, setQuestionActive] = React.useState(true);
  const [showAnswer, setShowAnswer] = React.useState(true);
  const [answerActive, setAnswerActive] = React.useState(false);
  const [showUser, setShowUser] = React.useState(true);
  const [userActive, setUserActive] = React.useState(false);
  const [redirectToLogin, setRedirectToLogin] = React.useState(false);
  const [questions, setQuestions] = React.useState([]);
  const [answers, setAnswers] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [statement, setStatement] = React.useState("");
  const [answer, setAnswer] = React.useState("");
  const [multipleAnswer, setMultipleAnswer] = React.useState("false");
  const [difficulty, setDifficulty] = React.useState("easy");
  const [showModal, setShowModal] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(true);
  const [userName, setUserName] = React.useState("");
  const [tag, setTag] = React.useState("");
  const [findByTag, setFindByTag] = React.useState("");
  const modalRef = React.useRef(null);

  const getRole = React.useCallback(async () => {
    const token = localStorage.getItem("token");
    const decoded = jwt_decode(token);
    const roleUser = decoded.role;
    roleUser === "admin" ? setIsAdmin(true) : setIsAdmin(false);
  }, []);

  const fetchQuestions = React.useCallback(async () => {
    const token = localStorage.getItem("token");
    const question = await axios.get("http://localhost:3000/api/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setQuestions(question.data);
  }, []);

  const fetchAnswers = React.useCallback(async () => {
    const token = localStorage.getItem("token");
    const answer = await axios.get("http://localhost:3000/api/answer", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setAnswers(answer.data);
  }, []);

  const fetchUsers = React.useCallback(async () => {
    const token = localStorage.getItem("token");
    const user = await axios.get("http://localhost:3000/api/allUser", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUsers(user.data);
  }, []);

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  React.useEffect(() => {
    try {
      (async () => {
        await getRole();
        const token = localStorage.getItem("token");
        const decoded = jwt_decode(token);
        const roleUser = decoded.role;
        if (roleUser !== "admin") {
          return;
        } else {
          await fetchQuestions();
          await fetchAnswers();
          await fetchUsers();
        }
      })();
    } catch (error) {
      console.error("Une erreur s'est produite :", error);
    }
  }, [getRole, isAdmin, fetchQuestions, fetchAnswers, fetchUsers]);

  if (!isAdmin) {
    return <Navigate to="/unauthorized" />;
  }

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      // Clique en dehors de la fenêtre modale
      // Vous pouvez appeler la fonction pour fermer la modale ici
      handleClose(); // Remplacez cela par la fonction appropriée pour fermer la modale
    }
  };

  const handleStatementChange = (event) => {
    setStatement(event.target.value);
  };

  const handleAnswerChange = (event) => {
    setAnswer(event.target.value);
  };

  const handleMultipleAnswerChange = (event) => {
    setMultipleAnswer(event.target.value);
  };

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
    console.log(event.target.value);
  };

  const handleTagChange = (event) => {
    setTag(event.target.value);
  };

  const handleUserNameChange = (event) => {
    const userName = event.target.value;
    setUserName(userName);
  };

  const displayQuestion = () => {
    setShowQuestion(true);
    setQuestionActive(true);
    setShowAnswer(false);
    setAnswerActive(false);
    setShowUser(false);
    setUserActive(false);
  };

  const displayAnswer = () => {
    setShowQuestion(false);
    setQuestionActive(false);
    setShowAnswer(true);
    setAnswerActive(true);
    setShowUser(false);
    setUserActive(false);
  };

  const displayUser = () => {
    setShowQuestion(false);
    setQuestionActive(false);
    setShowAnswer(false);
    setAnswerActive(false);
    setShowUser(true);
    setUserActive(true);
  };

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("specialite");
    setRedirectToLogin(true);
  };

  const addQuestion = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(tag);
      const ans = answer.split("\n").map((value) => value.trim());
      const t = tag.split("\n").map((value) => value.trim());
      const question = await axios.post(
        `http://localhost:3000/api/`,
        {
          statement,
          answer: ans,
          multipleAnswer,
          difficulty,
          tag: t,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(question);
    } catch (error) {
      console.error("erreur lors de l'ajout de la question : ", error);
    }
    toggleShow();
  };

  const removeQuestion = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const question = await axios.delete(`http://localhost:3000/api/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      window.location.reload();
    } catch (error) {
      console.error("erreur lors de la suppression de la question : ", error);
    }
  };

  const confirmDeletion = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimé cette question?")) {
      removeQuestion(id);
    }
  };

  const saveQuestions = async (id, question) => {
    try {
      const token = localStorage.getItem("token");
      const statement = question.statement;
      const answer = String(question.answer)
        .split("\n")
        .map((value) => value.trim());
      const multipleAnswer = question.multipleAnswer;
      console.log(multipleAnswer);
      const difficulty = question.difficulty;
      const tag = String(question.tag)
        .split("\n")
        .map((value) => value.trim());
      const response = await axios.patch(
        `http://localhost:3000/api/${id}`,
        {
          statement,
          answer,
          multipleAnswer,
          difficulty,
          tag,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("erreur lors de la connexion : ", error);
    }
  };

  const toggleShow = () => {
    setShowModal(!showModal);
  };

  const handleFindByTagChange = (event) => {
    setFindByTag(event.target.value);
  };

  const handleEnterKeySearchQuestion = async (event) => {
    if (event.key === "Enter") {
      findQuestionByTag(event);
    }
  };

  const handleEnterKeySearchAnswer = async (event) => {
    if (event.key === "Enter") {
      findAnswerByUserName(event);
    }
  };

  const handleEnterKeySearchUser = async (event) => {
    if (event.key === "Enter") {
      findUserByName(event);
    }
  };

  const findQuestionByTag = async (event) => {
    event.preventDefault();
    try {
      if (findByTag) {
        const token = localStorage.getItem("token");
        const question = await axios.get(
          `http://localhost:3000/api/byTag?tag=${findByTag}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setQuestions([...question.data]);
      } else {
        fetchQuestions();
      }
    } catch (error) {
      console.error("erreur lors de la recherche de la question: ", error);
    }
  };

  const findAnswerByUserName = async (event) => {
    event.preventDefault();
    try {
      if (userName) {
        const email = userName;
        const token = localStorage.getItem("token");
        const answer = await axios.get(
          `http://localhost:3000/api/answerUser?email=${email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAnswers([...answer.data]);
      } else {
        fetchAnswers();
      }
    } catch (error) {
      console.error("erreur lors de la recherche des réponses : ", error);
    }
  };

  const findUserByName = async (event) => {
    event.preventDefault();
    try {
      if (userName) {
        const name = userName;
        const token = localStorage.getItem("token");
        const user = await axios.get(
          `http://localhost:3000/api/user?name=${name}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers([...user.data]);
      } else {
        fetchUsers();
      }
    } catch (error) {
      console.error("erreur lors de la recherche des réponses : ", error);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div className="bg-form" style={{ minHeight: "100vh" }}>
      {redirectToLogin ? (
        <Navigate to="/" />
      ) : (
        <div className="bg-admin" style={{ minHeight: "100vh" }}>
          <header className="py-1 d-flex align-items-center header fixed-top">
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
              Page administrateur
            </h1>
            <button
              onClick={logOut}
              className="btn btn-secondary me-5 my-4 py-2 px-2 rounded-circle"
              style={{
                color: "white",
                backgroundColor: "#2c4a91",
                marginLeft: "-110px",
              }}
            >
              <FontAwesomeIcon icon={faArrowRightFromBracket} size="2xl" />
            </button>
          </header>
          <div className="text-center py-4">
            <div className="mt-1 py-3 fixed-center-top header1">
              <button
                className={`btn btn-link  ${questionActive ? "active" : ""}`}
                style={{
                  color: "#2c4a91",
                  textDecoration: "none",
                  backgroundColor: "transparent",
                  border: "none",
                }}
                onClick={displayQuestion}
              >
                Questions
              </button>{" "}
              |{" "}
              <button
                className={`btn btn-link  ${answerActive ? "active" : ""}`}
                style={{
                  color: "#2c4a91",
                  textDecoration: "none",
                  backgroundColor: "transparent",
                  border: "none",
                }}
                onClick={displayAnswer}
              >
                Questionnaires
              </button>{" "}
              |{" "}
              <button
                className={`btn btn-link  ${userActive ? "active" : ""}`}
                style={{
                  color: "#2c4a91",
                  textDecoration: "none",
                  backgroundColor: "transparent",
                  border: "none",
                }}
                onClick={displayUser}
              >
                Utilisateur
              </button>
            </div>
            {showQuestion ? (
              <div className="p-form text-form">
                <div style={{ marginTop: "200px" }}>
                  <div className="input-group mb-3 search-bar d-flex align-items-center px-5 ">
                    <div
                      class="input-group mb-2 py-2 "
                      style={{ borderRadius: "1000px" }}
                    >
                      <span
                        class="input-group-text"
                        style={{ borderRadius: "1000px 0px 0px 1000px " }}
                        id="basic-addon1"
                      >
                        <button className="btn" onClick={findQuestionByTag}>
                          <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" />
                        </button>
                      </span>
                      <input
                        style={{ borderRadius: "0px 1000px 1000px 0px " }}
                        type="text"
                        value={findByTag}
                        className="sb-radius form-control"
                        placeholder="Entrez une catégorie ..."
                        onChange={handleFindByTagChange}
                        onKeyPress={handleEnterKeySearchQuestion}
                      />
                    </div>
                  </div>
                  <button
                    onClick={toggleShow}
                    className="btn btn-success p-1 mt-5 mx-1 fixed-bottom-left rounded-circle p-2"
                  >
                    <FontAwesomeIcon icon={faPlus} size="xl" />
                  </button>
                  {showModal && (
                    <div
                      className="modal modal-overlay"
                      tabIndex="-1"
                      style={{ display: "block" }}
                    >
                      <div
                        ref={modalRef}
                        className="modal-dialog modal-dialog-centered modal-md"
                      >
                        <div className="modal-content">
                          <div className="modal-header bg-modal-title">
                            <h5 className="modal-title txt-modal-title ">
                              Nouvelle question
                            </h5>
                            <button
                              type="button"
                              className="btn"
                              onClick={handleClose}
                              style={{ color: "white" }}
                            >
                              <FontAwesomeIcon icon={faXmark} size="2xl" />
                            </button>
                          </div>
                          <div className="modal-body">
                            <div className="mb-2">
                              <label
                                htmlFor="statement"
                                style={{ fontSize: "18px" }}
                                className="form-label"
                              >
                                Énoncé
                              </label>
                              <input
                                type="text"
                                value={statement}
                                className="form-control"
                                id="statement"
                                onChange={handleStatementChange}
                              />
                            </div>
                            <div className="mb-2">
                              <label
                                htmlFor="answer"
                                className="form-label"
                                style={{ fontSize: "18px" }}
                              >
                                Réponses
                              </label>
                              <textarea
                                value={answer}
                                rows={3}
                                className="form-control"
                                id="answer"
                                onChange={handleAnswerChange}
                              ></textarea>
                              <div id="passwordHelp" className="text-form-ind">
                                Un retour a la ligne implique un nouvel élément
                              </div>
                            </div>
                            <div className="mb-2">
                              <label
                                htmlFor="multipleAnswer"
                                className="form-label"
                                style={{ fontSize: "18px" }}
                              >
                                QCM
                              </label>
                              <select
                                className="form-select"
                                value={multipleAnswer}
                                onChange={handleMultipleAnswerChange}
                                required
                              >
                                <option value="false">non</option>
                                <option value="true">oui</option>
                              </select>
                            </div>
                            <div className="mb-2">
                              <label
                                htmlFor="difficulty"
                                className="form-label"
                                style={{ fontSize: "18px" }}
                              >
                                Difficulté
                              </label>
                              <select
                                className="form-select"
                                value={difficulty}
                                onChange={handleDifficultyChange}
                                required
                              >
                                <option value="easy">facile</option>
                                <option value="medium">moyen</option>
                                <option value="hard">difficile</option>
                              </select>
                            </div>
                            <div className="mb-2">
                              <label
                                htmlFor="tag"
                                className="form-label"
                                style={{ fontSize: "18px" }}
                              >
                                Catégories
                              </label>
                              <textarea
                                type="text"
                                value={tag}
                                rows={3}
                                className="form-control"
                                id="tag"
                                onChange={handleTagChange}
                              ></textarea>
                              <div id="passwordHelp" className="text-form-ind">
                                Un retour a la ligne implique un nouvel élément
                              </div>
                            </div>
                            <div>
                              <button
                                onClick={handleClose}
                                className="btn btn-danger mt-3 mx-1"
                              >
                                Annuler
                              </button>
                              <button
                                onClick={addQuestion}
                                className="btn btn-success mt-3 mx-1"
                              >
                                Ajouter
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-form pt-4 text-form-dark">
                  <div className="row ">
                    {questions.map((question, index) => (
                      <div className="col-sm-12 col-lg-6 col-xxl-4" key={index}>
                        <Question
                          question={question}
                          confirmDeletion={confirmDeletion}
                          saveQuestion={saveQuestions}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : showAnswer ? (
              <div className="p-form text-form">
                <div
                  className="input-group mb-3 search-bar d-flex align-items-center px-5"
                  style={{ marginTop: "200px" }}
                >
                  <div class="input-group mb-2 py-2">
                    <span
                      class="input-group-text"
                      style={{ borderRadius: "1000px 0px 0px 1000px " }}
                      id="basic-addon1"
                    >
                      <button className="btn" onClick={findAnswerByUserName}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" />
                      </button>
                    </span>
                    <input
                      type="text"
                      value={userName}
                      style={{ borderRadius: "0px 1000px 1000px 0px " }}
                      className="form-control"
                      placeholder="Entrez l'identifiant d'un utilisateur ..."
                      onChange={handleUserNameChange}
                      onKeyPress={handleEnterKeySearchAnswer}
                    />
                  </div>
                </div>
                {/* </div> */}
                <div className="bg-form pt-4">
                  <div className="row">
                    {answers.map((answer, index) => (
                      <div className="col-sm-12 col-lg-6 col-xxl-4">
                        <Answer answer={answer} key={index} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-form text-form">
                <div
                  className="input-group mb-3 search-bar d-flex align-items-center px-5"
                  style={{ marginTop: "200px" }}
                >
                  <div class="input-group mb-2 py-2">
                    <span
                      class="input-group-text"
                      style={{ borderRadius: "1000px 0px 0px 1000px " }}
                      id="basic-addon1"
                    >
                      <button className="btn" onClick={findUserByName}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" />
                      </button>
                    </span>
                    <input
                      type="text"
                      value={userName}
                      style={{ borderRadius: "0px 1000px 1000px 0px " }}
                      className="form-control"
                      placeholder="Entrez le nom d'un utilisateur ..."
                      onChange={handleUserNameChange}
                      onKeyPress={handleEnterKeySearchUser}
                    />
                  </div>
                </div>
                <div className="bg-form p-4">
                  <div className="row">
                    {users.map((user, index) => (
                      <div className="col-sm-12 col-lg-6 col-xxl-4">
                        <User answer={user} key={index} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminDashboard;
