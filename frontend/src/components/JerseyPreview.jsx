import React from 'react';

export const JerseyPreview = ({ name, number, type = 'HOME' }) => {
  // Valeurs par défaut si vides
  const displayName = (name || 'NOM').toUpperCase().slice(0, 12);
  const displayNumber = number !== undefined && number !== '' ? number : '12';

  // Determine background based on type
  let jerseyBackground = 'linear-gradient(90deg, #D2143A 0%, #D2143A 40%, #006B3C 40%, #006B3C 60%, #07080a 60%, #07080a 100%)'; // HOME default
  
  if (type === 'AWAY') {
    jerseyBackground = 'linear-gradient(90deg, #07080a 0%, #07080a 40%, #006B3C 40%, #006B3C 60%, #D2143A 60%, #D2143A 100%)'; // AWAY (Black dominance)
  } else if (type === 'THIRD') {
    jerseyBackground = 'linear-gradient(90deg, #f0f0f0 0%, #f0f0f0 40%, #D2143A 40%, #D2143A 50%, #006B3C 50%, #006B3C 60%, #f0f0f0 60%, #f0f0f0 100%)'; // THIRD (White/Grey with stripes)
  }

  return (
    <div className="flocage-preview-container" style={{
      background: 'linear-gradient(180deg, #11141a 0%, #07080a 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* Jersey Outline in CSS */}
      <div style={{
        position: 'relative',
        width: '260px',
        height: '340px',
        background: jerseyBackground,
        borderRadius: '24px 24px 10px 10px',
        boxShadow: '0 15px 35px rgba(0,0,0,0.5), inset 0 2px 10px rgba(255,255,255,0.15)',
        border: '3px solid #D4AF37', // Gold outline representing champions
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '35px'
      }}>
        {/* Hanger neck detailing */}
        <div style={{
          position: 'absolute',
          top: '-15px',
          width: '80px',
          height: '30px',
          background: '#07080a',
          borderRadius: '50%',
          borderBottom: '2px solid #D4AF37'
        }} />

        {/* Gold Champion Star at the neck */}
        <div style={{
          position: 'absolute',
          top: '15px',
          color: '#D4AF37',
          fontSize: '18px',
          fontWeight: 'bold',
          textShadow: '0 0 8px rgba(212,175,55,0.8)'
        }}>
          ★
        </div>

        {/* CUSTOM NAME DISPLAY */}
        <div style={{
          marginTop: '15px',
          width: '90%',
          textAlign: 'center',
        }}>
          <span style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: '800',
            fontSize: '22px',
            color: 'white',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            textShadow: '2px 2px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000, 0 5px 15px rgba(0,0,0,0.5)',
            display: 'inline-block',
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {displayName}
          </span>
        </div>

        {/* CUSTOM NUMBER DISPLAY */}
        <div style={{
          marginTop: '25px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '160px'
        }}>
          <span style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: '900',
            fontSize: '115px',
            lineHeight: '1',
            color: '#D4AF37', // Gold Number
            textShadow: '3px 3px 0px #000, -3px -3px 0px #000, 3px -3px 0px #000, -3px 3px 0px #000, 0 10px 20px rgba(0,0,0,0.6)',
            letterSpacing: '-2px'
          }}>
            {displayNumber}
          </span>
        </div>

        {/* Badge "FAR" or "ASKARY" on the lower tail */}
        <div style={{
          position: 'absolute',
          bottom: '15px',
          background: 'rgba(7, 8, 10, 0.8)',
          border: '1px solid rgba(212, 175, 55, 0.4)',
          borderRadius: '4px',
          padding: '2px 8px',
          fontSize: '9px',
          fontWeight: 'bold',
          letterSpacing: '1px',
          color: '#D4AF37',
          textTransform: 'uppercase'
        }}>
          ASKARY 12
        </div>
      </div>

      {/* Control Hint Panel */}
      <div style={{
        marginTop: '15px',
        textAlign: 'center',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--border-glass)',
        padding: '8px 16px',
        borderRadius: '8px',
        fontSize: '11px',
        color: 'var(--text-secondary)'
      }}>
        💡 <span style={{ color: 'var(--asfar-gold)', fontWeight: 'bold' }}>Flocage Officiel</span> • Aperçu 2D en temps réel
      </div>
    </div>
  );
};
export default JerseyPreview;
