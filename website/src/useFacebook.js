export function initializeFacebook(dispatch){
    window.fbAsyncInit = function() {
        FB.init({
        appId      : '183549722751333',
        cookie     : true,
        xfbml      : true,
        version    : 'v6.0'
        });
        console.log('facebook init');
    };
    (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
}