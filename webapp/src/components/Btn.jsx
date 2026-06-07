import { T } from '../theme';
export default function Btn({ children, onClick, small, full, outline, red, style }) {
  return (
    <button onClick={onClick} style={{
      background: outline ? 'transparent' : red
        ? 'rgba(255,60,70,0.12)'
        : `linear-gradient(135deg,${T.pink},#c2345e)`,
      color:  outline ? T.pink : red ? '#ff4d5a' : '#fff',
      border: outline ? `1.5px solid ${T.pink}` : 'none',
      borderRadius: small ? 10 : 14,
      padding: small ? '7px 14px' : full ? 14 : '11px 20px',
      fontSize: small ? 12 : 14, fontWeight: 700,
      fontFamily: 'DM Sans, sans-serif', cursor: 'pointer',
      width: full ? '100%' : 'auto',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      boxShadow: outline || red ? 'none' : '0 6px 20px rgba(232,82,122,0.35)',
      ...style,
    }}>
      {children}
    </button>
  );
}
