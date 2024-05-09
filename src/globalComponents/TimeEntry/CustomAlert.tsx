import React from 'react';

const CustomAlert = ({ hidden, toggleDialog, message, linkText, linkUrl }:any) => {
  const messageParts = message.split("click here");

  return (
    <div style={{ display: hidden ? 'none' : 'block', position: 'fixed', top: '10%', left: '40%', transform: 'translate(-50%, -50%)', backgroundColor: 'White', borderRadius: '10px', padding: '20px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.4)', zIndex: 999, maxWidth:600 }}>
      <h4 style={{ marginBottom: '10px', marginTop:"0px",fontWeight:600 }}>Alert</h4>
      <p style={{ margin: '0' }}>
        {messageParts[0]}
        <a href={linkUrl} target="_blank" data-interception="off" rel="noreferrer noopener" style={{ margin: '0 4px',fontWeight:600 }}>
          {linkText}
        </a>
        {messageParts[1]}
      </p>
      <div style={{ textAlign: 'right', marginTop: '20px' }}>
      <button onClick={toggleDialog} style={{ padding: '8px 8px', backgroundColor: '#0078d4', color: 'white', borderRadius: '20px', cursor: 'pointer', width:"5rem", border: "none" }}>OK</button>
      </div>
    </div>
  );
};

export default CustomAlert;
