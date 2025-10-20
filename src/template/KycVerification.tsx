import EmailFooter from "./common/EmailFooter";
import EmailHeader from "./common/EmailHeader";
import kycVerification from "../../assets/emails/kycVerification.svg"

const KycEmail = () => {
  return (
    <>
      <EmailHeader
        bellImage={kycVerification}
        heading=""
        subHeading="Verify Your Email To Complete KYC"
        HiName=""
        subTitle=""
        Title="Please verify your email by clicking the link below: "
        text="Zuperior Team"

      />
      <EmailFooter
        title="If you did not request this, please ignore this email Thank You!"
        buttonText="Verify your Email Address"
      />
    </>
  );
};

export default KycEmail;
