import EmailFooter from "./common/EmailFooter";
import EmailHeader from "./common/EmailHeader";
import kycReject from "../../assets/emails/kycReject.svg"

const KycRejected = () => {
  return (
    <>
      <EmailHeader
        bellImage={kycReject}
        heading=""
        subHeading="Your KYC Rejected"
        HiName=""
        subTitle="Unfortunately, your KYC verification could not be approved at this time.Please review your details and resubmit your documents if you wish to try again."
        Title="If you need help, contact our support team"
        text="Zuperior Team"

      />
      <EmailFooter
        title=""
        buttonText="Help Center"
      />
    </>
  );
};

export default KycRejected;
