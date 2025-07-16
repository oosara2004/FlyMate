// Flights JavaScript for EasyFly
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase auth check
    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            window.location.href = 'SignIn.html';
            return;
        }
        initializeFlights();
    });

    // Sample flight data
    const flightData = [
        {
            id: 'EF001',
            flightNumber: 'SV 1234',
            airline: 'Saudia',
            status: 'completed',
            departure: {
                code: 'RUH',
                name: 'King Khalid International',
                time: '14:30'
            },
            arrival: {
                code: 'JED',
                name: 'King Abdulaziz International',
                time: '16:45'
            },
            gate: 'A12',
            seat: '12A',
            date: '2025-01-15',
            duration: '2h 15m'
        },
        {
            id: 'EF002',
            flightNumber: 'XY 5678',
            airline: 'Flynas',
            status: 'in-progress',
            departure: {
                code: 'JED',
                name: 'King Abdulaziz International',
                time: '09:15'
            },
            arrival: {
                code: 'DXB',
                name: 'Dubai International',
                time: '12:30'
            },
            gate: 'B7',
            seat: '8C',
            date: '2025-01-16',
            duration: '3h 15m'
        },
        {
            id: 'EF003',
            flightNumber: 'SV 9876',
            airline: 'Saudia',
            status: 'cancelled',
            departure: {
                code: 'RUH',
                name: 'King Khalid International',
                time: '18:00'
            },
            arrival: {
                code: 'CAI',
                name: 'Cairo International',
                time: '20:30'
            },
            gate: 'C15',
            seat: '15F',
            date: '2025-01-17',
            duration: '2h 30m'
        },
        {
            id: 'EF004',
            flightNumber: 'XY 2468',
            airline: 'Flynas',
            status: 'missed',
            departure: {
                code: 'DMM',
                name: 'King Fahd International',
                time: '06:45'
            },
            arrival: {
                code: 'KWI',
                name: 'Kuwait International',
                time: '08:15'
            },
            gate: 'A5',
            seat: '22B',
            date: '2025-01-14',
            duration: '1h 30m'
        }
    ];

    function initializeFlights() {
        displayFlights();
        setupLogout();
    }

    function displayFlights() {
        const flightsGrid = document.getElementById('flights-grid');
        flightsGrid.innerHTML = '';

        flightData.forEach(flight => {
            const flightCard = createFlightCard(flight);
            flightsGrid.appendChild(flightCard);
        });
    }

    function createFlightCard(flight) {
        const card = document.createElement('div');
        card.className = `flight-card ${flight.status}`;
        card.onclick = () => openFlightTicket(flight);

        card.innerHTML = `
            <div class="flight-header">
                <div class="flight-number">${flight.flightNumber}</div>
                <div class="airline-name">${flight.airline}</div>
                <div class="flight-status status-${flight.status}">
                    ${getStatusText(flight.status)}
                </div>
            </div>
            <div class="flight-body">
                <div class="flight-route">
                    <div class="airport">
                        <div class="airport-code">${flight.departure.code}</div>
                        <div class="airport-name">${flight.departure.name}</div>
                        <div class="flight-time">${flight.departure.time}</div>
                    </div>
                    <div class="route-line">
                        <i class="fas fa-plane plane-icon"></i>
                    </div>
                    <div class="airport">
                        <div class="airport-code">${flight.arrival.code}</div>
                        <div class="airport-name">${flight.arrival.name}</div>
                        <div class="flight-time">${flight.arrival.time}</div>
                    </div>
                </div>
                <div class="flight-details">
                    <div class="detail-item">
                        <div class="detail-label">Date</div>
                        <div class="detail-value">${formatDate(flight.date)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Duration</div>
                        <div class="detail-value">${flight.duration}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Gate</div>
                        <div class="detail-value">${flight.gate}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Seat</div>
                        <div class="detail-value">${flight.seat}</div>
                    </div>
                </div>
            </div>
        `;

        return card;
    }

    function getStatusText(status) {
        const statusMap = {
            'completed': 'Completed',
            'in-progress': 'In Progress',
            'cancelled': 'Cancelled',
            'missed': 'Missed'
        };
        return statusMap[status] || status;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    function openFlightTicket(flight) {
        // Store flight data in localStorage for the ticket page
        localStorage.setItem('selectedFlight', JSON.stringify(flight));
        // Open ticket page
        window.open('FlightTicket.html', '_blank');
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