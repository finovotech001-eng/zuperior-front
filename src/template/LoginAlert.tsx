import EmailFooter from "./common/EmailFooter";
import EmailHeader from "./common/EmailHeader";
import loginuser from "../../assets/emails/loginuser.svg"

const LoginAlert = () => {
  return (
    <>
      <EmailHeader
        bellImage={loginuser}
        heading=""
        subHeading="Login Alert: New Sign-In to Your Account"
        HiName=""
        subTitle="Hi XYZ, We detected a login to your account from a new device or location: Device: [Device Name] Location: [City, Country] Time: [Date & Time]"
        Title="If you did not make this change, please contact our support team immediately."
        text="If this was you, no further action is needed. If you do not recognize this activity, please secure your account immediately by changing your password."

      />
      <EmailFooter
        title="Zuperior Team."
        buttonText=""
      />
    </>
  );
};

export default LoginAlert;
