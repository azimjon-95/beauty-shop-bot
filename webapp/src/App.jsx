import { useState } from 'react';
import { Icon, icons } from './components';
import { T } from './theme';
import Home   from './pages/Home';
import Posts  from './pages/Posts';
import Reply  from './pages/Reply';
import Groups from './pages/Groups';
import Images from './pages/Images';

const NAV = [
  { id: 'home',   icon: 'home',     label: 'Bosh'    },
  { id: 'posts',  icon: 'calendar', label: 'Postlar' },
  { id: 'reply',  icon: 'chat',     label: 'Javob'   },
  { id: 'groups', icon: 'users',    label: 'Guruhlar'},
  { id: 'images', icon: 'image',    label: 'Rasmlar' },
];

const PAGES = { home: Home, posts: Posts, reply: Reply, groups: Groups, images: Images };

export default function App() {
  const [tab, setTab]   = useState('home');
  const [stats, setStats] = useState(null);
  const Page = PAGES[tab];

  return (
    <div style={{ background: T.bg, minHeight: '100vh' }}>
      {/* Top glow */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 200, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 0%,rgba(232,82,122,.12) 0%,transparent 70%)',
      }} />

      <div style={{ position: 'relative', zIndex: 1, paddingBottom: 70 }}>
        <Page stats={stats} setStats={setStats} />
      </div>

      {/* Bottom Nav */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'rgba(22,8,14,.97)', backdropFilter: 'blur(24px)',
        borderTop: `1px solid ${T.border}`,
        display: 'flex', paddingBottom: 'env(safe-area-inset-bottom,6px)', zIndex: 100,
      }}>
        {NAV.map(n => (
          <button key={n.id} onClick={() => setTab(n.id)} style={{
            flex: 1, padding: '10px 0 7px', background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            color: tab === n.id ? T.pink : T.muted,
            fontSize: 9, fontWeight: tab === n.id ? 700 : 500,
            fontFamily: 'DM Sans,sans-serif', transition: 'color .2s',
          }}>
            <div style={{ position: 'relative' }}>
              <Icon d={icons[n.icon]} size={20} color={tab === n.id ? T.pink : T.muted} />
              {tab === n.id && (
                <div style={{
                  position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)',
                  width: 4, height: 4, borderRadius: '50%',
                  background: T.pink, boxShadow: `0 0 6px ${T.pink}`,
                }} />
              )}
            </div>
            {n.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
