# bobbymilani

website for bobbymilani

## Creator Community Hub

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
- **Google AdSense** - Monetization integration

### Backend
- **Google Apps Script** - Serverless backend for form processing
- **Google Sheets API** - Data storage and management
- **Gmail API** - Automated email notifications

### Deployment & Infrastructure
- **GitHub Pages** - Static site hosting (serving from `/docs` folder)
- **Cloudflare** - DNS management, CDN, and DDoS protection
- **SSL/TLS** - Full (strict) encryption for secure connections
- **Environment Variables** - Secure configuration management via `.env` file

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

### Monetization
- Google AdSense integration for revenue generation
- Proper ads.txt configuration for ad verification

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
- Cloudflare Account (for DNS and CDN)
- Google AdSense Account (optional, for monetization)

### Local Development

1. **Clone the repository:**
```bash
git clone https://github.com/babakmilani/bobbymilani.git
cd bobbymilani
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

**IMPORTANT:** The `.env` file must be in the **root directory** (same level as `package.json` and `vite.config.js`)

4. **Start development server:**
```bash
npm run dev
```

### Google Apps Script Setup

1. Create a new Google Apps Script project:
   - Go to [script.google.com](https://script.google.com)
   - Create new project named "Youtube Channel Signup"

2. Create necessary files:
   - `Code.gs` - Main backend logic
   - `appsscript.json` - Configuration manifest

3. Configure OAuth scopes in `appsscript.json`:
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

4. Deploy as web app:
   - Click "Deploy" → "New deployment"
   - Select type: "Web app"
   - Execute as: "Me"
   - Who has access: "Anyone"
   - Copy the deployment URL

5. Update `.env` with deployment URL

### Google Sheets Setup

1. Create a new Google Spreadsheet
2. Copy the spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
   ```
3. Update `SPREADSHEET_ID` in `Code.gs`

### Google AdSense Setup (Optional)

1. Sign up for Google AdSense:
   - Go to [adsense.google.com](https://adsense.google.com)
   - Complete the application process

2. Create `ads.txt` file:
   - Create an `ads.txt` file in the root directory
   - Add your AdSense publisher ID:
   ```
   google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
   ```

3. Build and deploy:
```bash
npm run build
git add .
git commit -m "Add AdSense ads.txt"
git push
```

4. Wait for GitHub Pages to rebuild (5-10 minutes)

5. Verify ads.txt is accessible:
   - Visit `https://yourdomain.com/ads.txt`
   - Should display your publisher information

6. Complete AdSense verification in dashboard

## 🚀 Deployment

### Vite Configuration

The project uses Vite to build production files. The `vite.config.js` must be properly configured to:
1. Output to the `/docs` folder (for GitHub Pages)
2. Include ALL HTML files in the build
3. Embed environment variables during build

**Correct `vite.config.js`:**
```javascript
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    base: '/',
    
    build: {
        outDir: 'docs',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                about: resolve(__dirname, 'about-me.html'),
                privacy: resolve(__dirname, 'privacy-policy.html'),
                terms: resolve(__dirname, 'terms-of-use.html'),
                // Include all HTML files from /videos folder
                chinaTravel: resolve(__dirname, 'videos/china-travel-tips.html'),
                denmarkCitizenship: resolve(__dirname, 'videos/denmark-citizenship.html'),
                // ... add other video HTML files
            }
        }
    }
})
```

**Key Points:**
- `outDir: 'docs'` - Builds to `/docs` folder for GitHub Pages
- `rollupOptions.input` - Must include ALL HTML files that need to be processed
- Files in `/videos` folder stay in root during development, get copied to `/docs/videos` during build

### Build for Production

```bash
npm run build
```

This generates optimized files in the `docs/` directory with environment variables embedded.

**CRITICAL:** The `.env` file is only used during the build process. Environment variables are embedded into the JavaScript files at build time, not runtime.

### Deploy to GitHub Pages with Cloudflare

1. **Configure GitHub Pages:**
   - Repository Settings → Pages
   - Source: Deploy from branch
   - Branch: `main`
   - Folder: `/docs`

2. **Configure `.gitignore`:**
```
.env
/node_modules
```

**IMPORTANT:** Do NOT add `/docs` to `.gitignore` - GitHub Pages needs to serve these files!

3. **Configure Cloudflare DNS:**

   **Step 1: Add site to Cloudflare**
   - Sign up/log in to Cloudflare
   - Click "Add a Site" and enter your domain
   - Select the Free plan

   **Step 2: Update nameservers at your domain registrar**
   - Cloudflare will provide two nameservers (e.g., `bob.ns.cloudflare.com`)
   - Go to your domain registrar (GoDaddy, Namecheap, etc.)
   - Replace existing nameservers with Cloudflare's nameservers
   - Wait 24-48 hours for propagation (usually faster)

   **Step 3: Configure DNS records in Cloudflare**
   ```
   Type: CNAME
   Name: @
   Target: yourusername.github.io
   Proxy status: Proxied (orange cloud)
   
   Type: CNAME
   Name: www
   Target: yourusername.github.io
   Proxy status: Proxied (orange cloud)
   ```

4. **Configure SSL/TLS Security:**
   - In Cloudflare dashboard → SSL/TLS
   - Set encryption mode to "Full" or "Full (strict)"
   - This ensures end-to-end encryption between visitors and your site
   - Enable "Always Use HTTPS" under SSL/TLS → Edge Certificates

5. **Additional Cloudflare Security (Optional):**
   - Enable "Automatic HTTPS Rewrites"
   - Turn on "Brotli" compression for faster loading
   - Configure page rules for caching optimization
   - Enable "Email Address Obfuscation" to protect against scrapers

6. **Configure GitHub Pages custom domain:**
   - In your repository, add a `CNAME` file to the root directory:
   ```
   bobbymilani.com
   ```
   - GitHub Pages will automatically detect and configure your custom domain

7. **Build and push to GitHub:**
```bash
npm run build
git add docs/
git add CNAME
git commit -m "Deploy to GitHub Pages with Cloudflare"
git push origin main
```

8. **Verify deployment:**
   - Visit your custom domain (https://bobbymilani.com)
   - Check that SSL certificate shows as valid (lock icon in browser)
   - Test both www and non-www versions
   - **Test the form submission** to ensure environment variables are working

**Benefits of Cloudflare Integration:**
- **DDoS Protection** - Automatic mitigation of malicious traffic
- **CDN** - Global content delivery for faster load times
- **SSL/TLS** - Free SSL certificate with full encryption
- **DNS Management** - Fast and reliable DNS resolution
- **Analytics** - Traffic insights and threat monitoring
- **Caching** - Reduced server load and improved performance

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

**AdSense crawler can't verify site (ads.txt 404 error):**
- Ensure `ads.txt` is in the root folder (not `/docs`)
- Rebuild the project: `npm run build`
- Push changes to GitHub and wait 5-10 minutes
- Temporarily disable Cloudflare proxy to test
- Once confirmed working, re-enable proxy and purge cache
- Verify file is accessible: `https://yourdomain.com/ads.txt`

### Form Submission Issues (CRITICAL)

**Problem: "Cannot read properties of undefined (reading 'VITE_GOOGLE_APP_SCRIPT_URL')"**

This error occurs when environment variables are not embedded in the production build.

**Root Cause:**
Environment variables from `.env` are only available during the build process, not at runtime in the browser. They must be embedded into the JavaScript files when running `npm run build`.

**Solution:**

1. **Verify `.env` file location:**
   - Must be in root directory (same level as `package.json`)
   - NOT in `/docs` or any subfolder

2. **Verify `.gitignore` configuration:**
   ```
   .env
   /node_modules
   ```
   - **Do NOT include `/docs` in `.gitignore`** - GitHub Pages needs these files!

3. **Remove CSS import from `main.js`:**
   
   **CRITICAL FIX:** The CSS should NOT be imported in `main.js` when you already have it linked in HTML.
   
   ```javascript
   // main.js
   
   // DELETE THIS LINE if it exists:
   // import './style.css';
   
   // Start with:
   const SCRIPT_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
   const ANALYTICS_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
   // ... rest of code
   ```
   
   **Why?** When CSS is imported via JavaScript modules, Vite tries to load it as a JavaScript module, causing MIME type errors. Since `style.css` is already linked in the HTML `<head>`, the import is unnecessary and causes conflicts.

4. **Update `vite.config.js` to include all HTML files:**
   ```javascript
   import { defineConfig } from 'vite'
   import { resolve } from 'path'

   export default defineConfig({
       base: '/',
       build: {
           outDir: 'docs',
           emptyOutDir: true,
           rollupOptions: {
               input: {
                   main: resolve(__dirname, 'index.html'),
                   about: resolve(__dirname, 'about-me.html'),
                   // ... add ALL your HTML files
                   chinaTravel: resolve(__dirname, 'videos/china-travel-tips.html'),
               }
           }
       }
   })
   ```

5. **Clean build and redeploy:**
   ```bash
   # Remove old build
   rm -rf docs/
   
   # Build with environment variables
   npm run build
   
   # Verify environment variables are embedded
   # Open docs/assets/*.js and search for your script URL
   
   # Commit and push
   git add docs/
   git add main.js
   git add vite.config.js
   git commit -m "Fix production environment variables"
   git push
   ```

6. **Wait for GitHub Pages to rebuild** (5-10 minutes)

7. **Test the form:**
   - Open browser console (F12)
   - Fill out and submit the form
   - Check for any errors
   - Verify submission appears in Google Sheets

**Verification Steps:**

After deployment, verify environment variables are embedded:
1. Visit your live site
2. Open browser DevTools (F12) → Sources tab
3. Look in `docs/assets/` for the main JavaScript bundle
4. Search for your Google Apps Script URL
5. If found, environment variables are properly embedded
6. If not found, rebuild locally and redeploy

**Important Notes:**
- Environment variables are embedded at **build time**, not runtime
- Changes to `.env` require a **full rebuild** (`npm run build`)
- The `/docs` folder must be **committed to Git** for GitHub Pages to serve it
- Each push to GitHub triggers an automatic Pages rebuild (5-10 minutes)

## 📊 Project Structure

```
bobbymilani/
├── index.html             # Main HTML file
├── about-me.html          # About page
├── privacy-policy.html    # Privacy policy
├── terms-of-use.html      # Terms of use
├── style.css              # Main stylesheet
├── main.js                # JavaScript logic
├── ads.txt                # AdSense verification
├── CNAME                  # Custom domain config
├── favicon files          # Site icons
├── videos/                # Video article pages
│   ├── china-travel-tips.html
│   ├── denmark-citizenship.html
│   └── ...
├── img/                   # Images
├── docs/                  # Build output (GitHub Pages) - COMMITTED TO GIT
│   ├── index.html
│   ├── assets/
│   ├── videos/
│   └── ...
├── .env                   # Environment variables (NOT committed)
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

## 🔒 Security Considerations

### Application Security
- Environment variables stored in `.env` (not committed to Git)
- Environment variables embedded at build time, not exposed in source
- Input sanitization on both client and server side
- OAuth scopes follow principle of least privilege
- Web app deployed with proper access controls
- No sensitive data exposed in client-side code

### Infrastructure Security
- **Cloudflare Proxy:** All traffic routes through Cloudflare's network, hiding origin server IP
- **SSL/TLS Full Mode:** End-to-end encryption from visitor to GitHub Pages
- **HTTPS Enforcement:** Automatic redirect from HTTP to HTTPS
- **DDoS Protection:** Cloudflare's automatic mitigation protects against attacks
- **Web Application Firewall (WAF):** Available on higher tiers for advanced threat protection

### Best Practices Implemented
- Custom domain with SSL/TLS certificate
- HTTPS-only policy enforced
- Secure header configurations via Cloudflare
- Regular dependency updates
- Minimal attack surface with static site hosting
- Proper separation of development and production environments

## 📈 Future Enhancements
- Add reCAPTCHA for spam protection
- Implement duplicate submission detection
- Add admin dashboard for viewing submissions
- Export data to CSV functionality
- Email confirmation to submitters
- Integration with Discord for community management
- Cloudflare Analytics for advanced traffic insights
- Rate limiting via Cloudflare Workers
- A/B testing for conversion optimization
- Implement ad placement optimization strategies

## 📚 Lessons Learned

### Technical Challenges Overcome

**1. CORS with Google Apps Script:**
- **Challenge:** Standard CORS doesn't work with Apps Script web apps
- **Solution:** Use `no-cors` mode and rely on server-side logging for error detection
- **Learning:** Trade-off between response visibility and cross-origin compatibility

**2. Content-Type Handling:**
- **Challenge:** Apps Script receives JSON as `text/plain` instead of `application/json`
- **Solution:** Parse JSON from `e.postData.contents` regardless of content-type header
- **Learning:** Backend must be flexible with content-type parsing

**3. OAuth Complexity:**
- **Challenge:** Multiple authorization scopes needed for Sheets, Email, and User Info
- **Solution:** Properly configured `appsscript.json` with all required scopes
- **Learning:** Each scope requires explicit authorization and redeployment

**4. Deployment Workflow:**
- **Challenge:** Code changes don't automatically update running web app
- **Solution:** Create new deployment after each code change and update endpoint URL
- **Learning:** Test deployments vs. production deployments require different management

**5. Environment Variables in Vite:**
- **Challenge:** Environment variables not available in production build
- **Root Cause:** Variables are embedded at build time, not runtime
- **Solution:** 
  - Use `VITE_` prefix for client-side variables
  - Ensure `.env` file is in root directory
  - Build locally with `npm run build`
  - Commit `/docs` folder to Git (do NOT add to `.gitignore`)
  - Environment variables get embedded into JavaScript during build
- **Security Consideration:** Never expose secrets, only public endpoints
- **Learning:** Static site hosting requires build-time variable injection, not runtime configuration

**6. CSS Import Conflicts:**
- **Challenge:** "Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of 'text/css'"
- **Root Cause:** Importing CSS in `main.js` while also linking it in HTML causes module resolution conflicts
- **Solution:** Remove `import './style.css'` from JavaScript files when CSS is already in HTML
- **Learning:** Vite treats CSS imports as JavaScript modules; avoid duplicate imports through different methods

**7. Multi-page Build Configuration:**
- **Challenge:** HTML files in `/videos` subfolder not being built/deployed properly
- **Root Cause:** Vite only builds entry points defined in `rollupOptions.input`
- **Solution:** Explicitly list ALL HTML files in `vite.config.js` using `resolve(__dirname, 'path/to/file.html')`
- **Learning:** Vite doesn't automatically discover HTML files; each page must be declared as an entry point
- **Best Practice:** Keep source files in root during development; Vite handles copying to output folder with proper structure

**8. GitHub Pages Deployment Strategy:**
- **Challenge:** Deciding between root vs. `/docs` folder deployment
- **Solution:** Build to `/docs` folder and serve from there
- **Reasoning:**
  - Keeps source files and built files in same repository
  - No need for separate deployment branch
  - Simpler workflow for solo developers
- **Trade-off:** `/docs` folder must be committed to Git (larger repository size)

**9. DNS and SSL Configuration:**
- **Challenge:** Setting up custom domain with proper HTTPS encryption
- **Solution:** Cloudflare nameservers + Full SSL/TLS mode
- **Learning:** DNS propagation can take time; Cloudflare proxy provides security benefits
- **Gotcha:** Cloudflare caching can mask deployment issues; temporarily disable proxy when troubleshooting

**10. Static Site Limitations:**
- **Challenge:** No backend for form processing
- **Solution:** Leverage Google Apps Script as a serverless backend
- **Trade-off:** Less control but zero infrastructure management
- **Learning:** Serverless solutions work well for simple CRUD operations

**11. AdSense ads.txt Verification:**
- **Challenge:** AdSense crawler returning 404 for ads.txt file
- **Root Cause:** File must be in root directory to be copied by Vite during build
- **Solution:**
  - Place `ads.txt` in root (not in `/docs`)
  - Vite automatically copies it to `/docs` during build
  - Verify accessibility at `https://domain.com/ads.txt`
- **Learning:** Build tools require proper file placement; understand your build process

**12. Build Workflow Best Practices:**
- Always build locally before pushing to production
- Verify environment variables in built files before deploying
- Test production build locally with `npm run preview`
- Check browser console for errors after deployment
- Wait for GitHub Pages rebuild (5-10 minutes) before testing
- Clear browser cache when testing changes
- Use browser DevTools to verify correct files are loading

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 👤 Author

**Babak Milani**
- GitHub: [@babakmilani](https://github.com/babakmilani)
- Website: [bobbymilani.com](https://bobbymilani.com)

## 🙏 Acknowledgments

- Google Apps Script documentation
- Vite documentation
- Cloudflare documentation
- Community feedback and testing

---

**Note:** This project demonstrates full-stack development skills including frontend development, API integration, serverless backend implementation, OAuth configuration, infrastructure management, build tooling, and deployment workflows.