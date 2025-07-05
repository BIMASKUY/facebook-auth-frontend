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
    responseType: 'token', // Changed from 'code' to 'token'
    state: 'facebook_oauth_security_token',
    version: 'v18.0'
  };

  // Check URL for access token on component mount
  useEffect(() => {
    // For token response, Facebook uses URL hash (#) instead of query (?)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const token = hashParams.get('access_token');
    const errorParam = hashParams.get('error');
    const errorDescription = hashParams.get('error_description');
    const state = hashParams.get('state');
    
    if (errorParam) {
      setError(`Facebook OAuth Error: ${errorParam} - ${errorDescription || 'Unknown error'}`);
      return;
    }
    
    if (token) {
      // Verify state parameter for security
      if (state !== facebookConfig.state) {
        setError('Invalid state parameter. Possible CSRF attack.');
        return;
      }
      
      setAuthCode(token); // This will now be the actual access token
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
        <p className="subtitle">Access token generator for Facebook Marketing API</p>
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
            <h2>✅ Facebook Access Token Generated</h2>
            <p className="instructions">
              Use this access token directly with Facebook Graph API calls
            </p>
          </div>
          
          <div className="code-display">
            <p className="code-label">Your access token:</p>
            <div className="code-box">
              <code>{authCode}</code>
            </div>
          </div>
          
          <div className="buttons">
            <button className="copy-button" onClick={copyToClipboard}>
              {copied ? '✅ Copied!' : '📋 Copy Token'}
            </button>
            <button className="reset-button" onClick={resetApp}>
              🔄 Start Over
            </button>
          </div>

          <div className="api-example">
            <h3>🔗 API Request Example:</h3>
            <pre>
              {`GET https://graph.facebook.com/v18.0/me/adaccounts?access_token=${authCode}`}
            </pre>
          </div>

          <div className="next-steps">
            <h3>📝 Next Steps:</h3>
            <ol>
              <li>Copy the access token above</li>
              <li>Use it directly in Facebook Graph API calls</li>
              <li>Get your ad accounts: GET /me/adaccounts</li>
              <li>Access campaigns, ads, and insights data</li>
            </ol>
          </div>

          <div className="token-info">
            <h3>🔑 Token Information:</h3>
            <ul>
              <li><strong>User Access Token:</strong> Valid for ~1-2 hours initially</li>
              <li><strong>Exchange for long-lived:</strong> Can be extended to ~60 days</li>
              <li><strong>Ready to use:</strong> No backend exchange needed</li>
              <li><strong>Scope:</strong> ads_read permission included</li>
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;