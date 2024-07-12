"use client";
import { useState, ChangeEvent } from "react";
import OnfidoComponent from "../components/OnfidoComponent";

interface FormData {
  firstName: string;
  lastName: string;
}

const Home: React.FC = () => {
  const [applicantId, setApplicantId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateApplicant = async (): Promise<void> => {
    const response = await fetch("/api/createApplicant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: formData.firstName,
        last_name: formData.lastName,
      }),
    });
    const { data } = await response.json();
    setApplicantId(data?.id);
  };

  return (
    <div className="m-5">
      <h1>Onfido Integration</h1>
      {!applicantId ? (
        <div className="create-applicant-wrapper flex gap-3">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-md mb-3"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-md mb-3"
          />
          <button
            onClick={handleCreateApplicant}
            className="bg-slate-900 text-white p-3 rounded-lg"
          >
            AutoFill
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={() => {
              setApplicantId(null);
            }}
            className="bg-slate-300 text-black p-3 m-3 rounded-lg"
          >
            Remove
          </button>
          <OnfidoComponent applicantId={applicantId} />
        </div>
      )}
    </div>
  );
};

export default Home;
