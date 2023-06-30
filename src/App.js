import "./App.css";
import "./index.css";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Connexion from "./_pages/Connexion";
import UserDashboard from "./_pages/Connexion/UserDashboard";
import AdminDashboard from "./_pages/AdminDashboard/AdminDashboard";
import unauthorized from "./_pages/Connexion/unauthorized";
import QuestionnaireSubmission from "./_pages/Connexion/QuestionnaireSubmission";

function App() {
  return (
    <Routes>
      <Route exact path="/" Component={Connexion} />
      <Route path="/user-dashboard" Component={UserDashboard} />
      <Route path="/admin-dashboard" Component={AdminDashboard} />
      <Route path="/unauthorized" Component={unauthorized} />
      <Route
        path="/QuestionnaireSubmission"
        Component={QuestionnaireSubmission}
      />
    </Routes>
  );
}

export default App;
