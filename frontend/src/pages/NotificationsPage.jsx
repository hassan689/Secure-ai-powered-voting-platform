import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { notificationAPI } from '../services/api'
import { toast } from 'react-toastify'

const NotificationsPage = () => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.VoterID || user?.voterid) {
      fetchNotifications()
      fetchUnreadCount()
    }
  }, [user])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const voterId = user?.VoterID || user?.voterid
      const data = await notificationAPI.getByVoter(voterId)
      setNotifications(data)
    } catch (error) {
      toast.error('Failed to load notifications')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const voterId = user?.VoterID || user?.voterid
      const data = await notificationAPI.getUnreadCount(voterId)
      setUnreadCount(data.unreadCount)
    } catch (error) {
      console.error('Failed to load unread count:', error)
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id)
      fetchNotifications()
      fetchUnreadCount()
    } catch (error) {
      toast.error('Failed to mark as read')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const voterId = user?.VoterID || user?.voterid
      await notificationAPI.markAllAsRead(voterId)
      fetchNotifications()
      fetchUnreadCount()
      toast.success('All notifications marked as read')
    } catch (error) {
      toast.error('Failed to mark all as read')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nothing to show</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.notificationid}
              className={`bg-white rounded-lg shadow-md p-6 ${
                !notification.isread ? 'border-l-4 border-primary-500' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{notification.title}</h3>
                    {!notification.isread && (
                      <span className="ml-2 w-2 h-2 bg-primary-500 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-2">{notification.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(notification.createdat).toLocaleString()}
                  </p>
                </div>
                {!notification.isread && (
                  <button
                    onClick={() => handleMarkAsRead(notification.notificationid)}
                    className="ml-4 text-primary-600 hover:text-primary-700 text-sm"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default NotificationsPage

