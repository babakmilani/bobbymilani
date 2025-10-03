# bobbymilani
website for bobbymilani

# Creator Community Hub

A full-stack web application for managing YouTube creator community signups with automated data collection, Google Sheets integration, and email notifications.

## 🎯 Project Overview

This project enables content creators to collect and manage community member signups through a modern web interface. When users submit the form, their data is automatically logged to a Google Spreadsheet and triggers an email notification to the administrator.

**Live Demo:** [bobbymilani.com](https://bobbymilani.com)

## 🛠️ Tech Stack

### Frontend
- **Vite** - Modern build tool and dev server
- **Vanilla JavaScript** - ES6+ with module system
- **CSS3** - Custom styling with responsive design
- **Google Analytics** - User behavior tracking

### Backend
- **Google Apps Script** - Serverless backend for form processing
- **Google Sheets API** - Data storage and management
- **Gmail API** - Automated email notifications

### Deployment
- **GitHub Pages** - Static site hosting with custom domain
- **Environment Variables** - Secure configuration management

## 📋 Features

### Form Management
- Client-side validation with real-time feedback
- Phone number formatting and validation
- Email validation
- Conditional required fields based on contact preferences
- GDPR-compliant consent checkboxes

### Data Processing
- JSON payload submission to Google Apps Script
- Automatic data sanitization
- Spreadsheet integration with timestamped entries
- Email notifications with formatted submission details

### User Experience
- Animated statistics counter
- Scroll-triggered informational popups
- Success confirmation message
- Mobile-responsive design

## 🔧 Technical Implementation

### Frontend Architecture

**Form Submission Flow:**
```javascript
1. User fills out form
2. Client-side validation (validateForm())
3. Data serialization to JSON
4. Fetch POST request to Apps Script endpoint
5. Success/error handling and UI updates
```

**Key Challenge Solved: CORS Limitation**

Google Apps Script web apps don't support standard CORS for browser requests. Solution implemented:
```javascript
fetch(SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',  // Required for Apps Script
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
});
```

With `no-cors` mode, the response isn't readable, so the application assumes success and relies on backend logging for error detection.

### Backend Architecture

**Google Apps Script Setup:**

The `doPost()` function handles incoming form submissions:

```javascript
function doPost(e) {
  // Parse JSON data from request body
  var formData = JSON.parse(e.postData.contents);
  
  // Validate required fields
  // Write to Google Sheets
  // Send email notification
  // Return JSON response
}
```

**Key Challenge Solved: Content-Type Handling**

Apps Script receives JSON with `content-type: text/plain` instead of `application/json`. Solution:
```javascript
// Parse JSON regardless of content-type
if (e && e.postData && e.postData.contents) {
    formData = JSON.parse(e.postData.contents);
}
```

### OAuth and Permissions

**Scopes Required:**
```json
"oauthScopes": [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/script.external_request",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/script.send_mail"
]
```

**Deployment Configuration:**
```json
"webapp": {
  "executeAs": "USER_DEPLOYING",
  "access": "ANYONE"
}
```

This allows the script to run with the owner's permissions while being accessible to anonymous users.

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16+)
- Google Account
- GitHub Account (for deployment)

### Local Development

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/creator-community-hub.git
cd creator-community-hub
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**

Create a `.env` file in the root directory:
```env
VITE_GOOGLE_APP_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

4. **Start development server:**
```bash
npm run dev
```

### Google Apps Script Setup

1. **Create a new Google Apps Script project:**
   - Go to [script.google.com](https://script.google.com)
   - Create new project named "Youtube Channel Signup"

2. **Create necessary files:**
   - `Code.gs` - Main backend logic
   - `appsscript.json` - Configuration manifest

3. **Configure OAuth scopes in `appsscript.json`:**
```json
{
  "timeZone": "America/New_York",
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/script.send_mail"
  ],
  "webapp": {
    "executeAs": "USER_DEPLOYING",
    "access": "ANYONE"
  }
}
```

4. **Deploy as web app:**
   - Click "Deploy" → "New deployment"
   - Select type: "Web app"
   - Execute as: "Me"
   - Who has access: "Anyone"
   - Copy the deployment URL

5. **Update `.env` with deployment URL**

### Google Sheets Setup

1. Create a new Google Spreadsheet
2. Copy the spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
   ```
3. Update `SPREADSHEET_ID` in `Code.gs`

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This generates optimized files in the `docs/` directory.

### Deploy to GitHub Pages

1. **Configure GitHub Pages:**
   - Repository Settings → Pages
   - Source: Deploy from branch
   - Branch: `main`
   - Folder: `/docs`

2. **Custom Domain (Optional):**
   - Add CNAME file to `public/` directory
   - Configure DNS with your domain provider:
     ```
     Type: CNAME
     Name: www
     Value: yourusername.github.io
     ```

3. **Push to GitHub:**
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

## 🐛 Troubleshooting

### Common Issues

**"No valid form data received" error:**
- Ensure you created a NEW deployment after code changes
- Verify the deployment URL is correct in `.env`
- Check that OAuth scopes are properly configured

**CORS errors:**
- Confirm `mode: 'no-cors'` is set in fetch request
- This is expected behavior with Google Apps Script

**No email notifications:**
- Check Apps Script execution logs (View → Executions)
- Verify email address is correct in `Code.gs`
- Check spam folder

**Data not appearing in spreadsheet:**
- Verify spreadsheet ID matches
- Check Apps Script has permissions to access the sheet
- Review execution logs for errors

## 📊 Project Structure

```
creator-community-hub/
├── public/
│   ├── index.html          # Main HTML file
│   └── favicon files       # Site icons
├── src/
│   ├── main.js            # JavaScript logic
│   └── style.css          # Styling
├── docs/                  # Build output (GitHub Pages)
├── .env                   # Environment variables (not committed)
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

**Google Apps Script:**
```
Youtube Channel Signup/
├── Code.gs               # Backend logic
└── appsscript.json      # Configuration
```

## 🔐 Security Considerations

- Environment variables stored in `.env` (not committed to Git)
- Input sanitization on both client and server side
- OAuth scopes follow principle of least privilege
- Web app deployed with proper access controls
- No sensitive data exposed in client-side code

## 📈 Future Enhancements

- [ ] Add reCAPTCHA for spam protection
- [ ] Implement duplicate submission detection
- [ ] Add admin dashboard for viewing submissions
- [ ] Export data to CSV functionality
- [ ] Email confirmation to submitters
- [ ] Integration with Discord for community management

## 📝 Lessons Learned

1. **CORS with Google Apps Script:** Standard CORS doesn't work with Apps Script web apps; `no-cors` mode is required
2. **Content-Type Handling:** Apps Script may receive JSON as `text/plain`
3. **OAuth Complexity:** Proper scope configuration is critical for permissions
4. **Deployment Workflow:** Code changes require new deployments with updated URLs
5. **Environment Variables:** Vite requires `VITE_` prefix for exposed variables

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Website: [bobbymilani.com](https://bobbymilani.com)

## 🙏 Acknowledgments

- Google Apps Script documentation
- Vite documentation
- Community feedback and testing

---

**Note:** This project demonstrates full-stack development skills including frontend development, API integration, serverless backend implementation, OAuth configuration, and deployment workflows.
