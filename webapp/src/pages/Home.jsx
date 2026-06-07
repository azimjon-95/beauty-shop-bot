import { useEffect } from 'react';
import { api } from '../api';
import { Card, Icon, icons } from '../components';
import { T } from '../theme';

export default function Home({ stats, setStats }) {
  useEffect(() => { api.stats().then(s => s && setStats(s)).catch(() => {}); }, []);
  const items = [
    { icon: 'users',    val: stats?.groups ?? '—', label: 'Guruhlar', color: T.pink,    bg: 'rgba(232,82,122,.1)' },
    { icon: 'calendar', val: stats?.posts  ?? '—', label: 'Postlar',  color: T.gold,    bg: 'rgba(212,168,83,.1)' },
    { icon: 'chat',     val: stats?.rules  ?? '—', label: 'Javoblar', color: '#9b7fff', bg: 'rgba(155,127,255,.1)' },
    { icon: 'image',    val: stats?.images ?? '—', label: 'Rasmlar',  color: T.rose,    bg: 'rgba(255,143,171,.1)' },
  ];
  return (
    <div style={{ padding: '20px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, animation: 'fadeUp .4s ease' }}>
        <div style={{ width: 52, height: 52, borderRadius: 18, background: `linear-gradient(135deg,${T.pink},#8b1a3a)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, boxShadow: '0 8px 24px rgba(232,82,122,.4)' }}>💄</div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: T.text, fontFamily: 'Playfair Display,serif' }}>💕 Lady Shop</div>
          <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>Bot boshqaruvi</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14, animation: 'fadeUp .4s ease .05s both' }}>
        {items.map((s, i) => (
          <div key={i} style={{ background: T.card, borderRadius: 18, padding: '18px 14px', border: `1px solid ${T.border}`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -10, right: -10, width: 60, height: 60, borderRadius: '50%', background: s.bg }} />
            <div style={{ width: 36, height: 36, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <Icon d={icons[s.icon]} size={18} color={s.color} />
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 4, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <Card glow style={{ animation: 'fadeUp .4s ease .1s both' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(232,82,122,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon d={icons.chat} size={18} color={T.pink} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: T.text, fontSize: 14 }}>Avtomatik Javob</div>
              <div style={{ fontSize: 11, color: T.muted, marginTop: 1 }}>{stats?.waitMinutes ?? 3} daqiqa kutadi</div>
            </div>
          </div>
          <div style={{ padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: stats?.autoReplyEnabled !== false ? 'rgba(80,200,100,.12)' : 'rgba(255,60,70,.12)', color: stats?.autoReplyEnabled !== false ? '#4cd97a' : '#ff4d5a' }}>
            {stats?.autoReplyEnabled !== false ? '✓ Yoqiq' : "O'chiq"}
          </div>
        </div>
      </Card>
      <div style={{ background: 'rgba(232,82,122,.06)', borderRadius: 16, padding: 14, border: '1px solid rgba(232,82,122,.12)', animation: 'fadeUp .4s ease .15s both' }}>
        <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.7 }}>
          🌹 Postlar har kuni belgilangan vaqtda guruhlaringizga avtomatik yuboriladi.<br />
          💕 Savollarga bot o'zi javob beradi.
        </p>
      </div>
    </div>
  );
}
