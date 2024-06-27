"use client";
import { useState } from "react";
import OnfidoComponent from "../components/OnfidoComponent";

const Home = () => {
  const [applicantId, setApplicantId] = useState(null);

  const handleCreateApplicant = async () => {
    const response = await fetch("/api/createApplicant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: "Vasu",
        last_name: "Sojitra",
        dob: "1990-01-31",
        address: {
          building_number: "100",
          street: "Main Street",
          town: "London",
          postcode: "SW4 6EH",
          country: "GBR",
        },
      }),
    });
    const { data } = await response.json();
    setApplicantId(data?.id);
  };

  const handleAmlCheck = async () => {
    const response = await fetch("/api/performAmlCheck", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ applicantId }),
    });
    const amlData = await response.json();
    console.log("AML Check Result:", amlData);
  };

  const handleDocs = async () => {
    const response = await fetch("/api/documents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ applicantId }),
    });
    const Data = await response.json();
    console.log("Doc List:", Data);
  };

  return (
    <div className="m-5">
      <h1>Onfido Integration</h1>
      {!applicantId && (
        <div className="create-applicant-wrapper">
          <button
            onClick={handleCreateApplicant}
            className="bg-slate-900 text-white p-3 rounded-lg"
          >
            Create Applicant
          </button>
        </div>
      )}
      {applicantId && (
        <div className="my-3 mx-72">
          <OnfidoComponent
            applicantId={applicantId}
            onComplete={(data) => {
              console.log(data);
            }}
          />
        </div>
      )}
      {applicantId && <button onClick={handleDocs}>Get Doc List</button>}
    </div>
  );
};

export default Home;
