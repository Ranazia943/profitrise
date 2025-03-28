import React, { useEffect, useState } from 'react';
import { Delete, GppGood } from "@mui/icons-material";
import { useAuthContext } from '../authcontext/AuthContext';
import toast from 'react-hot-toast';

const Notification = () => {
  const { authUser } = useAuthContext();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!authUser) return;

    const fetchNotifications = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${baseURL}/api/withdrawl/notifications/${authUser._id}`);
        const data = await response.json();
        setNotifications(data.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [authUser]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const deleteNotification = async (notificationId) => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${baseURL}/api/withdrawl/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to delete notification');
      
      setNotifications(notifications.filter(notification => notification._id !== notificationId));
      toast.success('Notification deleted successfully');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '100%', margin: '0 auto' }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: '600',
        marginBottom: '20px',
        textAlign: 'center',
        color: '#333'
      }}>Notifications</h1>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div 
              key={index} 
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                backgroundColor: notification.isRead ? '#f8f9fa' : '#e3f2fd',
                borderLeft: `4px solid ${notification.type === 'alert' ? '#ff4444' : '#00C851'}`,
                transition: 'all 0.3s ease',
                width: '100%'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <GppGood style={{ 
                  color: notification.type === 'alert' ? '#ff4444' : '#00C851',
                  fontSize: '24px'
                }} />
                <div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '500',
                    margin: '0 0 5px 0',
                    color: notification.type === 'alert' ? '#ff4444' : '#00C851'
                  }}>
                    {notification.title}
                  </h3>
                  <p style={{
                    fontSize: '16px',
                    margin: '0',
                    color: '#555'
                  }}>
                    {notification.message}
                  </p>
                </div>
              </div>
              <Delete 
                onClick={() => deleteNotification(notification._id)}
                style={{ 
                  color: '#ff4444',
                  cursor: 'pointer',
                  fontSize: '22px'
                }} 
              />
            </div>
          ))
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#666',
            fontSize: '18px'
          }}>
            No notifications available
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;