import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [authCode, setAuthCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  
  // Facebook OAuth configuration
  const facebookConfig = {
    appId: process.env.REACT_APP_FACEBOOK_APP_ID,
    redirectUri: process.env.REACT_APP_FACEBOOK_REDIRECT_URI,
    scope: 'ads_read,email', // Facebook permission for reading ads data
    responseType: 'code', // Changed back to 'code' from 'token'
    state: 'facebook_oauth_security_token',
    version: 'v18.0'
  };

  // Check URL for authorization code on component mount
  useEffect(() => {
    // For code response, Facebook uses URL query parameters (?) instead of hash (#)
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const errorParam = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    const state = urlParams.get('state');
    
    if (errorParam) {
      setError(`Facebook OAuth Error: ${errorParam} - ${errorDescription || 'Unknown error'}`);
      return;
    }
    
    if (code) {
      // Verify state parameter for security
      if (state !== facebookConfig.state) {
        setError('Invalid state parameter. Possible CSRF attack.');
        return;
      }
      
      setAuthCode(code); // This will now be the authorization code
      // Clean URL for better UX
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [facebookConfig.state]);

  // Function to initiate Facebook OAuth flow
  const handleFacebookConnect = () => {
    if (!facebookConfig.appId) {
      alert('Facebook App ID is not configured. Please check your .env file.');
      return;
    }

    const authUrl = `https://www.facebook.com/${facebookConfig.version}/dialog/oauth?` +
      `client_id=${encodeURIComponent(facebookConfig.appId)}` +
      `&redirect_uri=${encodeURIComponent(facebookConfig.redirectUri)}` +
      `&scope=${encodeURIComponent(facebookConfig.scope)}` +
      `&response_type=${facebookConfig.responseType}` +
      `&state=${facebookConfig.state}`;
    
    console.log('Redirecting to Facebook OAuth:', authUrl);
    window.location.href = authUrl;
  };

  // Function to copy token to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(authCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  // Function to reset the app state
  const resetApp = () => {
    setAuthCode('');
    setError('');
  };

  return (
    <div className="container">
      <header>
        <h1>📘 Facebook Ads API Authorization</h1>
        <p className="subtitle">Authorization code generator for Facebook Marketing API</p>
      </header>
      
      {error && (
        <div className="error-section">
          <h3>❌ Authorization Error</h3>
          <p>{error}</p>
          <button className="reset-button" onClick={resetApp}>
            Try Again
          </button>
        </div>
      )}
      
      {!authCode && !error ? (
        <div className="connect-section">
          <div className="facebook-info">
            <h3>🚀 Connect to Facebook Ads API</h3>
            <p>Click the button below to authorize access to your Facebook Ads data.</p>
              <div className="permissions-info">
                <h4>📋 Permissions Requested:</h4>
                <ul>
                  <li><strong>ads_read</strong> - Read access to your Facebook Ads data</li>
                  <li><strong>email</strong> - Access to your email address</li>
                  <li>View ad campaigns, ad sets, and ads performance</li>
                  <li>Access insights and analytics data</li>
                  <li>Read Business Manager information</li>
                </ul>
              </div>
            <div className="setup-info">
              <h4>⚙️ Setup Requirements:</h4>
              <ul>
                <li>Facebook Developer Account</li>
                <li>Facebook App created in Developer Console</li>
                <li>App configured with Marketing API permissions</li>
                <li>Valid redirect URI configured</li>
              </ul>
            </div>
            
            <button className="connect-button" onClick={handleFacebookConnect}>
              🔗 Connect with Facebook
            </button>
          </div>
        </div>
      ) : authCode ? (
        <div className="code-section">
          <div className="success-header">
            <h2>✅ Facebook Authorization Code Generated</h2>
            <p className="instructions">
              Exchange this code for an access token using your backend server
            </p>
          </div>
          
          <div className="code-display">
            <p className="code-label">Your authorization code:</p>
            <div className="code-box">
              <code>{authCode}</code>
            </div>
          </div>
          
          <div className="buttons">
            <button className="copy-button" onClick={copyToClipboard}>
              {copied ? '✅ Copied!' : '📋 Copy Code'}
            </button>
            <button className="reset-button" onClick={resetApp}>
              🔄 Start Over
            </button>
          </div>

          <div className="api-example">
            <h3>🔗 Token Exchange Example:</h3>
            <pre>
{`POST https://graph.facebook.com/v18.0/oauth/access_token
Content-Type: application/x-www-form-urlencoded

client_id=${facebookConfig.appId}&
client_secret=YOUR_APP_SECRET&
redirect_uri=${facebookConfig.redirectUri}&
code=${authCode}`}
            </pre>
          </div>

          <div className="next-steps">
            <h3>📝 Next Steps:</h3>
            <ol>
              <li>Copy the authorization code above</li>
              <li>Send it to your backend server</li>
              <li>Exchange the code for an access token using your app secret</li>
              <li>Use the access token for Facebook Graph API calls</li>
            </ol>
          </div>

          <div className="token-info">
            <h3>🔑 Code Information:</h3>
            <ul>
              <li><strong>Authorization Code:</strong> Single-use, expires in ~10 minutes</li>
              <li><strong>Requires Exchange:</strong> Must be exchanged for access token on backend</li>
              <li><strong>More Secure:</strong> App secret never exposed to frontend</li>
              <li><strong>Scope:</strong> ads_read permission included</li>
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;