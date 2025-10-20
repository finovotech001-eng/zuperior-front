import EmailFooter from "./common/EmailFooter";
import EmailHeader from "./common/EmailHeader";
import passwordChange from "../../assets/emails/passwordChange.svg"

const PasswordChange = () => {
  return (
    <>
      <EmailHeader
        bellImage={passwordChange}
        heading="congratulations"
        subHeading="Your Password Has Been Changed"
        HiName=""
        subTitle="This is to confirm that your account password has been changed successfully."
        Title="If you did not make this change, please contact our support team immediately."
        text="Zuperior Team"

      />
      <EmailFooter
        title="Discover all the exclusive features and benefits waiting for you inside"
        buttonText="Get Started"
      />
    </>
  );
};

export default PasswordChange;
