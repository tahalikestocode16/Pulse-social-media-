function PulseMascot({ size = 180 }) {
  return (
    <div 
      style={{ 
        position: 'relative', 
        width: `${size}px`, 
        height: `${size}px`,
        margin: '0 auto 16px auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Radial glowing backdrop aura */}
      <div 
        style={{
          position: 'absolute',
          inset: '-10px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.35) 0%, rgba(124,58,237,0.15) 60%, transparent 80%)',
          filter: 'blur(20px)',
          zIndex: 0,
          animation: 'pulseGlow 3s ease-in-out infinite alternate'
        }}
      />

      {/* 3D Mascot Image */}
      <img
        src="/pulse_mascot.png"
        alt="Pulse Mascot"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          position: 'relative',
          zIndex: 1,
          filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))'
        }}
      />
    </div>
  );
}

export default PulseMascot;
