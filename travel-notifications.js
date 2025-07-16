// Notifications JavaScript for EasyFly
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase auth check
    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            window.location.href = 'SignIn.html';
            return;
        }
        initializeNotifications();
    });

    // Sample notifications data
    let notificationsData = [
        {
            id: 1,
            source: 'Flights',
            type: 'flights',
            icon: 'fas fa-plane',
            title: 'Flight Delay Notification',
            message: 'Your flight SV 1234 from RUH to JED has been delayed until 4:00 PM due to weather conditions.',
            time: '2025-01-15T14:30:00',
            isRead: false,
            priority: 'high',
            actions: ['View Flight', 'Reschedule']
        },
        {
            id: 2,
            source: 'Luggage',
            type: 'luggage',
            icon: 'fas fa-suitcase',
            title: 'Baggage Ready for Pickup',
            message: 'Your baggage EF001234567 has arrived at Carousel 3, Terminal 1 and is ready for pickup.',
            time: '2025-01-15T16:45:00',
            isRead: false,
            priority: 'normal',
            actions: ['View Location', 'Mark Collected']
        },
        {
            id: 3,
            source: 'Flights',
            type: 'flights',
            icon: 'fas fa-plane',
            title: 'Gate Change Alert',
            message: 'Gate changed for flight XY 5678 from B7 to B12. Please proceed to the new gate.',
            time: '2025-01-16T09:00:00',
            isRead: true,
            priority: 'high',
            actions: ['View Gate Map']
        },
        {
            id: 4,
            source: 'General',
            type: 'general',
            icon: 'fas fa-info-circle',
            title: 'Check-in Reminder',
            message: 'Online check-in is now available for your flight SV 9876 departing tomorrow at 6:00 PM.',
            time: '2025-01-16T18:00:00',
            isRead: true,
            priority: 'normal',
            actions: ['Check In Now']
        },
        {
            id: 5,
            source: 'Luggage',
            type: 'luggage',
            icon: 'fas fa-suitcase',
            title: 'Baggage Delayed',
            message: 'Your baggage EF001234570 is experiencing delays. Expected arrival time: 2:30 PM.',
            time: '2025-01-17T14:20:00',
            isRead: false,
            priority: 'normal',
            actions: ['Track Baggage', 'Contact Support']
        },
        {
            id: 6,
            source: 'Flights',
            type: 'flights',
            icon: 'fas fa-plane',
            title: 'Boarding Started',
            message: 'Boarding has started for flight XY 2468 at Gate A5. Please proceed to the gate immediately.',
            time: '2025-01-14T06:15:00',
            isRead: true,
            priority: 'high',
            actions: ['View Boarding Pass']
        }
    ];

    let currentFilter = 'all';

    function initializeNotifications() {
        displayNotifications();
        setupEventListeners();
        setupLogout();
        
        // Simulate real-time notifications
        setInterval(() => {
            simulateNewNotification();
        }, 60000); // Every minute for demo
    }

    function setupEventListeners() {
        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentFilter = this.dataset.filter;
                displayNotifications();
            });
        });

        // Mark all read button
        document.getElementById('mark-all-read').addEventListener('click', markAllAsRead);
        
        // Clear all button
        document.getElementById('clear-all').addEventListener('click', clearAllNotifications);
    }

    function displayNotifications() {
        const notificationsList = document.getElementById('notifications-list');
        const emptyState = document.getElementById('empty-state');
        
        // Filter notifications
        let filteredNotifications = notificationsData;
        
        if (currentFilter !== 'all') {
            if (currentFilter === 'unread') {
                filteredNotifications = notificationsData.filter(n => !n.isRead);
            } else {
                filteredNotifications = notificationsData.filter(n => n.type === currentFilter);
            }
        }

        // Sort by time (newest first)
        filteredNotifications.sort((a, b) => new Date(b.time) - new Date(a.time));

        if (filteredNotifications.length === 0) {
            notificationsList.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        notificationsList.style.display = 'flex';
        emptyState.style.display = 'none';
        notificationsList.innerHTML = '';

        filteredNotifications.forEach(notification => {
            const notificationElement = createNotificationElement(notification);
            notificationsList.appendChild(notificationElement);
        });
    }

    function createNotificationElement(notification) {
        const element = document.createElement('div');
        element.className = `notification-item ${notification.type} ${!notification.isRead ? 'unread' : ''} ${notification.priority === 'high' ? 'high-priority' : ''}`;
        element.dataset.id = notification.id;

        element.innerHTML = `
            <div class="notification-header">
                <div class="notification-source">
                    <div class="notification-icon ${notification.type}">
                        <i class="${notification.icon}"></i>
                    </div>
                    ${notification.source}
                </div>
                <div class="notification-time">
                    <i class="fas fa-clock"></i>
                    ${formatTime(notification.time)}
                    ${!notification.isRead ? '<div class="unread-indicator"></div>' : ''}
                </div>
            </div>
            <div class="notification-title">${notification.title}</div>
            <div class="notification-message">${notification.message}</div>
            <div class="notification-actions">
                ${notification.actions.map(action => 
                    `<button class="notification-btn ${action === notification.actions[0] ? 'primary' : ''}" 
                     onclick="handleNotificationAction('${action}', ${notification.id})">
                        ${action}
                    </button>`
                ).join('')}
                <button class="notification-btn" onclick="dismissNotification(${notification.id})">
                    <i class="fas fa-times"></i> Dismiss
                </button>
            </div>
        `;

        // Mark as read when clicked
        element.addEventListener('click', (e) => {
            if (!e.target.classList.contains('notification-btn')) {
                markAsRead(notification.id);
            }
        });

        return element;
    }

    function formatTime(timeString) {
        const now = new Date();
        const time = new Date(timeString);
        const diffInMinutes = Math.floor((now - time) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;
        
        return time.toLocaleDateString();
    }

    function markAsRead(notificationId) {
        const notification = notificationsData.find(n => n.id === notificationId);
        if (notification && !notification.isRead) {
            notification.isRead = true;
            displayNotifications();
        }
    }

    function markAllAsRead() {
        notificationsData.forEach(notification => {
            notification.isRead = true;
        });
        displayNotifications();
        showToast('All notifications marked as read', 'success');
    }

    function clearAllNotifications() {
        if (confirm('Are you sure you want to clear all notifications? This action cannot be undone.')) {
            notificationsData = [];
            displayNotifications();
            showToast('All notifications cleared', 'info');
        }
    }

    function dismissNotification(notificationId) {
        notificationsData = notificationsData.filter(n => n.id !== notificationId);
        displayNotifications();
        showToast('Notification dismissed', 'info');
    }

    window.handleNotificationAction = function(action, notificationId) {
        const notification = notificationsData.find(n => n.id === notificationId);
        
        switch(action) {
            case 'View Flight':
                window.location.href = 'Scanner.html';
                break;
            case 'View Location':
            case 'Track Baggage':
                window.location.href = 'DashBoard.html';
                break;
            case 'Check In Now':
                showToast('Redirecting to check-in...', 'info');
                break;
            case 'Contact Support':
                window.location.href = 'ChatBot.html';
                break;
            case 'View Gate Map':
                showToast('Opening gate map...', 'info');
                break;
            case 'View Boarding Pass':
                if (notification) {
                    // Simulate opening boarding pass
                    const flightData = {
                        id: 'EF004',
                        flightNumber: 'XY 2468',
                        airline: 'Flynas',
                        status: 'missed',
                        departure: { code: 'DMM', name: 'King Fahd International', time: '06:45' },
                        arrival: { code: 'KWI', name: 'Kuwait International', time: '08:15' },
                        gate: 'A5',
                        seat: '22B',
                        date: '2025-01-14',
                        duration: '1h 30m'
                    };
                    localStorage.setItem('selectedFlight', JSON.stringify(flightData));
                    window.open('FlightTicket.html', '_blank');
                }
                break;
            case 'Mark Collected':
                showToast('Baggage marked as collected', 'success');
                dismissNotification(notificationId);
                break;
            case 'Reschedule':
                showToast('Opening rebooking options...', 'info');
                break;
            default:
                showToast(`Action: ${action}`, 'info');
        }
        
        // Mark notification as read
        markAsRead(notificationId);
    };

    function simulateNewNotification() {
        // Simulate receiving a new notification
        const newNotifications = [
            {
                id: Date.now(),
                source: 'Flights',
                type: 'flights',
                icon: 'fas fa-plane',
                title: 'Flight Status Update',
                message: 'Your flight is now boarding at Gate B15. Please proceed to the gate.',
                time: new Date().toISOString(),
                isRead: false,
                priority: 'high',
                actions: ['View Gate', 'Get Directions']
            },
            {
                id: Date.now() + 1,
                source: 'Luggage',
                type: 'luggage',
                icon: 'fas fa-suitcase',
                title: 'Baggage Update',
                message: 'Your baggage has been loaded onto the aircraft and will arrive at your destination.',
                time: new Date().toISOString(),
                isRead: false,
                priority: 'normal',
                actions: ['Track Progress']
            }
        ];

        // Randomly add a new notification (30% chance)
        if (Math.random() < 0.3) {
            const randomNotification = newNotifications[Math.floor(Math.random() * newNotifications.length)];
            notificationsData.unshift(randomNotification);
            
            // Add animation class
            setTimeout(() => {
                const newElement = document.querySelector(`[data-id="${randomNotification.id}"]`);
                if (newElement) {
                    newElement.classList.add('new');
                }
            }, 100);
            
            displayNotifications();
            showToast('New notification received', 'info');
        }
    }

    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            font-weight: 600;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function setupLogout() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                firebase.auth().signOut().then(() => {
                    window.location.href = 'SignIn.html';
                }).catch(error => {
                    console.error('Logout error:', error);
                });
            });
        }
    }
});