import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const Connexion = () => {
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [specialite, setSpecialite] = React.useState("general");
  const [logedIn, setLogedIn] = React.useState(false);
  const [passwordVisibility, setPasswordVisibility] = React.useState(false);
  const [role, setRole] = React.useState("user");
  const [showLogin, setShowLogin] = React.useState(true);
  const [loginActive, setLoginActive] = React.useState(true);
  const [signUpActive, setSignUpActive] = React.useState(false);
  const [confirmationCode, setConfirmationCode] = React.useState("");
  const [showModal, setShowModal] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const allSpe = ["general", "informatique", "React", "JavaScript", "SQL"];

  const registerRef = React.useRef();
  const loginRef = React.useRef();
  const modalRef = React.useRef(null);

  let userRole;
  let userSpe;

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      // Clique en dehors de la fenêtre modale
      // Vous pouvez appeler la fonction pour fermer la modale ici
      handleClose(); // Remplacez cela par la fonction appropriée pour fermer la modale
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSpeChange = (event) => {
    setSpecialite(event.target.value);
    userSpe = event.target.value;
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleCodeChange = (event) => {
    setConfirmationCode(event.target.value);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      getSpeFromDB(email);
      const response = await axios.post("http://localhost:3000/api/login", {
        email,
        password,
      });

      const token = response.data.token;
      token ? setLogedIn(true) : setLogedIn(false);
      getRole(token);
      getSpe(token);

      // const specialite = specialite

      localStorage.setItem("token", token);
      localStorage.setItem("specialite", userSpe);
    } catch (error) {
      console.error("erreur lors de la connexion : ", error);
      window.alert("erreur lors de la connexion  ");
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/register", {
        confirmationCode: confirmationCode,
        email,
        name,
        password,
        specialite,
      });
    } catch (error) {
      console.error("erreur lors de la connexion : ", error);
      window.alert("erreur lors de la connexion  ");
    }
    await handleLogin(event);
  };

  const openModal = (event) => {
    event.preventDefault();

    if (registerRef.current.checkValidity()) {
      if (role === "admin") {
        setShowModal(true);
      } else {
        handleRegister(event);
      }
    } else {
      setSubmitted(true);
    }
  };

  const confirmLogin = (event) => {
    event.preventDefault();

    if (loginRef.current.checkValidity()) {
      handleLogin(event);
    } else {
      setSubmitted(true);
    }
  };

  const togglePasswordVisibility = (event) => {
    event.preventDefault();
    setPasswordVisibility(!passwordVisibility);
  };

  const showLoginForm = () => {
    setShowLogin(true);
    setLoginActive(true);
    setSignUpActive(false);
  };

  const showSignUpForm = () => {
    setShowLogin(false);
    setLoginActive(false);
    setSignUpActive(true);
  };

  const getRole = async (token) => {
    try {
      const decoded = jwt_decode(token);
      const roleUser = decoded.role;
      setRole(roleUser);
      userRole = roleUser;
    } catch (error) {
      console.error(
        "erreur lors de la récupération du rôle depuis la base de données : ",
        error
      );
      window.alert(
        "erreur lors de la récupération du rôle depuis la base de données  "
      );
    }
  };

  const getSpe = async (token) => {
    try {
      const decoded = jwt_decode(token);
      const speUser = decoded.spécialité;
      setSpecialite(speUser);
      userSpe = speUser;
      localStorage.setItem("specialite", userSpe);
    } catch (error) {
      console.error(
        "erreur lors de la récupération de la specialite depuis la base de données : ",
        error
      );
      window.alert(
        "erreur lors de la récupération de la specialite depuis la base de données "
      );
    }
  };

  const getSpeFromDB = async (email) => {
    try {
      const spe = await axios.get(
        `http://localhost:3000/api/login/getSpecialite?email=${email}`
      );
      setSpecialite(spe.data.specialite);
      userSpe = spe.data.specialite;
    } catch (error) {
      console.error(
        "erreur lors de la récupération de la spécialité : ",
        error
      );
      window.alert("erreur lors de la récupération de la specialite");
    }
  };

  return (
    <div className="bg-accueil" style={{ minHeight: "100vh" }}>
      {logedIn ? (
        role === "admin" || userRole === "admin" ? (
          <Navigate to="/admin-dashboard" />
        ) : (
          <Navigate to="/user-dashboard" />
        )
      ) : (
        <div>
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
              Accueil
            </h1>
          </header>
          <div className="text-center" style={{ paddingTop: "180px" }}>
            <button
              className={`btn btn-link ${loginActive ? "active" : ""}`}
              style={{
                color: "#2c4a91",
                textDecoration: "none",
                backgroundColor: "transparent",
                border: "none",
              }}
              onClick={showLoginForm}
            >
              Connexion
            </button>{" "}
            |{" "}
            <button
              className={`btn btn-link ${signUpActive ? "active" : ""}`}
              style={{
                color: "#2c4a91",
                textDecoration: "none",
                backgroundColor: "transparent",
                border: "none",
              }}
              onClick={showSignUpForm}
            >
              Inscription
            </button>
          </div>
          {showLogin ? (
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-xs-8 col-sm-10 col-md-10 col-lg-10 col-xl-10 col-xxl-10">
                  <form
                    ref={loginRef}
                    className={`glass-container p-form-acceuil  text-form needs-validation ${
                      submitted ? "was-validated" : ""
                    }`}
                    style={{ borderRadius: "10px" }}
                    noValidate
                  >
                    <div className="glass-container-inner mb-3 bg-form-accueil">
                      <label
                        htmlFor="email"
                        style={{ color: "white" }}
                        className="form-label"
                      >
                        Addresse email :
                      </label>
                      <input
                        type="email"
                        value={email}
                        className="form-control"
                        id="email"
                        onChange={handleEmailChange}
                        required
                      />
                      <div className="invalid-feedback">
                        Adresse email incorrect.
                      </div>
                    </div>
                    <div className="glass-container-inner mb-3 bg-form-accueil">
                      <label
                        htmlFor="password"
                        style={{ color: "white" }}
                        className="form-label"
                      >
                        Mot de passe :
                      </label>
                      <div className="d-flex align-items-start">
                        <div className="flex-grow-1">
                          <input
                            type={passwordVisibility ? "text" : "password"}
                            value={password}
                            className="form-control"
                            id="password"
                            onChange={handlePasswordChange}
                            required
                            aria-describedby="passwordHelp"
                          />
                          <div className="invalid-feedback">
                            Mot de passe incorrect.
                          </div>
                        </div>
                        <button
                          onClick={togglePasswordVisibility}
                          className="btn"
                          style={{ color: "white" }}
                        >
                          {!passwordVisibility ? (
                            <FontAwesomeIcon icon={faEyeSlash} size="xl" />
                          ) : (
                            <FontAwesomeIcon icon={faEye} size="xl" />
                          )}
                        </button>
                      </div>
                    </div>
                    <button
                      type="submit"
                      onClick={confirmLogin}
                      className="btn d-block mt-5 "
                      style={{
                        color: "white",
                        backgroundColor: "#2c4a91",
                      }}
                    >
                      Connexion
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-xs-8 col-sm-10 col-md-10 col-lg-10 col-xl-10 col-xxl-10">
                  <form
                    ref={registerRef}
                    className={`glass-container p-form-acceuil text-form needs-validation ${
                      submitted ? "was-validated" : ""
                    }`}
                    noValidate
                  >
                    <div
                      className="row mb-4"
                      style={{ paddingLeft: "12px", paddingRight: "12px" }}
                    >
                      <div
                        style={{ marginRight: "15px" }}
                        className=" col-5 glass-container-inner mb-3 bg-form-accueil"
                      >
                        <label
                          htmlFor="validationEmail"
                          style={{ color: "white" }}
                          className="form-label"
                        >
                          Adresse email :
                        </label>

                        <input
                          type="email"
                          value={email}
                          className="form-control"
                          id="validationEmail"
                          onChange={handleEmailChange}
                          required
                        />
                        <div className="invalid-feedback">
                          Veuillez entrez une adresse email valide.
                        </div>
                      </div>
                      <div
                        style={{ marginLeft: "15px" }}
                        className="col-5  glass-container-inner mb-3 bg-form-accueil"
                      >
                        <label
                          htmlFor="name"
                          style={{ color: "white" }}
                          className="form-label"
                        >
                          Nom :
                        </label>
                        <input
                          type="name"
                          value={name}
                          className="form-control"
                          id="name"
                          onChange={handleNameChange}
                          required
                        />
                        <div className="invalid-feedback">
                          Veuillez entrez un nom valide.
                        </div>
                      </div>
                    </div>
                    <div className="glass-container-inner mb-3 bg-form-accueil">
                      <label
                        htmlFor="password"
                        style={{ color: "white" }}
                        className="form-label"
                      >
                        Mot de passe :
                      </label>
                      <div className="d-flex align-items-start">
                        <div className="flex-grow-1">
                          <input
                            type={passwordVisibility ? "text" : "password"}
                            value={password}
                            className="form-control"
                            id="password"
                            onChange={handlePasswordChange}
                            required
                            aria-describedby="passwordHelp"
                          />
                          <div className="invalid-feedback">
                            Mot de passe incorrect.
                          </div>
                        </div>
                        <button
                          onClick={togglePasswordVisibility}
                          className="btn "
                          style={{ color: "white" }}
                        >
                          {!passwordVisibility ? (
                            <FontAwesomeIcon icon={faEyeSlash} size="xl" />
                          ) : (
                            <FontAwesomeIcon icon={faEye} size="xl" />
                          )}
                        </button>
                      </div>
                      <div
                        id="passwordHelp"
                        className={`${
                          submitted ? "invalid-feedback" : "text-form-ind"
                        }`}
                        style={{ color: "white" }}
                      >
                        Votre mot de passe doit comporter entre 8 et 20
                        caractères, inclure des lettres et des chiffres, et ne
                        doit pas contenir d'espaces, de caractères spéciaux ou
                        d'émoticônes.
                      </div>
                    </div>
                    <div className="row mt-5">
                      <div
                        style={{ marginLeft: "15px" }}
                        className="col-5  glass-container-inner mb-3 bg-form-accueil"
                      >
                        <label
                          htmlFor="role"
                          style={{ color: "white" }}
                          className="form-label"
                        >
                          Rôle :
                        </label>
                        <select
                          className="form-select"
                          value={role}
                          onChange={handleRoleChange}
                          required
                        >
                          <option value="user">utilisateur</option>
                          <option value="admin">administrateur</option>
                        </select>
                        <div class="invalid-feedback">
                          Veuillez choisir un role.
                        </div>
                      </div>
                      <div
                        style={{ marginLeft: "15px" }}
                        className="col-5  glass-container-inner mb-3 bg-form-accueil"
                      >
                        <label
                          htmlFor="spe"
                          style={{ color: "white" }}
                          className="form-label"
                        >
                          Spécialité :
                        </label>
                        <select
                          className="form-select"
                          value={specialite}
                          onChange={handleSpeChange}
                          required
                        >
                          {allSpe.map((spe) => (
                            <option value={spe}>{spe}</option>
                          ))}
                        </select>
                        <div class="invalid-feedback">
                          Veuillez choisir une spécialité.
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      onClick={openModal}
                      className="btn mt-4"
                      style={{
                        color: "white",
                        backgroundColor: "#2c4a91",
                      }}
                    >
                      Inscription
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
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
                    <h5 className="modal-title txt-modal-title">
                      Confirmation d'administrateur
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
                    <p>
                      Veuillez entrer le code de confirmation pour devenir
                      administrateur :
                    </p>
                    <input
                      type="text"
                      className="form-control"
                      value={confirmationCode}
                      onChange={handleCodeChange}
                    />
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                      onClick={handleClose}
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleRegister}
                    >
                      Confirmer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Connexion;
