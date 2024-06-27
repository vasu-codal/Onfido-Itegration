/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { Onfido } from "onfido-sdk-ui";
import { Handle } from "onfido-sdk-ui/types/Onfido";
import Image from "next/image";

interface OnfidoComponentProps {
  applicantId: string;
  // onComplete: (data: any) => {};
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
  return data?.token;
};

const OnfidoComponent: React.FC<OnfidoComponentProps> = ({
  applicantId,
  // onComplete,
}) => {
  const [loading, setLoading] = useState(false);
  const [onfidoInstance, setOnfidoInstance] = useState<Handle | null>(null);

  const initOnfido = async () => {
    try {
      const token = await getToken(applicantId);
      const instance = await Onfido?.init({
        token: token,
        containerId: "onfido-mount",
        onComplete: (data: any) => {
          console.log("Onfido complete:", data);
          // onComplete(data);
        },
        steps: ["welcome", "document", "face", "complete"],
        // customUI: {
        //   colorBackgroundButtonPrimary: "#FF5733",
        //   colorBorderButtonPrimary: "#1892F0",
        //   colorBackgroundButtonPrimaryHover: "#20BCFF",
        //   colorBackgroundButtonPrimaryActive: "#20BCFF",
        // },
      });

      setOnfidoInstance(instance);
      setLoading(false);
    } catch (error) {
      console.log(error, "Error in Onfido Mounting Component");
    }
  };

  useEffect(() => {
    initOnfido();
    return () => {
      console.log("tear down", onfidoInstance);
      onfidoInstance && onfidoInstance.tearDown();
    };
  }, []);

  return (
    <div id="onfido-mount">
      {loading && (
        <div className="loader-parent flex justify-centerc items-center absolute">
          <Image src="/loader.svg" alt="My Icon" width={100} height={100} />
        </div>
      )}
    </div>
  );
};

export default OnfidoComponent;

// to customize UI of iframe

// steps: [
//           {
//             type: "welcome",
//             options: {
//               title: "Please prepare your documents",
//               descriptions: [
//                 "This process should only take a few minutes",
//                 "Use your phone to take a photograph of the following",
//                 "• Your identity document (e.g passport, driving licence, identity card, etc)",
//                 "• Selfie (i.e your face - pls remove hat, sunglasses - anything that might obscure your photo)",
//               ],
//             },
//           },
//           "document",
//           "face",
//           "complete",
//         ],
//         customUI: {
//           colorBackgroundButtonPrimary: "#FF5733",
//           colorBorderButtonPrimary: "#1892F0",
//           colorBackgroundButtonPrimaryHover: "#20BCFF",
//           colorBackgroundButtonPrimaryActive: "#20BCFF",
//         },
