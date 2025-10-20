import EmailFooter from "./common/EmailFooter";
import EmailHeader from "./common/EmailHeader";
import depositPending from "../../assets/emails/depositPending.svg"

const DepositPending = () => {
  return (
    <>
      <EmailHeader
        bellImage={depositPending}
        heading=""
        subHeading="Deposit Pending"
        HiName="Hi [Name]"
        subTitle="Your deposit of [Amount] is currently pending and under processing. We will notify you once the status is updated."
        Title="Thank you for your patience"
        text="Zuperior Team"

      />
      <EmailFooter
        title="Discover all the exclusive features and benefits waiting for you inside."
        buttonText="Get Started"
      />
    </>
  );
};

export default DepositPending;
