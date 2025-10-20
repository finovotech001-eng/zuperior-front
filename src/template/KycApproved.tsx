import EmailFooter from "./common/EmailFooter";
import EmailHeader from "./common/EmailHeader";
import kycApproved from "../../assets/emails/kycApproved.svg";
import GradientCard from "./common/TextDialog";

const KycApproved = () => {
  return (
    <>
      <EmailHeader
        bellImage={kycApproved}
        heading="Congratulations"
        subHeading="Your KYC is Approved"
        HiName=""
        subTitle=""
        Title="Your account has been successfully created We're thrilled you joined"
        text="Zuperior Team"
      />
      <GradientCard text="You are now part of an community with access to premium features, insights, and opportunities that await inside" />
      <EmailFooter
        title="Discover all the exclusive features and benefits waiting for you inside."
        buttonText="Dashboard"
      />
    </>
  );
};

export default KycApproved;
