import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { toast } from 'sonner';

// Lazy import to avoid SSR issues
let ioClient: any;
function getSocket() {
  if (typeof window === 'undefined') return null;
  if (!ioClient) {
    try {
      // @ts-ignore
      ioClient = require('socket.io-client');
    } catch (e) {
      console.warn('socket.io-client not available:', e);
      return null;
    }
  }
  return ioClient;
}

export function useSessionCheck() {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem('userToken') || localStorage.getItem('token') || localStorage.getItem('access_token') || localStorage.getItem('accessToken');
    if (!token) return; // Not logged in, skip
    
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

    // Centralized logout helper
    const handleLogout = (reason: 'deleted' | 'expired' = 'expired') => {
      // Clear localStorage
      localStorage.removeItem('userToken');
      localStorage.removeItem('clientId');
      localStorage.removeItem('token');
      localStorage.removeItem('access_token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userId');
      
      // Dispatch logout action
      dispatch(logout());
      
      // Show toast
      const message = reason === 'deleted' 
        ? 'Your account was deleted. For your security, you have been logged out.'
        : 'Your session has expired. Please log in again.';
      toast.error(message, { duration: 5000 });
      
      // Redirect to login
      setTimeout(() => {
        window.location.href = '/login';
      }, 500);
    };

    // Setup websocket listener if available
    let socket: any = null;
    try {
      const io = getSocket();
      if (io && typeof io === 'function') {
        socket = io(serverUrl, {
          transports: ['websocket'],
          withCredentials: true,
        });
        
        socket.on('connect', () => {
          socket.emit('auth', { token });
        });
        
        socket.on('auth:ok', () => {
          console.log('Socket authenticated successfully');
        });
        
        socket.on('account-deleted', () => {
          handleLogout('deleted');
        });
      }
    } catch (e) {
      console.warn('WebSocket setup failed:', e);
    }

    // Fallback polling check
    let timer: any;
    const poll = async () => {
      try {
        const res = await fetch(`${serverUrl}/api/session/check-valid`, {
          credentials: 'include',
          headers: { 
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        });
        
        if (res.status === 401 || res.status === 403) {
          handleLogout('expired');
          return;
        }
        
        timer = setTimeout(poll, 30000); // Poll every 30 seconds
      } catch (e) {
        // On network error, retry after delay
        timer = setTimeout(poll, 30000);
      }
    };
    
    // Start polling after a short delay
    timer = setTimeout(poll, 5000);
    
    // Cleanup
    return () => {
      if (timer) clearTimeout(timer);
      if (socket) {
        try {
          socket.off('account-deleted');
          socket.disconnect();
        } catch {}
      }
    };
  }, [dispatch]);
}
