/* eslint-disable @next/next/no-img-element */
import React from "react";

interface FooterProps {
  title?: string;
  buttonText?: string;
}


const EmailFooter: React.FC<FooterProps> = ({
  title = "DOWNLOAD OUR MOBILE APP AND EXPLORE MORE",
  buttonText = "Password Link",
}) => {
  return (
    <footer style={{ width: '100%', textAlign: 'center', padding: '40px 0', background: '#fff', borderRadius: '0 0 12px 12px' }}>
      <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#9070D1', margin: '0 0 24px 0' }}>{title}</p>
      {buttonText && (
        <a
          href="https://zuperior.com/dashboard"
          style={{
            display: 'inline-block',
            margin: '24px 0',
            padding: '14px 32px',
            background: 'linear-gradient(180deg, #9F4AFF 0%, #7A4AFF 100%)',
            color: '#fff',
            fontWeight: 'bold',
            borderRadius: '999px',
            textDecoration: 'none',
            boxShadow: '0px 4px 20px rgba(159, 74, 255, 0.5)'
          }}
        >
          {buttonText}
        </a>
      )}
      <p style={{ fontSize: '14px', color: '#888', margin: '24px 0 0 0' }}>
        DOWNLOAD OUR MOBILE APP AND EXPLORE MORE
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', margin: '32px 0 0 0' }}>
        <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
          <img src="https://zuperior-staging.onrender.com/emails/Google-Play.jpg" alt="Get it on Google Play" width={150} height={45} style={{ display: 'block', objectFit: 'contain' }} />
        </a>
        <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
          <img src="https://zuperior-staging.onrender.com/emails/apple-store-image.jpg" alt="Download on App Store" width={150} height={45} style={{ display: 'block', objectFit: 'contain' }} />
        </a>
      </div>
    </footer>
  );
};

export default EmailFooter;
