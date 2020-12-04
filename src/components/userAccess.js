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
    console.log("getUserProfile");
    console.log(user_profile_data);
    console.log(JSON.stringify(user_profile_data));
    console.log("getUserProfile");
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
                await checkProfile()
                var profile_data = getUserProfile()
                console.log(profile_data)
                console.log("cLaP " + jQuery.isEmptyObject(JSON.parse(profile_data)).toString())

                if (jQuery.isEmptyObject(JSON.parse(profile_data)) === true) {
                    window.location = '/profile.html';
                } else {
                    console.log("cLaP" + profile_data)
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

async function checkProfile() {

    var emailid = (!getUserEmail()) ? '1' : getUserEmail();

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
            var dataResult = response.data
            console.log(jQuery.isEmptyObject(dataResult).toString())
            console.log(JSON.stringify(dataResult))
            localStorage.setItem("user_profile_data", JSON.stringify(dataResult))
        }).catch(function (error) {
            console.log(error)
        })
}

function checkManager() {
    var dataResult = getUserProfile();
    var profile_data = JSON.parse(dataResult);
    console.log(profile_data)
    var role = profile_data.Item.emp_role
    if (role === "manager") {
        var manager = $('#manager_tab')
        manager.html('');
        let hyper = `<a class="nav-link" href="./manager.html">Manage</a>`;
        manager.append(hyper)
        return true;
    }
    return false;
}