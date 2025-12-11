import React, { useEffect, useState } from "react";
import Header from "../../../components/custom/Header";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import ResumePreview from "@/dashboard/resume/components/ResumePreview";
import GlobalApi from "@service/GlobalApi";
import { ResumeInfoContext } from "../../../context/ResumeInfoContext";

function ViewResume() {
  const [resumeInfo, setResumeInfo] = useState(null);
  const { resumeId } = useParams();

  useEffect(() => {
    GetResumeInfo();
  }, []);

  const GetResumeInfo = () => {
    GlobalApi.GetResumeById(resumeId)
      .then((resp) => {
        setResumeInfo(resp.data.data);
      })
      .catch((err) => {
        console.error("Resume fetch error:", err);
      });
  };

  // ✅ ✅ FINAL SAFEST DOWNLOAD METHOD
  const HandleDownload = () => {
    window.print();
  };

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      
      {/* ✅ THIS TOP SECTION WILL NOT BE PRINTED */}
      <div className="no-print">
        <Header />

        <div className="my-10 mx-10 md:mx-20 lg:ms-36">
          <h2 className="text-center text-2xl font-medium">
            Your AI Resume is Ready
          </h2>

          <p className="text-center text-gray-400">
            Click below to download your resume as PDF
          </p>

          <div className="flex justify-center px-44 my-10">
            <Button onClick={HandleDownload} className="theme-button">
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* ✅ THIS SECTION ONLY WILL BE PRINTED */}
      <div className="print-area my-10 mx-10 md:mx-20 lg:ms-36 bg-white">
        <ResumePreview />
      </div>

    </ResumeInfoContext.Provider>
  );
}

export default ViewResume;
