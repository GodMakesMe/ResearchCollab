import React, { useEffect, useState } from 'react';
import './NotificationManager.css';

interface Notification {
  id: number;
  title: string;
  message: string;
  receivedAt: Date;
  // You can add additional properties as needed (e.g., read/unread status)
}

const NotificationManager: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newNotificationsCount, setNewNotificationsCount] = useState(0);

  // Placeholder: This method would get notifications from your backend or a realtime service.
  // For example, you might call an API endpoint or use websockets.
  const fetchNotifications = async () => {
    // Example placeholder logic:
    // const response = await fetch('/api/notifications');
    // const data = await response.json();
    // setNotifications(data);
    // For demo, we create some dummy data:
    const dummyNotifications: Notification[] = [
      {
        id: 1,
        title: 'New Research Paper Submitted',
        message: 'Professor Smith has submitted a new research paper.',
        receivedAt: new Date(),
      },
      {
        id: 2,
        title: 'System Update',
        message: 'The portal will undergo maintenance at midnight.',
        receivedAt: new Date(),
      },
    ];
    setNotifications(dummyNotifications);
    setNewNotificationsCount(dummyNotifications.length); // In a real app, count only unread notifications
  };

  // Toggle sidebar open/close
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    // Optionally, mark notifications as read when sidebar is opened.
    if (!isSidebarOpen) {
      setNewNotificationsCount(0);
    }
  };

  // Simulate fetching notifications when the component mounts
  useEffect(() => {
    fetchNotifications();

    // You might also set up a timer or real-time listener here.
    // Example: const intervalId = setInterval(() => fetchNotifications(), 60000);
    // return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      {/* Notification Popup */}
      <div
        onClick={toggleSidebar}
        className="relative -mt-1 cursor-pointer bg-white rounded-full p-2 shadow hover:ring-2 hover:ring-purple-300 transition duration-200"
      >
        <div className="text-xl text-purple-600 hover:text-purple-800">
          <i className="fas fa-bell"></i>
        </div>
        {newNotificationsCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5 py-0.5 shadow">
            {newNotificationsCount}
          </div>
        )}
      </div>



      {/* Notification Sidebar */}
      <div className={`notification-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Notifications</h2>
          <button onClick={toggleSidebar} className="close-btn">
            X
          </button>
        </div>
        <div className="sidebar-content">
          {notifications.length === 0 ? (
            <p>No notifications available</p>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className="notification-item">
                <h3 className="notif-title">{notif.title}</h3>
                <p className="notif-message">{notif.message}</p>
                <span className="notif-time">
                  {notif.receivedAt.toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationManager;
