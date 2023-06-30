import React from "react";

const Input = ({ label, value }) => {
  return (
    <div className="my-2">
      <label className="form-label text-form">{label}</label>
      <input
        style={{
          fontSize: "12px",
        }}
        type="text"
        value={value}
        className="form-control content-admin"
        disabled={true}
      />
    </div>
  );
};

const Answer = ({ answer }) => {
  const [values, setValues] = React.useState(null);

  React.useEffect(() => {
    if (answer) {
      setValues(answer);
    }
  }, [answer]);

  return (
    <div className="bg-question-admin shadow-form" key={values?._id}>
      <form className="text-form-dark">
        <label
          style={{ fontSize: "18px" }}
          className="form-label text-form mt-4"
        >
          Questionnaire :
        </label>
        {/* <Input label="ID" value={values?._id} /> */}
        <Input label="email utilisateur" value={values?.idUser?.email} />
        <Input label="Nom d'utilisateur" value={values?.idUser?.name} />
        {values?.answers.map(({ questionId, answer }, index) => (
          <>
            <label
              style={{ fontSize: "18px" }}
              className="form-label text-form my-4"
            >{`Question ${index + 1} :`}</label>
            {/* <Input label={`ID`} value={questionId?._id} /> */}
            <Input label={`Énoncé`} value={questionId?.statement} />
            <Input label={`Réponse`} value={answer} />
            <Input label={`Catégorie`} value={questionId?.tag} />
          </>
        ))}
      </form>
    </div>
  );
};

export default Answer;
