import { T } from '../theme';
export default function Toggle({ on, onClick }) {
  return (
    <div onClick={onClick} style={{
      width: 50, height: 28, cursor: 'pointer', borderRadius: 14,
      background: on ? `linear-gradient(135deg,${T.pink},#c2345e)` : 'rgba(255,255,255,0.08)',
      position: 'relative', transition: 'background .3s',
      boxShadow: on ? '0 4px 12px rgba(232,82,122,0.4)' : 'none',
    }}>
      <div style={{
        position: 'absolute', top: 4, left: on ? 26 : 4,
        width: 20, height: 20, background: '#fff', borderRadius: '50%',
        transition: 'left .3s', boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      }} />
    </div>
  );
}
