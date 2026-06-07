const req = async (method, url, body) => {
  const res = await fetch(url, {
    method,
    headers: body && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {},
    body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
  });
  return res.json();
};

export const api = {
  stats:        ()       => req('GET',    '/api/stats'),
  getGroups:    ()       => req('GET',    '/api/groups'),
  addGroup:     d        => req('POST',   '/api/groups', d),
  deleteGroup:  id       => req('DELETE', `/api/groups/${id}`),
  getSchedule:  ()       => req('GET',    '/api/schedule'),
  addPost:      d        => req('POST',   '/api/schedule', d),
  deletePost:   id       => req('DELETE', `/api/schedule/${id}`),
  getReply:     ()       => req('GET',    '/api/reply'),
  toggleReply:  ()       => req('POST',   '/api/reply/toggle'),
  setWait:      min      => req('POST',   '/api/reply/wait', { wait_minutes: min }),
  addRule:      d        => req('POST',   '/api/reply/rules', d),
  deleteRule:   id       => req('DELETE', `/api/reply/rules/${id}`),
  getImages:    ()       => req('GET',    '/api/images'),
  uploadImages: formData => req('POST',   '/api/images', formData),
  deleteImage:  name     => req('DELETE', `/api/images/${name}`),
};
