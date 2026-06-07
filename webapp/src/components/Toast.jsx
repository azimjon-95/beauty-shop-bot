import { useState, useCallback } from 'react';

export function useToast() {
  const [toast, setToast] = useState(null);
  const show = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }, []);
  return { toast, show };
}

export function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div style={{
      position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
      backgroundImage: toast.type === 'error'
        ? 'linear-gradient(135deg,#ff4d5a,#c0303a)'
        : 'linear-gradient(135deg,#e8527a,#c2345e)',
      color: '#fff', padding: '10px 22px', borderRadius: 22,
      fontSize: 13, fontWeight: 700, zIndex: 999,
      boxShadow: '0 6px 24px rgba(0,0,0,0.4)',
      whiteSpace: 'nowrap', animation: 'fadeUp .2s ease',
    }}>
      {toast.msg}
    </div>
  );
}
