import EmailFooter from "./common/EmailFooter";
import EmailHeader from "./common/EmailHeader";
import depositSucces from "../../assets/emails/depositSucces.svg"

const DepositSuccess = () => {
  return (
    <>
      <EmailHeader
        bellImage={depositSucces}
        heading="Congratulations!"
        subHeading="Deposit Successful"
        HiName="Hi [Name]"
        subTitle="Your deposit of [Amount] has been successfully credited to your account. Thank you for your transaction."
        Title="For any queries, feel free to contact us."
        text="Zuperior Team"

      />
      <EmailFooter
        title="Discover all the exclusive features and benefits waiting for you inside."
        buttonText="Get Started"
      />
    </>
  );
};

export default DepositSuccess;
