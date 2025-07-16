// Luggage Tracking JavaScript for EasyFly
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase auth check
    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            window.location.href = 'SignIn.html';
            return;
        }
        initializeLuggageTracking();
    });

    // Sample luggage data
    const luggageData = [
        {
            baggageNumber: 'EF001234567',
            flight: 'SV 1234',
            currentLocation: 'Carousel 3',
            status: 'arrived',
            pickupArea: 'Terminal 1 - Carousel 3',
            lastUpdated: '2025-01-15 16:45'
        },
        {
            baggageNumber: 'EF001234568',
            flight: 'SV 1234',
            currentLocation: 'Baggage Sorting',
            status: 'transit',
            pickupArea: 'Terminal 1 - Carousel 3',
            lastUpdated: '2025-01-15 16:30'
        },
        {
            baggageNumber: 'EF001234569',
            flight: 'XY 5678',
            currentLocation: 'Carousel 5',
            status: 'arrived',
            pickupArea: 'Terminal 2 - Carousel 5',
            lastUpdated: '2025-01-16 12:15'
        },
        {
            baggageNumber: 'EF001234570',
            flight: 'SV 9876',
            currentLocation: 'Loading Area',
            status: 'delayed',
            pickupArea: 'Terminal 1 - Carousel 2',
            lastUpdated: '2025-01-17 14:20'
        }
    ];

    function initializeLuggageTracking() {
        displayLuggageTable();
        updateSummaryCards();
        setupLogout();
        
        // Auto-refresh every 30 seconds
        setInterval(() => {
            updateLuggageStatus();
        }, 30000);
    }

    function displayLuggageTable() {
        const tbody = document.getElementById('luggage-tbody');
        tbody.innerHTML = '';

        luggageData.forEach(luggage => {
            const row = createLuggageRow(luggage);
            tbody.appendChild(row);
        });
    }

    function createLuggageRow(luggage) {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>
                <span class="baggage-number">${luggage.baggageNumber}</span>
            </td>
            <td>${luggage.flight}</td>
            <td>${luggage.currentLocation}</td>
            <td>
                <span class="status-badge status-${luggage.status}">
                    ${getStatusText(luggage.status)}
                </span>
            </td>
            <td>${luggage.pickupArea}</td>
            <td>${formatDateTime(luggage.lastUpdated)}</td>
        `;

        // Add click event for row details
        row.addEventListener('click', () => showLuggageDetails(luggage));
        row.style.cursor = 'pointer';

        return row;
    }

    function getStatusText(status) {
        const statusMap = {
            'arrived': 'Ready for Pickup',
            'transit': 'In Transit',
            'delayed': 'Delayed',
            'collected': 'Collected'
        };
        return statusMap[status] || status;
    }

    function formatDateTime(dateTimeString) {
        const date = new Date(dateTimeString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function updateSummaryCards() {
        const arrivedCount = luggageData.filter(bag => bag.status === 'arrived').length;
        const totalCount = luggageData.length;
        const transitCount = luggageData.filter(bag => bag.status === 'transit' || bag.status === 'delayed').length;

        document.getElementById('arrived-count').textContent = `${arrivedCount} of ${totalCount} bags ready for pickup`;
        document.getElementById('transit-count').textContent = `${transitCount} bag${transitCount !== 1 ? 's' : ''} still in transit`;
    }

    function showLuggageDetails(luggage) {
        const modal = createLuggageModal(luggage);
        document.body.appendChild(modal);
        
        // Show modal with animation
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('.modal-content').style.transform = 'scale(1)';
        }, 10);
    }

    function createLuggageModal(luggage) {
        const modal = document.createElement('div');
        modal.className = 'luggage-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        modal.innerHTML = `
            <div class="modal-content" style="
                background: white;
                border-radius: 15px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                transform: scale(0.9);
                transition: transform 0.3s ease;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h3 style="color: #0c1752; margin: 0;">Baggage Details</h3>
                    <button class="close-modal" style="
                        background: none;
                        border: none;
                        font-size: 1.5rem;
                        cursor: pointer;
                        color: #666;
                        padding: 0.5rem;
                    ">&times;</button>
                </div>
                
                <div style="display: grid; gap: 1rem;">
                    <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: #f8f9fa; border-radius: 8px;">
                        <strong>Baggage Number:</strong>
                        <span class="baggage-number">${luggage.baggageNumber}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: #f8f9fa; border-radius: 8px;">
                        <strong>Flight:</strong>
                        <span>${luggage.flight}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: #f8f9fa; border-radius: 8px;">
                        <strong>Current Location:</strong>
                        <span>${luggage.currentLocation}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: #f8f9fa; border-radius: 8px;">
                        <strong>Status:</strong>
                        <span class="status-badge status-${luggage.status}">${getStatusText(luggage.status)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: #f8f9fa; border-radius: 8px;">
                        <strong>Pickup Area:</strong>
                        <span>${luggage.pickupArea}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: #f8f9fa; border-radius: 8px;">
                        <strong>Last Updated:</strong>
                        <span>${formatDateTime(luggage.lastUpdated)}</span>
                    </div>
                </div>
                
                ${luggage.status === 'arrived' ? `
                    <div style="margin-top: 1.5rem; padding: 1rem; background: #e8f5e8; border-radius: 8px; text-align: center;">
                        <i class="fas fa-check-circle" style="color: #4CAF50; font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                        <p style="color: #4CAF50; font-weight: 600; margin: 0;">Your bag is ready for pickup!</p>
                    </div>
                ` : ''}
            </div>
        `;

        // Close modal functionality
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('close-modal')) {
                modal.style.opacity = '0';
                setTimeout(() => modal.remove(), 300);
            }
        });

        return modal;
    }

    function updateLuggageStatus() {
        // Simulate real-time updates
        const randomIndex = Math.floor(Math.random() * luggageData.length);
        const randomBag = luggageData[randomIndex];
        
        if (randomBag.status === 'transit') {
            // Simulate bag arriving
            if (Math.random() > 0.7) {
                randomBag.status = 'arrived';
                randomBag.currentLocation = randomBag.pickupArea.split(' - ')[1];
                randomBag.lastUpdated = new Date().toISOString().slice(0, 16).replace('T', ' ');
                
                // Show notification
                showNotification(`Bag ${randomBag.baggageNumber} has arrived and is ready for pickup!`, 'success');
            }
        }
        
        // Refresh display
        displayLuggageTable();
        updateSummaryCards();
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
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