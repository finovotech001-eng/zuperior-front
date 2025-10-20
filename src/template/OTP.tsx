import EmailFooter from "./common/EmailFooter";
import EmailHeader from "./common/EmailHeader";
import otp from "../../assets/emails/otp.svg";
import { Input } from "@/components/ui/input";

const OTPEmail = () => {
  return (
    <>
      <EmailHeader
        bellImage={otp}
        heading="Hi [Name]"
        subHeading="Your Verification Code is"
        HiName=""
        subTitle="This OTP is valid for 15 minutes.Please do not share it with anyone for security reasons."
        Title=""
        text="Zuperior Team"
      />
      <div className="py-5 items-center flex justify-center gap-7 md:gap-10 px-5">
        <Input className="w-[70px] h-[70px] bg-[#0A0310]" />
        <Input className="w-[70px] h-[70px] bg-[#0A0310]" />
        <Input className="w-[70px] h-[70px]  bg-[#0A0310]" />
        <Input className="w-[70px] h-[70px] bg-[#0A0310]" />
      </div>
      <EmailFooter
        title="Discover all the exclusive features and benefits waiting for you inside."
        buttonText="DashBoard"
      />
    </>
  );
};

export default OTPEmail;
