import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const Input = ({ label, id, disabled, value, onChange }) => {
  return (
    <div className="my-2">
      <label htmlFor={id} className="form-label text-form">
        {label}
      </label>
      <input
        style={{
          fontSize: "12px",
        }}
        type="text"
        value={value}
        className="form-control content-admin"
        id={id}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
};

const Question = ({ question, saveQuestion, confirmDeletion }) => {
  const [disabled, setDisabled] = React.useState(true);
  const [values, setValues] = React.useState(null);

  React.useEffect(() => {
    if (question) {
      setValues(question);
    }
  }, [question]);

  return (
    <div className="bg-question-admin shadow-form">
      <form>
        {/* <Input value={values?._id} label="ID" disabled={true} id="id" /> */}
        <Input
          value={values?.statement}
          label="Énoncé"
          disabled={disabled}
          id="statement"
          onChange={(event) => {
            const { value } = event.target;

            setValues({ ...values, statement: value });
          }}
        />
        <div className="my-2">
          <label htmlFor="answer" className="form-label text-form">
            Réponses
          </label>
          <textarea
            style={{ fontSize: "12px" }}
            className="form-control"
            id="answer"
            disabled={disabled}
            value={values?.answer}
            rows="3"
            onChange={(event) => {
              const { value } = event.target;

              setValues({ ...values, answer: value });
            }}
          ></textarea>
          <div id="passwordHelp" className="text-form-ind">
            Mettre un retour a la ligne pour séparer les élément
          </div>
        </div>
        <div className="form-check my-4 form-switch">
          <label
            className="form-check-label text-form"
            htmlFor="multipleAnswer"
          >
            Choix multiples
          </label>
          <input
            disabled={disabled}
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="multipleAnswer"
            checked={values?.multipleAnswer}
            onChange={(event) => {
              const { value } = event.target;

              setValues({ ...values, multipleAnswer: event.target.checked });
            }}
          />
        </div>
        <div className="mb-2">
          <label htmlFor="difficulty" className="form-label text-form">
            Difficulté
          </label>
          <select
            className="form-select"
            value={values?.difficulty}
            disabled={disabled}
            onChange={(event) => {
              const { value } = event.target;

              setValues({ ...values, difficulty: value });
            }}
            required
          >
            <option value="easy">facile</option>
            <option value="medium">moyen</option>
            <option value="hard">difficile</option>
          </select>
        </div>
        <div className="my-2">
          <label htmlFor="tag" className="form-label text-form">
            Catégories
          </label>
          <textarea
            style={{ fontSize: "12px" }}
            className="form-control"
            id="tag"
            disabled={disabled}
            value={values?.tag}
            rows="3"
            onChange={(event) => {
              const { value } = event.target;

              setValues({ ...values, tag: value });
            }}
          ></textarea>
          <div id="passwordHelp" className="text-form-ind">
            Mettre un retour a la ligne pour séparer les élément
          </div>
        </div>
      </form>
      <button
        onClick={() => setDisabled(!disabled)}
        className="btn mt-2 mx-2 rounded-circle"
        style={{
          color: "white",
          backgroundColor: "#2c4a91",
        }}
      >
        <FontAwesomeIcon icon={faPen} />
      </button>
      <button
        onClick={() => {
          setDisabled(!disabled);
          saveQuestion(values._id, values);
        }}
        disabled={disabled}
        className="btn btn-success mt-2 mx-2"
      >
        Enregistrer
      </button>
      <button
        onClick={() => {
          confirmDeletion(values._id);
        }}
        disabled={disabled}
        className="btn btn-danger mt-2 mx-2 rounded-circle"
      >
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    </div>
  );
};

export default Question;
