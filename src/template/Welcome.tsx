import EmailFooter from "./common/EmailFooter";
import EmailHeader from "./common/EmailHeader";
import Bell from "../../assets/emails/bell.svg"
import GradientCard from "./common/TextDialog";

const WelcomeEmail = () => {
  return (
    <>
      <EmailHeader
        bellImage={Bell}
        heading="Congratulations"
        subHeading="You’re onboarded with Zuperior"
        HiName=""
        Title="Welcome to our platform! We're excited to have you on board."
        subTitle=""
        text="Zuperior Team"

      />
        <GradientCard text="You are now part of an community with access to premium features, insights, and opportunities that await inside"/>

      <EmailFooter
        title="Discover all the exclusive features and benefits waiting for you inside"
        buttonText="Get Started"
      />
    </>
  );
};

export default WelcomeEmail;
