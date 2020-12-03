var authData = {
    UserPoolId: 'us-east-2_tTcZIIund',
    ClientId: '7f1b4nd21qefsnd5c5e5v98l2c',
    RedirectUriSignIn: 'https://d28torhgmcngv.cloudfront.net/login.html',
    RedirectUriSignOut: 'https://d28torhgmcngv.cloudfront.net',
    AppWebDomain: 'd28torhgmcngv.cloudfront.net',
    TokenScopesArray: ['email']
};
var auth = new AmazonCognitoIdentity.CognitoAuth(authData);
auth.userhandler = {
    onSuccess: function (result) {
        //you can do something here
    },
    onFailure: function (err) {
        // do somethig if fail
    }
};


function getAuth() {
    //get the current URL with the Hash that contain Cognito Tokens tokens    
    var curUrl = window.location.href;

    auth.parseCognitoWebResponse(curUrl);

    console.log("CognitoAuth " + auth)

    window.location = '/';
}

function removeAuth(){
    auth.signOut();
    localStorage.clear();
    window.location = '/';
}