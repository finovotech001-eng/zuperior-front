import EmailFooter from "./common/EmailFooter";
import EmailHeader from "./common/EmailHeader";
import GradientCard from "./common/TextDialog";

const bellImageSrc = "https://zuperior-staging.onrender.com/emails/bell.png";

const WelcomeEmail = () => {
  return (
    <div style={{ background: '#f6f6f6', fontFamily: 'Arial, sans-serif', borderRadius: 12, maxWidth: 600, margin: '40px auto', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <EmailHeader
        bellImage={bellImageSrc}
        heading="Congratulations"
        subHeading="You’re onboarded with Zuperior"
        HiName=""
        Title="Welcome to our platform! We're excited to have you on board."
        subTitle=""
        text="Zuperior Team"
      />
      <GradientCard text="You are now part of a community with access to premium features, insights, and opportunities that await inside." />
      <EmailFooter
        title="Discover all the exclusive features and benefits waiting for you inside"
        buttonText="Get Started"
      />
    </div>
  );
};

export default WelcomeEmail;
