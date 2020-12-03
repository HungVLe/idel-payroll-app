var domain = "idel-payroll-app";
var region = "us-east-2";
var appClientId = "7f1b4nd21qefsnd5c5e5v98l2c";
var userPoolId = "us-east-2_tTcZIIund";
var callbackURL = "https://d28torhgmcngv.cloudfront.net/login.html";
var signoutURL = "https://d28torhgmcngv.cloudfront.net/logout.html";

var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
var apigClient = apigClientFactory.newClient();

function login() {
    window.location.href = "https://" + domain + ".auth." + region + ".amazoncognito.com/login?response_type=token&client_id=" + appClientId + "&redirect_uri=" + callbackURL
}

function signup() {
    window.location.href = "https://" + domain + ".auth." + region + ".amazoncognito.com/signup?response_type=token&client_id=" + appClientId + "&redirect_uri=" + callbackURL
}

function logout() {
    window.location.href = "https://" + domain + ".auth." + region + ".amazoncognito.com/logout?response_type=token&client_id=" + appClientId + "&logout_uri=" + signoutURL
}

function checkLogin(redirectOnRec, redirectOnUnrec) {
    var cognitoUser = userPool.getCurrentUser();
    if (cognitoUser !== null) {
        console.log("cognitoUser Name " + cognitoUser.getUsername())

        var poolStorage = userPool.storage
        console.log("userPool", poolStorage)

        var keyPrefix = "CognitoIdentityServiceProvider." + appClientId + "." + cognitoUser.getUsername();
        var accessTokenKey = keyPrefix + ".accessToken"
        var accessToken = poolStorage.getItem(accessTokenKey)
        console.log("accessToken " + accessToken)

        fetch("https://" + domain + ".auth." + region + ".amazoncognito.com/oauth2/userInfo", {
            method: 'post',
            headers: {
                'authorization': 'Bearer ' + accessToken
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(JSON.stringify(data, null, '\t'));
            console.log("Email " + data.email)
            var email = data.email

            if (email === null || email === undefined) {
                if (redirectOnUnrec) {
                    window.location = '/';
                }
            } else {
                localStorage.setItem("aws_cognito_user_email", email);
                if (redirectOnRec) {
                    window.location = '/home.html';
                }
            }
        });
    } else {
        if (redirectOnUnrec) {
            window.location = '/';
        }
    }
}

function getUserEmail() {
    var email = localStorage.getItem("aws_cognito_user_email");
    console.log(email)
    return email
}

function getUserProfile() {
    var user_profile_data = localStorage.getItem("user_profile_data");
    console.log("1231321231");
    console.log(user_profile_data);
    console.log(JSON.stringify(user_profile_data));
    console.log("1231321231");
    return user_profile_data;
}

async function checkLoginAndProfile(redirectOnRec, redirectOnUnrec) {
    var cognitoUser = userPool.getCurrentUser();
    if (cognitoUser !== null) {
        console.log("cognitoUser Name " + cognitoUser.getUsername())

        var poolStorage = userPool.storage
        console.log("userPool", poolStorage)

        var keyPrefix = "CognitoIdentityServiceProvider." + appClientId + "." + cognitoUser.getUsername();
        var accessTokenKey = keyPrefix + ".accessToken"
        var accessToken = poolStorage.getItem(accessTokenKey)
        console.log("accessToken " + accessToken)

        await fetch("https://" + domain + ".auth." + region + ".amazoncognito.com/oauth2/userInfo", {
            method: 'post',
            headers: {
                'authorization': 'Bearer ' + accessToken
            }
        }).then((response) => {
            return response.json();
        }).then(async (data) => {
            console.log(JSON.stringify(data, null, '\t'));
            console.log("Email " + data.email)
            var email = data.email

            if (email === null || email === undefined) {
                if (redirectOnUnrec) {
                    window.location = '/';
                }
            } else {
                localStorage.setItem("aws_cognito_user_email", email);
                await registerDefaultProfileForNewUser()
                var profile_data = getUserProfile()

                if (jQuery.isEmptyObject(profile_data) === true) {
                    window.location = '/profile.html';
                } else {
                    console.log("234234" +profile_data)
                    if (redirectOnRec) {
                        window.location = '/home.html';
                    }
                }
            }
        });
    } else {
        if (redirectOnUnrec) {
            window.location = '/';
        }
    }
}

async function registerDefaultProfileForNewUser() {

    var emailid = getUserEmail();

    var formData = {
        'emailid': emailid
    }
    var params = {
        'emailid': emailid
    }
    var body = {
        "operation": "read",
        "payload": {
            "TableName": "Payroll",
            "Key": {
                "emailid": emailid
            }
        }
    }
    var additionalParams = {
        headers: {

        },
        queryParams: {
            'emailid': emailid
        }
    }
    await apigClient.payrolldaoPost(params, body, additionalParams)
        .then(function (response) {
            console.log(response.data)
            dataResult = response.data
            console.log(jQuery.isEmptyObject(dataResult).toString())
            console.log(JSON.stringify(dataResult))
            localStorage.setItem("user_profile_data", JSON.stringify(dataResult))
        }).catch(function (error) {
            console.log(error)
        })
}