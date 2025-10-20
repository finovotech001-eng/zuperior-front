import EmailFooter from "./common/EmailFooter";
import EmailHeader from "./common/EmailHeader";
import depositRequestSubmit from "../../assets/emails/depositRequestSubmit.svg"

const DepositRequestSubmitted = () => {
  return (
    <>
      <EmailHeader
        bellImage={depositRequestSubmit}
        heading="congratulations"
        subHeading="Deposit Request Submitted"
        HiName=""
        subTitle="bv gth"
        Title="Thank You for your patience."
        text="Zuperior Team"

      />
      <EmailFooter
        title="Discover all the exclusive features and benefits waiting for you inside"
        buttonText="Get Started"
      />
    </>
  );
};

export default DepositRequestSubmitted;
