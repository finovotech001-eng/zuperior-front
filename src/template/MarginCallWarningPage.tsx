import React from "react";
import EmailHeader from "./common/EmailHeader";
import EmailFooter from "./common/EmailFooter";
import Warning from "../../assets/emails/R-Warning.svg";

interface MarginCallWarningPageProps {
  userName?: string;
}

const MarginCallWarningPage: React.FC<MarginCallWarningPageProps> = (
  {
    // userName = "[Name]",
  }
) => {
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
        bellImage={Warning}
        heading=""
        subHeading="Margin Call Warning - Low Account Balance"
        Title="If no action is taken, your positions may be closed automatically to protect your account."
        subTitle="Your account balance has fallen below the required margin maintenance level. Please deposit additional funds or close some positions to avoid liquidation."
        text="Please act promptly to manage your account and avoid any disruption."
      />

      {/* Footer */}
      <EmailFooter
        title="Discover all the exclusive features and benefits waiting for you inside."
        buttonText="GET STARTED"
      />
    </div>
  );
};

export default MarginCallWarningPage;
