// main.js

// Import CSS at the top - Vite will process this
import './style.css';

// 🚨 Use import.meta.env for Vite environment variables
const SCRIPT_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
const ANALYTICS_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;

// THEN log them
console.log('=== ENVIRONMENT CHECK ===');
console.log('SCRIPT_URL:', SCRIPT_URL);
console.log('ANALYTICS_ID:', ANALYTICS_ID);
console.log('========================');

/* * -------------------
 * Google Analytics Initialization
 * -------------------
 */
function loadGoogleAnalytics(id) {
    // Corrected check: Only return if ID is missing (falsy)
    if (!id) return;

    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${id}');
    `;
    document.head.appendChild(script2);
}


/* * -------------------
 * Form Validation Logic
 * -------------------
 */
function validateForm(data) {
    const phone = data.phone ? data.phone.replace(/[\s\-\(\)]/g, '') : '';
    const contactPreference = data.contact;

    if (!data.firstName || !data.lastName || !data.email || !data.youtube || !contactPreference) {
        console.error('Validation Error: Please fill in all required fields marked with an asterisk (*).');
        alert('❌ ERROR: Please fill in all required fields marked with an asterisk (*).');
        return false;
    }

    if ((contactPreference === 'sms' || contactPreference === 'both') && phone.length === 0) {
        console.error('Validation Error: Selected SMS/Both contact preference but phone number is empty.');
        alert('❌ ERROR: You selected SMS/Both for contact, but the Phone Number field is empty. Please enter your phone number.');
        return false;
    }

    if (phone.length > 0) {
        if (!/^\d{10}$/.test(phone)) {
            console.error('Validation Error: Phone number must contain exactly 10 digits.');
            alert('❌ ERROR: Phone number must contain exactly 10 digits (e.g., (555) 555-1234).');
            return false;
        }
    }

    if (!data.terms) {
        console.error('Validation Error: Terms & Conditions not agreed to.');
        alert('❌ ERROR: Please agree to the Terms & Conditions to continue.');
        return false;
    }

    for (const key in data) {
        if (typeof data[key] === 'string') {
            data[key] = data[key].replace(/</g, "&lt;").replace(/>/g, "&gt;");
        }
    }

    return true;
}


/* * -------------------
 * Form Submission Logic
 * -------------------
 */
async function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const submitButton = form.querySelector('.submit-btn');

    if (!SCRIPT_URL) {
        console.error("API Key Missing: SCRIPT_URL is undefined. Check your .env file and build process.");
        alert("⚠ Configuration Error: The application URL is missing. Check your build setup.");
        return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // FIX: Explicitly handle checkboxes
    data.terms = form.querySelector('input[name="terms"]').checked ? 'on' : '';
    data.marketing = form.querySelector('input[name="marketing"]').checked ? 'on' : '';

    // Debug: Log what we're sending
    console.log('Form data being sent:', data);

    if (!validateForm(data)) {
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    try {
        const urlEncodedData = new URLSearchParams();
        for (const key in data) {
            if (data[key] !== undefined && data[key] !== null) {
                urlEncodedData.append(key, data[key]);
            }
        }

        console.log('Sending data:', urlEncodedData.toString());

        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: urlEncodedData.toString()
        });

        console.log('Form submission assumed successful.');
        document.getElementById('communityForm').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';

    } catch (error) {
        console.error('Submission Error:', error);
        alert('An error occurred during submission. Please try again.');
        submitButton.disabled = false;
        submitButton.textContent = 'Join the Community';
    }
}


/* * -------------------
 * DOM Initialization and Popups
 * -------------------
 */
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('communityForm');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }

    // Stat Counter Animation (Unchanged Logic)
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const finalValue = stat.textContent;
        const numericValue = parseInt(finalValue.replace(/\D/g, ''));
        let currentValue = 0;
        const increment = numericValue / 50;

        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= numericValue) {
                stat.textContent = finalValue;
                clearInterval(timer);
            } else {
                const suffix = finalValue.includes('K') ? 'K+' : '';
                stat.textContent = Math.round(currentValue / 1000) + suffix;
            }
        }, 30);
    });

    // Popup Logic (Unchanged Logic)
    const competitionPopup = document.getElementById('competition-popup');
    const membershipPopup = document.getElementById('membership-popup');

    let hasShownCompetition = false;
    let hasShownMembership = false;

    const scrollThreshold = 300;
    const displayDuration = 5000;
    const offsetDelay = 1000;

    function showAndHidePopup(popupElement) {
        popupElement.classList.add('show');

        setTimeout(() => {
            popupElement.classList.remove('show');
        }, displayDuration);
    }

    function handleScroll() {
        if (window.scrollY > scrollThreshold) {

            if (!hasShownCompetition) {
                hasShownCompetition = true;
                showAndHidePopup(competitionPopup);
            }

            if (!hasShownMembership) {
                hasShownMembership = true;
                setTimeout(() => {
                    showAndHidePopup(membershipPopup);
                    window.removeEventListener('scroll', handleScroll);
                }, offsetDelay);
            }
        }
    }

    window.addEventListener('scroll', handleScroll);

    // Initialize GA using the injected ID
    loadGoogleAnalytics(ANALYTICS_ID);
});