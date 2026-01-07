import React from "react";
import AdmissionProcess from "../components/AdmissionProcess";
import KindergartenWelcome from "../components/KindergartenWelcome";
import FeeStructure from "../components/FeeStructure";

const AdmissionDetails = () => {
  return (
    <div>
      <KindergartenWelcome />
      <AdmissionProcess />
      <FeeStructure/>
    </div>
  );
};

export default AdmissionDetails;
