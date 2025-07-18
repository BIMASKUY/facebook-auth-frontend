# Facebook OAuth Frontend

A React application for generating Facebook Ads API OAuth authorization codes.

## Features

- Facebook OAuth 2.0 authorization code flow
- `ads_read` permission for Facebook Ads API
- Security with state parameter validation
- Clean UI with error handling
- Authorization code display and copy functionality
- Secure server-side token exchange workflow

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Facebook App:**
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create a new app or use existing one
   - Add "Facebook Login" product
   - Configure redirect URI: `http://localhost:3000`
   - Request `ads_read` permission (requires app review for production)

3. **Environment variables:**
   Create a `.env` file:
   ```env
   PORT=3000
   REACT_APP_FACEBOOK_APP_ID=your_facebook_app_id_here
   REACT_APP_FACEBOOK_REDIRECT_URI=http://localhost:3000
   ```

4. **Run the application:**
   ```bash
   npm start
   ```

## Usage

1. Click "Connect with Facebook"
2. Authorize the app in Facebook
3. Copy the generated authorization code
4. Send the code to your backend server for token exchange

## Token Exchange Process

The app generates an authorization code that must be exchanged for an access token on your backend:

```javascript
// Send authorization code to your backend
POST https://kpi-dashboard.mpkmb.com/api/meta-oauth
Content-Type: application/json

{
  "code": "authorization_code_here"
}
```

**Backend token exchange:**
```javascript
// Your backend should make this request to Facebook
POST https://graph.facebook.com/v18.0/oauth/access_token
Content-Type: application/x-www-form-urlencoded

client_id=YOUR_FACEBOOK_APP_ID&
client_secret=YOUR_FACEBOOK_APP_SECRET&
redirect_uri=http://localhost:3000&
code=authorization_code_here
```

## Security Benefits

- **Authorization Code Flow**: More secure than implicit flow
- **App Secret Protected**: Client secret never exposed to frontend
- **CSRF Protection**: State parameter validation
- **Short-lived Codes**: Authorization codes expire in ~10 minutes
- **Single Use**: Each code can only be exchanged once

## Facebook Permissions

- **ads_read**: Read access to Facebook Ads data
- **email**: Access to user's email address
- Allows reading campaigns, ad sets, ads, and insights
- Requires Facebook app review for production use

## Notes

- This app runs on port 3000
- Authorization codes expire in approximately 10 minutes
- Codes are single-use and must be exchanged immediately
- Business verification may be required for some permissions
- Test with Facebook test accounts during development
- Always exchange codes on your backend server for security