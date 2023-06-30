import React from "react";

const Input = ({ label, id, value }) => {
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
        {/* <Input value={values?._id} label="ID" id="id" /> */}
        <Input value={values?.email} label="Email" id="email" />
        <Input value={values?.name} label="Nom" id="name" />
        <Input value={values?.password} label="Mot de passe" id="password" />
        <Input value={values?.role} label="Role" id="role" />
        <Input value={values?.spécialité} label="Spécialité" id="specialite" />
      </form>
    </div>
  );
};

export default Answer;
