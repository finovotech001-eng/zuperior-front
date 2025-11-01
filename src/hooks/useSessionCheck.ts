import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { toast } from 'sonner';

// Lazy import to avoid SSR issues and build-time errors
let ioClient: any;
let ioPromise: Promise<any> | null = null;

async function getSocket() {
  if (typeof window === 'undefined') return null;
  
  if (!ioClient && !ioPromise) {
    // Use dynamic import to avoid build-time errors
    ioPromise = import('socket.io-client')
      .then((module) => {
        ioClient = module.default || module;
        return ioClient;
      })
      .catch((e) => {
        console.warn('socket.io-client not available:', e);
        ioPromise = null;
        return null;
      });
  }
  
  if (ioPromise) {
    return await ioPromise;
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
    const socketRef = { current: null as any };
    (async () => {
      try {
        const io = await getSocket();
        if (io && typeof io === 'function') {
          socketRef.current = io(serverUrl, {
            transports: ['websocket'],
            withCredentials: true,
          });
          
          socketRef.current.on('connect', () => {
            socketRef.current.emit('auth', { token });
          });
          
          socketRef.current.on('auth:ok', () => {
            console.log('Socket authenticated successfully');
          });
          
          socketRef.current.on('account-deleted', () => {
            handleLogout('deleted');
          });
        }
      } catch (e) {
        console.warn('WebSocket setup failed:', e);
      }
    })();

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
      // Cleanup socket if it was created
      if (socketRef.current) {
        try {
          socketRef.current.off('account-deleted');
          socketRef.current.disconnect();
          socketRef.current = null;
        } catch {}
      }
    };
  }, [dispatch]);
}
