import React from "react";
import EmailHeader from "./common/EmailHeader";
import EmailFooter from "./common/EmailFooter";
import Notebook from "../../assets/R-Notebook.svg";
interface CompliancePageProps {
  userName?: string;
  effectiveDate?: string;
}

const CompliancePage: React.FC<CompliancePageProps> = ({
  // userName = "[Name]",
  effectiveDate = "[Date]",
}) => {
  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: "linear-gradient(to bottom, #000000 0%, #261933 100%)",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        color: "white",
      }}
    >
      {/* Header */}
      <EmailHeader
        bellImage={Notebook}
        heading=""
        subHeading="Important Update: Compliance And Policy Changes"
        Title="Please review the updated policies [link or attachment] at your convenience. If you have any questions or need further clarification, feel free to reach out to our support team."
        subTitle={`We want to inform you about recent updates to our compliance policies and procedures, effective from ${effectiveDate}. These changes are designed to ensure we continue to meet regulatory requirements and provide you with secure and reliable services.`}
        text="Thank you for your understanding and cooperation."
      />

      {/* Footer */}
      <EmailFooter
        title="Discover all the exclusive features and benefits waiting for you inside."
        buttonText="GET STARTED"
      />
    </div>
  );
};

export default CompliancePage;
