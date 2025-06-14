# Facebook OAuth Frontend

A React application for generating Facebook Ads API OAuth authorization codes.

## Features

- Facebook OAuth 2.0 integration
- `ads_read` permission for Facebook Ads API
- Security with state parameter validation
- Clean UI with error handling
- Authorization code display and copy functionality

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Facebook App:**
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create a new app or use existing one
   - Add "Facebook Login" product
   - Configure redirect URI: `http://localhost:3001`
   - Request `ads_read` permission (requires app review for production)

3. **Environment variables:**
   Create a `.env` file:
   ```env
   PORT=3001
   REACT_APP_FACEBOOK_APP_ID=your_facebook_app_id_here
   REACT_APP_FACEBOOK_REDIRECT_URI=http://localhost:3001
   ```

4. **Run the application:**
   ```bash
   npm start
   ```

## Usage

1. Click "Connect with Facebook"
2. Authorize the app in Facebook
3. Copy the generated authorization code
4. Use the code in your backend to exchange for access tokens

## API Integration

Send the authorization code to your backend:

```javascript
POST http://localhost:3000/facebook/oauth
Content-Type: application/json

{
  "code": "authorization_code_here"
}
```

## Facebook Permissions

- **ads_read**: Read access to Facebook Ads data
- Allows reading campaigns, ad sets, ads, and insights
- Requires Facebook app review for production use

## Notes

- This app runs on port 3001 to avoid conflicts
- Facebook tokens have different expiration times
- Business verification may be required for some permissions
- Test with Facebook test accounts during development