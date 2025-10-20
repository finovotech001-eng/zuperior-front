/* eslint-disable @next/next/no-img-element */


interface EmailHeaderProps {
  bellImage?: string;
  heading: string;
  subHeading: string;
  HiName?: string;
  Title: string;
  subTitle: string;
  text: string;
}

// Use absolute URLs for images!
const COIN_URL = "https://zuperior-staging.onrender.com/emails/coin.png";
const BELL_URL = "https://zuperior-staging.onrender.com/emails/bell.png";

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
      <div style={{ width: '100%', textAlign: 'center', background: '#fff', borderRadius: '12px', padding: '40px 0 0 0' }}>
        <img src={COIN_URL} alt="Zuperior Coin" width={80} height={80} style={{ display: 'block', margin: '0 auto', borderRadius: '50%' }} />
        <h1 style={{ fontSize: 28, fontWeight: 'bold', color: '#4E3368', margin: '24px 0 0 0' }}>
          Think Superior Trade <span style={{ color: '#9070D1' }}>Zuperior</span>
        </h1>
        <p style={{ fontSize: 14, color: '#888', margin: '12px 0 0 0' }}>#1 Forex Trader Worldwide</p>
        <div style={{ position: 'relative', width: '100%', margin: '40px 0 0 0' }}>
          <img src={COIN_URL} alt="Zuperior Coin Large" width={150} height={150} style={{ display: 'block', margin: '0 auto', borderRadius: '50%' }} />
          <img src={bellImage || BELL_URL} alt="Bell" width={60} height={60} style={{ position: 'absolute', right: 'calc(50% - 75px)', bottom: '-20px', borderRadius: '50%' }} />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#4E3368', margin: '40px 0 0 0' }}>{heading}</h2>
        <h3 style={{ fontSize: 20, fontWeight: 600, color: '#9070D1', margin: '24px 0 0 0' }}>{subHeading}</h3>
        {HiName && (
          <h4 style={{ fontSize: 20, fontWeight: 600, color: '#4E3368', margin: '24px 0 0 0' }}>{HiName}</h4>
        )}
        {subTitle && (
          <p style={{ fontSize: 14, color: '#4E3368', fontWeight: 600, margin: '24px 0 0 0' }}>{subTitle}</p>
        )}
        {Title && (
          <p style={{ fontSize: 16, color: '#4E3368', fontWeight: 600, margin: '24px 0 0 0' }}>{Title}</p>
        )}
        {text && (
          <p style={{ fontSize: 14, color: '#888', fontWeight: 400, margin: '16px 0 0 0' }}>{text}</p>
        )}
      </div>
    </>
  );
};

export default EmailHeader;
