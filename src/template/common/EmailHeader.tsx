import Image from "next/image";
import coin from "../../../assets/emails/coin.svg";
import bell from "../../../assets/emails/bell.svg";

interface EmailHeaderProps {
  bellImage?: string;
  heading: string;
  subHeading: string;
  HiName?: string;
  Title: string;
  subTitle: string;
  text: string;
}

const EmailHeader = ({
  bellImage,
  heading = "Congratulations",
  subHeading = "You’re onboarded with Zuperior",
  HiName = "[Hi Name]",
  Title = " Please verify your email by clicking the link below",
  subTitle = "Your deposit request has been successfully submitted. We will notify you once the deposit is processed.",
  text = "Zuperior Team",
}: EmailHeaderProps) => {
  return (
    <>
      <div className="relativ flex flex-col items-center">
        {/* Top Image → Mobile only */}
        {/* <div className="absolute  block md:hidden">
          <Image
            src={bgImage}
            alt="top mobile image"
            height={300}
            width={400}
            className="filter brightness-[0.1]"
          />
        </div> */}

        {/* Mobile only - Bottom Image */}
        {/* <div className="absolute top-[65%] block md:hidden">
          <Image
            src={bgImage}
            alt="bottom mobile image"
            height={300}
            width={400}
            className="filter brightness-[0.1]"
          />
        </div> */}

        {/* Tablet (md → lg) - Top Image */}
        {/* <div className="absolute hidden md:block lg:block xl:hidden lg:top-0 md:left-[20%] lg:left-[15%] z-0">
          <Image
            src={bgImage}
            alt="first image"
            className="filter brightness-[0.1] md:w-[400px] lg:w-[550px]"
          />
        </div> */}

        {/* Tablet (md → lg) - Bottom Image */}
        {/* <div className="absolute hidden md:block lg:block xl:hidden md:top-[70%] md:right-[15%] lg:top-[55%] lg:right-[15%] z-0">
          <Image
            src={bgImage}
            alt="second image"
            className="filter brightness-[0.1] md:w-[400px] lg:w-[550px]"
          />
        </div> */}

        {/* XL screens (1280px - 1535px) - Top Image */}
        {/* <div className="hidden xl:block 2xl:hidden absolute left-[24%] top-0 z-0">
          <Image
            src={bgImage}
            alt="xl image top"
            height={400}
            width={600}
            className="filter brightness-[0.1]"
          />
        </div> */}

        {/* XL screens (1280px - 1535px) - Bottom Image */}
        {/* <div className="hidden xl:block 2xl:hidden absolute right-[21%] top-[55%] z-0">
          <Image
            src={bgImage}
            alt="xl image bottom"
            height={400}
            width={600}
            className="filter brightness-[0.1]"
          />
        </div> */}

        {/* 2XL screens (1536px - 1919px) - LAPTOP SIZE - Top Image */}
        {/* <div className="hidden 2xl:block 3xl:hidden absolute top-0 left-[28%]">
          <Image
            src={bgImage}
            alt="laptop top image"
            height={400}
            width={600}
            className="filter brightness-[0.1]"
          />
        </div> */}

        {/* 2XL screens (1536px - 1919px) - LAPTOP SIZE - Bottom Image */}
        {/* <div className="hidden 2xl:block 3xl:hidden absolute top-[55%] right-[30%]">
          <Image
            src={bgImage}
            alt="laptop bottom image"
            height={800}
            width={600}
            className="filter brightness-[0.1]"
          />
        </div> */}

        {/* Main Coin Center */}
        <div className="flex justify-center items-center pt-10 relative z-10">
          <Image
            src={coin}
            alt="coin"
            height={80}
            width={80}
            className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] md:w-[80px] md:h-[80px] "
          />
        </div>

        <h1 className="text-[24px] lg:text-[32px] text-center font-semibold  relative z-10 px-4">
          Think Superior <br />
          Trade
          <span className="bg-gradient-to-r from-[#9070D1] to-[#9070D1] bg-clip-text text-transparent ml-2 font-semibold">
            Zuperior
          </span>
        </h1>

        <p className="text-center text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] text-[#ffffff]/65 pt-3 relative z-10">
          #1 Forex Trader Worldwide
        </p>

        {/* Large Coin Container */}
        <div className="relative flex justify-center items-center pt-20  z-10">
          <Image
            src={coin}
            alt="coin"
            height={150}
            width={150}
            className="sm:w-[80px] sm:h-[80px] md:w-[150px] md:h-[150px] lg:w-[150px] lg:h-[150px] 2xl:h-[200px] 2xl:w-[200px] "
          />

          {/* Bell - Bottom Right side of coin - Always shows bell */}
          <div className="absolute bottom-0 right-0 translate-x-[15%] translate-y-[15%]">
            <Image
              src={bellImage || bell}
              alt="bell"
              height={100}
              width={100}
              className="w-[90px] sm:w-[100px] md:w-[100px] lg:w-[100px] lg:h-[120px] 2xl:w-[120px] 2xl:h-[120px]"
            />
          </div>
        </div>
      </div>

      <div className="pt-20 z-10 px-5">
        {heading && (
          <h3 className="text-center font-semibold text-[24px] lg:text-[32px] ">
            {heading}
          </h3>
        )}
        <h4 className="pt-10 font-semibold bg-gradient-to-r from-[#C6ABEE] to-[#FFFFFF] bg-clip-text text-transparent text-center text-[24px] lg:text-[38px]">
          {subHeading}
        </h4>

        {HiName && (
          <h4 className="pt-10 font-semibold text-white text-center text-[24px] lg:text-[38px]">
            {HiName}
          </h4>
        )}

        <div className="gap-10">
          {subTitle && (
            <p className="text-center max-w-[800px] w-full mx-auto font-semibold text-[14px] lg:text-[20px] pt-10">
              {subTitle}
            </p>
          )}

          {Title && (
            <p className="text-center font-semibold text-[14px] lg:text-[20px] pt-10 ">
              {Title}
            </p>
          )}

          {text && (
            <p className="text-center font-semibold text-[14px] lg:text-[20px] pt-10">
              {text}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default EmailHeader;
