import EmailFooter from "./common/EmailFooter";
import EmailHeader from "./common/EmailHeader";
import passwordRequest from "../../assets/emails/PasswordRequest.svg"

const PasswordRequest = () => {
  return (
    <>
      <EmailHeader
        bellImage={passwordRequest}
        heading=""
        subHeading="Password Reset Request"
        HiName=""
        subTitle="We received a request to reset the password for your account. Click the link below to set a new password."
        Title=""
        text=""

      />
      <EmailFooter
        title="If you did not request this, please ignore this email or contact our support team."
        buttonText="Password Link"
      />
    </>
  );
};

export default PasswordRequest;
