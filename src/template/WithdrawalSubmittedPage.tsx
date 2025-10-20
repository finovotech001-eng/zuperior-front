import React from "react";
import EmailHeader from "./common/EmailHeader";
import EmailFooter from "./common/EmailFooter";
import file from "../../assets/emails/R-File.svg";

interface WithdrawalSubmittedPageProps {
  userName?: string;
}

const WithdrawalSubmittedPage: React.FC<WithdrawalSubmittedPageProps> = (
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
        bellImage={file}
        heading=""
        subHeading="Withdrawal Request Submitted"
        Title="Thank you for your patience."
        subTitle="Your withdrawal request has been received and is being processed. We will notify you once the transaction is complete."
        text="- Zuperior Team"
      />

      {/* Footer */}
      <EmailFooter
        title="Discover all the exclusive features and benefits waiting for you inside."
        buttonText="GET STARTED"
      />
    </div>
  );
};

export default WithdrawalSubmittedPage;
