import { useEffect, useState } from "react";
import { Onfido } from "onfido-sdk-ui";
import { Handle } from "onfido-sdk-ui/types/Onfido";
import Image from "next/image";

interface OnfidoComponentProps {
  applicantId: string;
}

interface ExtractedData {
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  date_of_expiry: string;
  document_number: string;
}

const getToken = async (applicantId: string): Promise<string> => {
  const response = await fetch("/api/onfidoToken", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ applicantId }),
  });
  const { data } = await response.json();
  return data?.token || "";
};

const getWorkFlowId = async (applicantId: string): Promise<string> => {
  const response = await fetch("/api/getWorkFlowRunID", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ applicantId }),
  });
  const { data } = await response.json();
  return data?.id || "";
};

const getExtractedData = async (
  document_id: string
): Promise<ExtractedData | null> => {
  const response = await fetch("/api/getExtractedData", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ document_id }),
  });
  const { data } = await response.json();
  return data?.extracted_data || null;
};

const OnfidoComponent: React.FC<OnfidoComponentProps> = ({ applicantId }) => {
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(
    null
  );
  const [onFidoInstance, setOnFidoInstance] = useState<any>();
  const [isModalVisible, setIsModalVisible] = useState(true);

  const getDocumentInfo = async (data: any) => {
    try {
      const uploadDocumentStep = data["upload_document_photo_419b9"];
      if (uploadDocumentStep && uploadDocumentStep.output) {
        const documentOutput = uploadDocumentStep.output;
        const onCompleteInfo = {
          documentType: documentOutput.type,
          frontSideId: documentOutput?.sides?.front?.id,
          backSideId: documentOutput?.sides?.back?.id,
        };
        if (onCompleteInfo?.frontSideId) {
          const tempData = await getExtractedData(onCompleteInfo?.frontSideId);
          setExtractedData((prevState) => ({
            ...prevState,
            ...tempData,
          }));
        }

        if (onCompleteInfo?.backSideId) {
          const tempData = await getExtractedData(onCompleteInfo?.backSideId);
          setExtractedData((prevState) => ({
            ...prevState,
            ...tempData,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching document info:", error);
    }
  };

  const initOnfido = async () => {
    try {
      setLoading(true);
      const token = await getToken(applicantId);
      const workFlowId = await getWorkFlowId(applicantId);

      const instance = await Onfido?.init({
        token,
        containerId: "onfido-mount",
        workflowRunId: workFlowId,
        onComplete: (data: any) => {
          console.log(data, "onCompleteData");
          getDocumentInfo(data);
          setIsModalVisible(false);
        },
      });
      setOnFidoInstance(instance);
      setLoading(false);
    } catch (error) {
      console.error("Error initializing Onfido:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isModalVisible) {
      initOnfido();
    }

    return () => {
      onFidoInstance && onFidoInstance?.tearDown();
    };
  }, [isModalVisible]);

  return (
    <div>
      {isModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative min-h-[648px]">
            <button
              onClick={() => setIsModalVisible(false)}
              className="absolute top-2 right-2 text-gray-600"
            >
              ×
            </button>
            <div id="onfido-mount"></div>
          </div>
        </div>
      )}
      {extractedData && (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Document Details</h2>
            <div className="mb-2">
              <span className="font-bold">First Name: </span>
              <span>{extractedData.first_name}</span>
            </div>
            <div className="mb-2">
              <span className="font-bold">Last Name: </span>
              <span>{extractedData.last_name}</span>
            </div>
            <div className="mb-2">
              <span className="font-bold">Gender: </span>
              <span>{extractedData.gender}</span>
            </div>
            <div className="mb-2">
              <span className="font-bold">Date of Birth: </span>
              <span>{extractedData.date_of_birth}</span>
            </div>
            <div className="mb-2">
              <span className="font-bold">Date of Expiry: </span>
              <span>{extractedData.date_of_expiry}</span>
            </div>
            <div className="mb-2">
              <span className="font-bold">Document Number: </span>
              <span>{extractedData.document_number}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnfidoComponent;
