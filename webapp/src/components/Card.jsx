import { T } from '../theme';
export default function Card({ children, style, glow }) {
  return (
    <div style={{ background: T.card, borderRadius: 18, padding: 16, marginBottom: 12, border: `1px solid ${T.border}`, boxShadow: glow ? '0 0 24px rgba(232,82,122,0.12)' : 'none', ...style }}>
      {children}
    </div>
  );
}
