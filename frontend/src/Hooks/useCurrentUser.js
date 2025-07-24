import { useEffect, useState } from 'react';

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

function useCurrentUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const payload = parseJwt(token);
    if (!payload || !payload.exp) return;

    const expiryTime = payload.exp * 1000; // sec -> ms
    const now = Date.now();

    if (now >= expiryTime) {
      // token expirat
      refreshAccessToken().then(newToken => {
        if (newToken) {
          localStorage.setItem('token', newToken);
          fetchUser(newToken);
        } else {
          setUser(null);
        }
      });
    } else {
      fetchUser(token);
      // setează timer să-l reînnoiască cu 1 min înainte să expire
      const timeout = expiryTime - now - 60_000;
      if (timeout > 0) {
        const refreshTimer = setTimeout(() => {
          refreshAccessToken().then(newToken => {
            if (newToken) {
              localStorage.setItem('token', newToken);
              fetchUser(newToken);
            } else {
              setUser(null);
            }
          });
        }, timeout);
        return () => clearTimeout(refreshTimer); // cleanup la unmount
      }
    }
  }, []);

  const fetchUser = (token) => {
    fetch('/api/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data))
      .catch(() => setUser(null));
  };

  const refreshAccessToken = async () => {
    try {
      const res = await fetch('/api/refresh-token', {
        method: 'POST',
        credentials: 'include', // ca să trimită HttpOnly cookie-ul
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.accessToken;
    } catch (err) {
      console.error('Eroare la refresh:', err);
      return null;
    }
  };

  return user;
}

export default useCurrentUser;
