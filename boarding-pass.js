// Flight Ticket JavaScript for EasyFly
document.addEventListener('DOMContentLoaded', function() {
    loadFlightData();
});

function loadFlightData() {
    // Get flight data from localStorage
    const flightData = JSON.parse(localStorage.getItem('selectedFlight'));
    
    if (!flightData) {
        // If no flight data, show error and close
        alert('No flight data found');
        window.close();
        return;
    }

    // Populate ticket with flight data
    populateTicket(flightData);
}

function populateTicket(flight) {
    // Update airline name
    document.getElementById('airline-name').textContent = flight.airline;
    
    // Update departure info
    document.getElementById('departure-code').textContent = flight.departure.code;
    document.getElementById('departure-name').textContent = flight.departure.name;
    document.getElementById('departure-time').textContent = flight.departure.time;
    
    // Update arrival info
    document.getElementById('arrival-code').textContent = flight.arrival.code;
    document.getElementById('arrival-name').textContent = flight.arrival.name;
    document.getElementById('arrival-time').textContent = flight.arrival.time;
    
    // Update flight details
    document.getElementById('flight-number').textContent = flight.flightNumber;
    document.getElementById('flight-date').textContent = formatDate(flight.date);
    document.getElementById('gate-number').textContent = flight.gate;
    document.getElementById('seat-number').textContent = flight.seat;
    
    // Calculate boarding time (30 minutes before departure)
    const boardingTime = calculateBoardingTime(flight.departure.time);
    document.getElementById('boarding-time').textContent = boardingTime;
    
    // Update stub section
    document.getElementById('stub-departure').textContent = flight.departure.code;
    document.getElementById('stub-arrival').textContent = flight.arrival.code;
    document.getElementById('stub-flight').textContent = flight.flightNumber;
    document.getElementById('stub-seat').textContent = flight.seat;
    document.getElementById('stub-gate').textContent = flight.gate;
    
    // Update status banner
    updateStatusBanner(flight.status);
    
    // Generate barcode based on flight data
    generateBarcode(flight);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).toUpperCase();
}

function calculateBoardingTime(departureTime) {
    const [hours, minutes] = departureTime.split(':').map(Number);
    const boardingMinutes = minutes - 30;
    
    if (boardingMinutes >= 0) {
        return `${hours.toString().padStart(2, '0')}:${boardingMinutes.toString().padStart(2, '0')}`;
    } else {
        const newHours = hours - 1;
        const newMinutes = 60 + boardingMinutes;
        return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
    }
}

function updateStatusBanner(status) {
    const banner = document.getElementById('status-banner');
    const statusMessages = {
        'completed': {
            icon: 'fas fa-check-circle',
            text: 'FLIGHT COMPLETED',
            class: 'completed'
        },
        'in-progress': {
            icon: 'fas fa-plane',
            text: 'BOARDING PASS CONFIRMED',
            class: 'in-progress'
        },
        'cancelled': {
            icon: 'fas fa-times-circle',
            text: 'FLIGHT CANCELLED',
            class: 'cancelled'
        },
        'missed': {
            icon: 'fas fa-exclamation-triangle',
            text: 'FLIGHT MISSED',
            class: 'missed'
        }
    };
    
    const statusInfo = statusMessages[status] || statusMessages['in-progress'];
    
    banner.className = `status-banner ${statusInfo.class}`;
    banner.innerHTML = `
        <i class="${statusInfo.icon}"></i>
        <span>${statusInfo.text}</span>
    `;
}

function generateBarcode(flight) {
    // Generate a simple barcode number based on flight data
    const barcodeNumber = `${flight.flightNumber.replace(' ', '')}${flight.date.replace(/-/g, '')}${flight.seat}`;
    document.querySelector('.barcode-number').textContent = barcodeNumber.substring(0, 13).padEnd(13, '0');
}

function downloadTicket() {
    // In a real application, this would generate a PDF
    // For now, we'll use the browser's print functionality
    window.print();
}

function shareTicket() {
    // Check if Web Share API is supported
    if (navigator.share) {
        const flightData = JSON.parse(localStorage.getItem('selectedFlight'));
        navigator.share({
            title: 'EasyFly Boarding Pass',
            text: `My flight ${flightData.flightNumber} from ${flightData.departure.code} to ${flightData.arrival.code}`,
            url: window.location.href
        }).catch(console.error);
    } else {
        // Fallback: copy URL to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Boarding pass link copied to clipboard!');
        }).catch(() => {
            alert('Unable to share. Please copy the URL manually.');
        });
    }
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effect to barcode
    const barcode = document.getElementById('barcode');
    barcode.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    barcode.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    // Add animation to status banner
    const banner = document.getElementById('status-banner');
    setTimeout(() => {
        banner.style.animation = 'slideInDown 0.5s ease-out';
    }, 500);
});

// Add CSS animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInDown {
        from {
            transform: translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);