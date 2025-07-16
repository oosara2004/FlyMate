// Flights JavaScript for EasyFly
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase auth check
    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            window.location.href = 'user-login.html';
            return;
        }
        initializeFlights();
    });

    // Enhanced flight data with more creative statuses and history
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
            duration: '2h 15m',
            experience: 'smooth',
            rating: 5
        },
        {
            id: 'EF002',
            flightNumber: 'XY 5678',
            airline: 'Flynas',
            status: 'boarding',
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
            date: '2025-01-20',
            duration: '3h 15m',
            experience: 'boarding-now',
            boardingGroup: 'Group A'
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
            duration: '2h 30m',
            experience: 'cancelled',
            reason: 'Weather conditions'
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
            duration: '1h 30m',
            experience: 'missed',
            reason: 'Late arrival at airport'
        },
        {
            id: 'EF005',
            flightNumber: 'EK 4321',
            airline: 'Emirates',
            status: 'delayed',
            departure: {
                code: 'DXB',
                name: 'Dubai International',
                time: '22:30'
            },
            arrival: {
                code: 'LHR',
                name: 'London Heathrow',
                time: '03:45+1'
            },
            gate: 'D8',
            seat: '7A',
            date: '2025-01-22',
            duration: '7h 15m',
            experience: 'delayed',
            delayTime: '45 minutes',
            reason: 'Air traffic control'
        },
        {
            id: 'EF006',
            flightNumber: 'QR 7890',
            airline: 'Qatar Airways',
            status: 'scheduled',
            departure: {
                code: 'DOH',
                name: 'Hamad International',
                time: '15:20'
            },
            arrival: {
                code: 'CDG',
                name: 'Charles de Gaulle',
                time: '20:10'
            },
            gate: 'TBA',
            seat: '14K',
            date: '2025-01-25',
            duration: '6h 50m',
            experience: 'upcoming',
            checkInAvailable: true
        },
        {
            id: 'EF007',
            flightNumber: 'SV 5555',
            airline: 'Saudia',
            status: 'completed',
            departure: {
                code: 'JED',
                name: 'King Abdulaziz International',
                time: '11:00'
            },
            arrival: {
                code: 'IST',
                name: 'Istanbul Airport',
                time: '15:30'
            },
            gate: 'B12',
            seat: '9F',
            date: '2025-01-10',
            duration: '4h 30m',
            experience: 'excellent',
            rating: 5,
            review: 'Perfect flight with great service!'
        },
        {
            id: 'EF008',
            flightNumber: 'TK 1111',
            airline: 'Turkish Airlines',
            status: 'completed',
            departure: {
                code: 'IST',
                name: 'Istanbul Airport',
                time: '08:15'
            },
            arrival: {
                code: 'JFK',
                name: 'John F. Kennedy International',
                time: '12:45'
            },
            gate: 'A23',
            seat: '12D',
            date: '2025-01-05',
            duration: '10h 30m',
            experience: 'good',
            rating: 4,
            review: 'Long flight but comfortable seats'
        }
    ];

    function initializeFlights() {
        displayFlights();
        setupLogout();
        addFlightStats();
    }

    function displayFlights() {
        const flightsGrid = document.getElementById('flights-grid');
        flightsGrid.innerHTML = '';

        // Sort flights by date (newest first)
        const sortedFlights = [...flightData].sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedFlights.forEach(flight => {
            const flightCard = createFlightCard(flight);
            flightsGrid.appendChild(flightCard);
        });
    }

    function createFlightCard(flight) {
        const card = document.createElement('div');
        card.className = `flight-card ${flight.status}`;
        card.onclick = () => openFlightTicket(flight);

        const statusInfo = getStatusInfo(flight);
        const experienceIcon = getExperienceIcon(flight.experience);

        card.innerHTML = `
            <div class="flight-header">
                <div class="flight-number">${flight.flightNumber}</div>
                <div class="airline-name">${flight.airline}</div>
                <div class="flight-status status-${flight.status}">
                    ${statusInfo.icon} ${statusInfo.text}
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
                ${createExperienceSection(flight)}
            </div>
        `;

        return card;
    }

    function getStatusInfo(flight) {
        const statusMap = {
            'completed': { text: 'Completed', icon: '✅' },
            'boarding': { text: 'Boarding Now', icon: '🚪' },
            'delayed': { text: 'Delayed', icon: '⏰' },
            'cancelled': { text: 'Cancelled', icon: '❌' },
            'missed': { text: 'Missed', icon: '😞' },
            'scheduled': { text: 'Scheduled', icon: '📅' }
        };
        return statusMap[flight.status] || { text: flight.status, icon: '✈️' };
    }

    function getExperienceIcon(experience) {
        const experienceMap = {
            'excellent': '⭐⭐⭐⭐⭐',
            'smooth': '⭐⭐⭐⭐⭐',
            'good': '⭐⭐⭐⭐',
            'average': '⭐⭐⭐',
            'poor': '⭐⭐',
            'cancelled': '❌',
            'missed': '😞',
            'delayed': '⏰',
            'boarding-now': '🚪',
            'upcoming': '🔜'
        };
        return experienceMap[experience] || '✈️';
    }

    function createExperienceSection(flight) {
        let experienceHTML = '<div class="flight-experience">';
        
        switch(flight.status) {
            case 'completed':
                experienceHTML += `
                    <div class="experience-rating">
                        <span class="experience-label">Experience:</span>
                        <span class="experience-value">${getExperienceIcon(flight.experience)}</span>
                    </div>
                `;
                if (flight.review) {
                    experienceHTML += `<div class="flight-review">"${flight.review}"</div>`;
                }
                break;
                
            case 'boarding':
                experienceHTML += `
                    <div class="boarding-info">
                        <span class="boarding-group">🎫 ${flight.boardingGroup || 'Check boarding pass'}</span>
                        <span class="boarding-status">🚪 Boarding in progress</span>
                    </div>
                `;
                break;
                
            case 'delayed':
                experienceHTML += `
                    <div class="delay-info">
                        <span class="delay-time">⏰ Delayed by ${flight.delayTime}</span>
                        <span class="delay-reason">Reason: ${flight.reason}</span>
                    </div>
                `;
                break;
                
            case 'cancelled':
                experienceHTML += `
                    <div class="cancel-info">
                        <span class="cancel-reason">❌ ${flight.reason}</span>
                        <span class="cancel-action">💼 Rebooking available</span>
                    </div>
                `;
                break;
                
            case 'missed':
                experienceHTML += `
                    <div class="missed-info">
                        <span class="missed-reason">😞 ${flight.reason}</span>
                        <span class="missed-action">🔄 Contact support for rebooking</span>
                    </div>
                `;
                break;
                
            case 'scheduled':
                experienceHTML += `
                    <div class="scheduled-info">
                        <span class="check-in-status">
                            ${flight.checkInAvailable ? '✅ Check-in available' : '⏳ Check-in opens 24h before'}
                        </span>
                        <span class="upcoming-flight">🔜 Upcoming flight</span>
                    </div>
                `;
                break;
        }
        
        experienceHTML += '</div>';
        return experienceHTML;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const diffTime = date - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let dateText = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        
        if (diffDays === 0) {
            dateText += ' (Today)';
        } else if (diffDays === 1) {
            dateText += ' (Tomorrow)';
        } else if (diffDays === -1) {
            dateText += ' (Yesterday)';
        } else if (diffDays > 1) {
            dateText += ` (in ${diffDays} days)`;
        } else if (diffDays < -1) {
            dateText += ` (${Math.abs(diffDays)} days ago)`;
        }
        
        return dateText;
    }

    function addFlightStats() {
        const header = document.querySelector('.flights-header');
        const statsDiv = document.createElement('div');
        statsDiv.className = 'flight-stats';
        
        const totalFlights = flightData.length;
        const completedFlights = flightData.filter(f => f.status === 'completed').length;
        const upcomingFlights = flightData.filter(f => f.status === 'scheduled' || f.status === 'boarding').length;
        const cancelledFlights = flightData.filter(f => f.status === 'cancelled' || f.status === 'missed').length;
        
        statsDiv.innerHTML = `
            <div class="stats-container">
                <div class="stat-item">
                    <div class="stat-number">${totalFlights}</div>
                    <div class="stat-label">Total Flights</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${completedFlights}</div>
                    <div class="stat-label">Completed</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${upcomingFlights}</div>
                    <div class="stat-label">Upcoming</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${cancelledFlights}</div>
                    <div class="stat-label">Issues</div>
                </div>
            </div>
        `;
        
        header.appendChild(statsDiv);
    }

    function openFlightTicket(flight) {
        // Store flight data in localStorage for the ticket page
        localStorage.setItem('selectedFlight', JSON.stringify(flight));
        // Open ticket page
        window.open('boarding-pass.html', '_blank');
    }

    function setupLogout() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                firebase.auth().signOut().then(() => {
                    window.location.href = 'user-login.html';
                }).catch(error => {
                    console.error('Logout error:', error);
                });
            });
        }
    }
});