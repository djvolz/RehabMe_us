
// Parse App Id and JavaScript Key
var AppId         = "jix4a7ziO3LTyuL4PZ3IyyRUA7DmnwRO0zvka2z5";
var JavaScriptKey = "YjcdhUmLeR4w43lx7lYyCmKJZXCXaiZDVADzSCJk";

// Facebook appId
var facebookId = "612719192206515";

Parse.initialize( AppId, JavaScriptKey );

// Facebook functions
window.fbAsyncInit = function() {
  // init the FB JS SDK
  FB.init({
    appId      : facebookId,                        // App ID from the app dashboard
    //  channelUrl : '//WWW.YOUR_DOMAIN.COM/channel.html', // Channel file for x-domain comms
    status     : true,                                 // Check Facebook Login status
    xfbml      : true,                                  // Look for social plugins on the page
    version    : 'v2.3'
  });
  // Additional initialization code such as adding Event Listeners goes here
  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      console.log('Logged in.');
    }
    else {
      FB.login();
    }
  });
  // Parse facebook users setup
  Parse.FacebookUtils.init({
    //channelUrl : 'www.rehabme.us/index.html',
    appId      : facebookId, // Facebook App ID
    status     : true,      // Check Facebook Login status
    cookie     : true,       // Enable cookies to allow Parse to access the session
    xfbml      : true,       // Initialize Facebook social plugins on the page
    oauth      : true,
    version    : 'v2.3'      // Point to the latest Facebook Graph API version
  });

  Parse.FacebookUtils.logIn(null, {
    success: function(user) {
      if (!user.existed()) {
        alert("User signed up and logged in through Facebook!");
      } else {
        alert("User logged in through Facebook!");
      }
    },
    error: function(user, error) {
      alert("User cancelled the Facebook login or did not fully authorize.");
    }
  });
};

// load the SDK asynchronously
(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/all.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));

  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    });
  }
