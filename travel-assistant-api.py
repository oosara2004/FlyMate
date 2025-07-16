from flask import Flask, request, jsonify
from flask_cors import CORS  
import re
import time
import logging

app = Flask(__name__)
CORS(app)

# Set up basic configuration for logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

@app.route('/')
def home():
    return "FlyMate ChatBot API - Ready to help with your travel questions!"

@app.route('/chatbot', methods=['POST', 'OPTIONS'])
def chatbot():
    if request.method == 'OPTIONS':
        return '', 200

    try:
        user_input = request.json.get('message', '').lower().strip()
        
        if not user_input:
            return jsonify({'response': "I didn't receive your message. Could you please try again?"})

        # Enhanced keyword matching with better responses
        response = generate_response(user_input)
        
        # Simulate processing time for better UX
        time.sleep(0.5)
        
        return jsonify({'response': response})
        
    except Exception as e:
        logging.error(f"Error processing request: {e}")
        return jsonify({'response': "I'm experiencing some technical difficulties. Please try again in a moment."})

def generate_response(user_input):
    """Generate contextual responses based on user input"""
    
    # Flight-related keywords
    flight_keywords = [
        'flight', 'flights', 'boarding', 'gate', 'departure', 'arrival', 'delay', 'cancelled',
        'check-in', 'boarding pass', 'seat', 'airline', 'terminal', 'runway', 'pilot',
        'takeoff', 'landing', 'schedule', 'booking', 'reservation', 'ticket'
    ]
    
    # Luggage-related keywords
    luggage_keywords = [
        'luggage', 'baggage', 'bag', 'suitcase', 'carry-on', 'checked bag', 'lost luggage',
        'baggage claim', 'carousel', 'pickup', 'tracking', 'delayed bag', 'missing bag'
    ]
    
    # Account-related keywords
    account_keywords = [
        'sign up', 'signup', 'register', 'create account', 'sign in', 'signin', 
        'log in', 'login', 'access account', 'password', 'forgot password',
        'reset password', 'profile', 'settings', 'account'
    ]
    
    # App features keywords
    features_keywords = [
        'features', 'notifications', 'alerts', 'updates', 'tracking', 'history',
        'reports', 'how to use', 'tutorial', 'help', 'guide'
    ]
    
    # Travel-related keywords
    travel_keywords = [
        'travel', 'trip', 'journey', 'vacation', 'business trip', 'airport',
        'security', 'customs', 'immigration', 'visa', 'passport'
    ]
    
    # Greeting keywords
    greeting_keywords = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening']
    
    # Check for greetings first
    if any(keyword in user_input for keyword in greeting_keywords):
        return ("Hello! Welcome to FlyMate! I'm here to help you with:\n\n"
                "Flight information and boarding passes\n"
                "Baggage tracking and pickup status\n"
                "Notifications and travel alerts\n"
                "Account and profile management\n"
                "General travel assistance\n\n"
                "What would you like to know about your travel experience?")
    
    # Flight assistance
    if any(keyword in user_input for keyword in flight_keywords):
        if any(word in user_input for word in ['delay', 'delayed', 'late']):
            return ("Flight delays can be frustrating! Here's how FlyMate helps:\n\n"
                    "Real-time Updates: Get instant notifications about delays\n"
                    "Automatic Rebooking: We'll help you find alternative flights\n"
                    "Gate Changes: Immediate alerts if your gate changes\n"
                    "Digital Boarding Pass: Always accessible on your phone\n\n"
                    "Current Flight Status:\n"
                    "• Check your 'Flights' page for real-time updates\n"
                    "• Enable notifications for instant alerts\n"
                    "• Contact airline directly for rebooking options\n\n"
                    "Need help with a specific flight delay?")
        
        elif any(word in user_input for word in ['boarding', 'gate', 'check-in']):
            return ("Boarding and Check-in made easy with FlyMate:\n\n"
                    "Mobile Check-in:\n"
                    "• Check in 24 hours before departure\n"
                    "• Get your digital boarding pass instantly\n"
                    "• Skip the airport check-in lines\n\n"
                    "Boarding Process:\n"
                    "• Arrive at gate 30 minutes before boarding\n"
                    "• Listen for boarding announcements\n"
                    "• Have your boarding pass and ID ready\n"
                    "• Board according to your group number\n\n"
                    "Gate Information:\n"
                    "• Check your boarding pass for gate number\n"
                    "• Gates can change - watch for notifications\n"
                    "• Allow time to walk to your gate\n\n"
                    "Need help finding your gate or boarding pass?")
        
        elif any(word in user_input for word in ['cancelled', 'canceled']):
            return ("Flight cancellations are stressful, but we're here to help:\n\n"
                    "Immediate Steps:\n"
                    "• Check FlyMate notifications for rebooking options\n"
                    "• Contact your airline's customer service\n"
                    "• Know your passenger rights for compensation\n\n"
                    "FlyMate Features:\n"
                    "• Instant cancellation notifications\n"
                    "• Alternative flight suggestions\n"
                    "• Rebooking assistance through the app\n\n"
                    "Your Rights:\n"
                    "• Full refund or alternative flight\n"
                    "• Meal vouchers for long delays\n"
                    "• Hotel accommodation if overnight\n\n"
                    "Would you like help rebooking or finding alternatives?")
        
        else:
            return ("I'd love to help with your flight questions! Here's what I can assist with:\n\n"
                    "Flight Management:\n"
                    "• View all your flights in one place\n"
                    "• Digital boarding passes with QR codes\n"
                    "• Real-time flight status updates\n"
                    "• Gate and seat information\n\n"
                    "Smart Features:\n"
                    "• Mobile check-in reminders\n"
                    "• Boarding notifications\n"
                    "• Flight delay alerts\n"
                    "• Gate change notifications\n\n"
                    "Quick Actions:\n"
                    "• Say 'show my flights' to view your bookings\n"
                    "• Ask about 'flight delays' for delay help\n"
                    "• Need 'boarding pass' assistance\n\n"
                    "What specific flight information do you need?")
    
    # Luggage assistance
    elif any(keyword in user_input for keyword in luggage_keywords):
        if any(word in user_input for word in ['lost', 'missing', 'can\'t find']):
            return ("Lost luggage? Don't worry, I'll help you track it down:\n\n"
                    "Immediate Steps:\n"
                    "1. Report to airline's baggage service counter\n"
                    "2. Get a baggage claim reference number\n"
                    "3. Keep your baggage claim ticket\n"
                    "4. Take photos of your luggage if you have them\n\n"
                    "FlyMate Tracking:\n"
                    "• Check 'Luggage' page for real-time location\n"
                    "• Get notifications when bag is found\n"
                    "• Track delivery status to your location\n\n"
                    "What Airlines Provide:\n"
                    "• Compensation for essential items\n"
                    "• Daily allowance for necessities\n"
                    "• Free delivery when bag is found\n\n"
                    "Need help filing a lost luggage report?")
        
        elif any(word in user_input for word in ['track', 'tracking', 'where', 'location']):
            return ("Track your luggage easily with FlyMate:\n\n"
                    "Real-time Tracking:\n"
                    "• Live location updates from check-in to pickup\n"
                    "• Baggage carousel notifications\n"
                    "• Pickup ready alerts\n\n"
                    "Tracking Information:\n"
                    "• Current location (sorting, loading, carousel)\n"
                    "• Expected pickup time\n"
                    "• Carousel number and terminal\n"
                    "• Last update timestamp\n\n"
                    "How to Track:\n"
                    "1. Go to 'Luggage' page in FlyMate\n"
                    "2. View your baggage numbers\n"
                    "3. Check status and location\n"
                    "4. Get pickup notifications\n\n"
                    "Your bags are tracked from the moment you check them in!")
        
        else:
            return ("Luggage management made simple with FlyMate:\n\n"
                    "Smart Tracking Features:\n"
                    "• Real-time baggage location updates\n"
                    "• Pickup notifications when bags arrive\n"
                    "• Carousel and terminal information\n"
                    "• Delivery status tracking\n\n"
                    "Baggage Tips:\n"
                    "• Always keep your baggage claim ticket\n"
                    "• Take photos of your luggage before travel\n"
                    "• Pack essentials in carry-on\n"
                    "• Check airline baggage policies\n\n"
                    "FlyMate Luggage Page:\n"
                    "• View all your checked bags\n"
                    "• Track pickup status\n"
                    "• Get arrival notifications\n\n"
                    "What specific luggage help do you need?")
    
    # Account help
    elif any(keyword in user_input for keyword in account_keywords):
        if any(word in user_input for word in ['password', 'forgot', 'reset']):
            return ("Password reset help for FlyMate:\n\n"
                    "Reset Your Password:\n"
                    "1. Go to the Sign In page\n"
                    "2. Click 'Forgot Password?'\n"
                    "3. Enter your email address\n"
                    "4. Check your email for reset instructions\n"
                    "5. Follow the link to create a new password\n\n"
                    "Password Security Tips:\n"
                    "• Use at least 8 characters\n"
                    "• Include numbers and special characters\n"
                    "• Avoid common words or personal info\n"
                    "• Don't reuse passwords from other accounts\n\n"
                    "Account Security:\n"
                    "• Enable two-factor authentication\n"
                    "• Log out from shared devices\n"
                    "• Update password regularly\n\n"
                    "Still having trouble accessing your account?")
        
        elif any(word in user_input for word in ['sign up', 'signup', 'register', 'create']):
            return ("Welcome to FlyMate! Creating your account:\n\n"
                    "Account Benefits:\n"
                    "• Track all your flights in one place\n"
                    "• Real-time baggage tracking\n"
                    "• Instant travel notifications\n"
                    "• Digital boarding passes\n"
                    "• Travel history and preferences\n\n"
                    "Sign Up Process:\n"
                    "1. Click 'Sign Up' on the main page\n"
                    "2. Enter your personal information\n"
                    "3. Create a secure password\n"
                    "4. Verify your email address\n"
                    "5. Set up your travel preferences\n\n"
                    "What You'll Need:\n"
                    "• Valid email address\n"
                    "• Phone number for notifications\n"
                    "• Basic personal information\n\n"
                    "Ready to start your smart travel journey?")
        
        else:
            return ("Account management help for FlyMate:\n\n"
                    "Account Features:\n"
                    "• Manage your travel profile\n"
                    "• Update contact information\n"
                    "• Set notification preferences\n"
                    "• View travel history\n"
                    "• Manage family member accounts\n\n"
                    "Profile Settings:\n"
                    "• Personal information updates\n"
                    "• Travel preferences\n"
                    "• Notification settings\n"
                    "• Privacy controls\n\n"
                    "Security Options:\n"
                    "• Password management\n"
                    "• Two-factor authentication\n"
                    "• Login activity monitoring\n\n"
                    "What specific account help do you need?")
    
    # App features
    elif any(keyword in user_input for keyword in features_keywords):
        return ("FlyMate Features Overview:\n\n"
                "Flight Management:\n"
                "• Digital boarding passes with QR codes\n"
                "• Real-time flight status updates\n"
                "• Gate and seat information\n"
                "• Check-in reminders\n\n"
                "Baggage Tracking:\n"
                "• Live luggage location updates\n"
                "• Pickup notifications\n"
                "• Carousel information\n"
                "• Lost baggage assistance\n\n"
                "Smart Notifications:\n"
                "• Flight delays and gate changes\n"
                "• Baggage arrival alerts\n"
                "• Check-in reminders\n"
                "• Travel updates\n\n"
                "Account Management:\n"
                "• Travel profile and preferences\n"
                "• Family member management\n"
                "• Travel history\n"
                "• Security settings\n\n"
                "Which feature would you like to learn more about?")
    
    # Travel assistance
    elif any(keyword in user_input for keyword in travel_keywords):
        return ("Travel assistance with FlyMate:\n\n"
                "Pre-Travel Checklist:\n"
                "• Check passport expiration (6+ months validity)\n"
                "• Verify visa requirements for destination\n"
                "• Review airline baggage policies\n"
                "• Download FlyMate app for travel management\n\n"
                "Airport Navigation:\n"
                "• Arrive 2-3 hours early for international flights\n"
                "• Check-in online to save time\n"
                "• Know your terminal and gate information\n"
                "• Keep important documents accessible\n\n"
                "FlyMate Travel Tools:\n"
                "• Digital boarding passes\n"
                "• Real-time flight updates\n"
                "• Baggage tracking\n"
                "• Travel notifications\n\n"
                "Travel Tips:\n"
                "• Pack essentials in carry-on\n"
                "• Stay hydrated during flights\n"
                "• Keep copies of important documents\n\n"
                "What specific travel help do you need?")
    
    # Help with specific issues
    elif any(word in user_input for word in ['help', 'support', 'problem', 'issue', 'trouble']):
        return ("I'm here to help! Here are the most common topics I assist with:\n\n"
                "Flight Support\n"
                "• Flight status and delays\n"
                "• Boarding passes and check-in\n"
                "• Gate changes and cancellations\n\n"
                "Baggage Support\n"
                "• Real-time luggage tracking\n"
                "• Lost or delayed baggage\n"
                "• Pickup notifications\n\n"
                "App Support\n"
                "• Account management\n"
                "• Notification settings\n"
                "• Technical issues\n\n"
                "Travel Support\n"
                "• Airport navigation\n"
                "• Travel documentation\n"
                "• General travel tips\n\n"
                "Additional Support\n"
                "• Contact our support team for complex issues\n"
                "• Visit our help center for detailed guides\n\n"
                "What specific area do you need help with?")
    
    # Thank you responses
    elif any(word in user_input for word in ['thank', 'thanks', 'appreciate']):
        return ("You're very welcome! I'm always happy to help make your travel experience smoother.\n\n"
                "Remember, I'm here 24/7 to assist with:\n"
                "• Flight information and updates\n"
                "• Baggage tracking and support\n"
                "• Account and app assistance\n"
                "• General travel guidance\n\n"
                "Have a wonderful trip, and feel free to ask me anything else!")
    
    # Default response for unrecognized input
    else:
        return ("I want to make sure I give you the most helpful response! Could you tell me more about what you're looking for?\n\n"
                "I'm great at helping with:\n"
                "• Flight management - status updates, boarding passes, delays\n"
                "• Baggage tracking - location updates, pickup notifications\n"
                "• Travel notifications - alerts, gate changes, reminders\n"
                "• Account support - login issues, profile management\n"
                "• General travel - airport tips, documentation, planning\n\n"
                "Try asking something like:\n"
                "• 'Where is my luggage?'\n"
                "• 'Is my flight delayed?'\n"
                "• 'How do I check in?'\n"
                "• 'Show me app features'\n"
                "• 'Help with lost baggage'\n\n"
                "What can I help you with today?")

if __name__ == '__main__':
    logging.info("FlyMate ChatBot starting up...")
    logging.info("Server will be available at http://127.0.0.1:5000")
    app.run(debug=True, host='127.0.0.1', port=5000)
