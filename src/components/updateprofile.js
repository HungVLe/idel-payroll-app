async function editProfile() {
    await checkProfile()
    var profile_data = getUserProfile()
    console.log("editProfile " + profile_data)
    console.log("editProfile " + JSON.parse(profile_data))
    console.log("editProfile " + JSON.stringify(profile_data))
    console.log("editProfile " + jQuery.isEmptyObject(JSON.parse(profile_data)).toString())

    if (jQuery.isEmptyObject(JSON.parse(profile_data)) === true) {
        console.log("createProfile-start")
        await createProfile()
        console.log("createProfile-end")
    } else {
        console.log("updateProfile-start")
        await updateProfile()
        console.log("updateProfile-end")
    }
    await checkProfile()
    profile_data = getUserProfile()
    console.log("editProfile" + profile_data)
    window.location = '/home.html';
}

async function createProfile() {
    var defaultRate = 20;
    var defaultRole = "employee";
    console.log("updateProfile " + document.getElementById('email').value)
    console.log("updateProfile " + $('#firstname').val())

    var params = {
        'emailid': $('#email').val()
    }
    var body =
    {
        "operation": "update",
        "payload": {
            "TableName": "Payroll",
            "Key": {
                "emailid": $('#email').val()
            },
            "UpdateExpression": "set rate =:r, firstname =:fn, lastname =:ln, emp_role =:rl, streetaddress =:sa, city =:ct, state_province =:st, zip =:z",
            "ExpressionAttributeValues": {
                ":r": defaultRate,
                ":fn": $('#firstname').val(),
                ":ln": $('#lastname').val(),
                ":rl": defaultRole,
                ":sa": $('#street').val(),
                ":ct": $('#city').val(),
                ":st": $('#state').val(),
                ":z": $('#zip').val()
            },
            "ReturnValues": "ALL_NEW"
        }
    }

    var additionalParams = {
        headers: {

        },
        queryParams: {
            'emailid': $('#email').val()
        }
    }
    await apigClient.payrolldaoPost(params, body, additionalParams)
        .then(function (response) {
            console.log(response.data)
            var dataResult = response.data
            console.log(jQuery.isEmptyObject(dataResult).toString())
            console.log(JSON.stringify(dataResult))
        }).catch(function (error) {
            console.log(error)
        })
}

async function updateProfile() {
    var defaultRate = 20;
    var defaultRole = "employee";
    console.log("updateProfile " + document.getElementById('email').value)
    console.log("updateProfile " + $('#firstname').val())

    var params = {
        'emailid': $('#email').val()
    }
    var body =
    {
        "operation": "update",
        "payload": {
            "TableName": "Payroll",
            "Key": {
                "emailid": $('#email').val()
            },
            "UpdateExpression": "set firstname =:fn, lastname =:ln, streetaddress =:sa, city =:ct, state_province =:st, zip =:z",
            "ExpressionAttributeValues": {
                ":fn": $('#firstname').val(),
                ":ln": $('#lastname').val(),
                ":sa": $('#street').val(),
                ":ct": $('#city').val(),
                ":st": $('#state').val(),
                ":z": $('#zip').val()
            },
            "ReturnValues": "ALL_NEW"
        }
    }

    var additionalParams = {
        headers: {

        },
        queryParams: {
            'emailid': $('#email').val()
        }
    }
    await apigClient.payrolldaoPost(params, body, additionalParams)
        .then(function (response) {
            console.log(response.data)
            var dataResult = response.data
            console.log(jQuery.isEmptyObject(dataResult).toString())
            console.log(JSON.stringify(dataResult))
        }).catch(function (error) {
            console.log(error)
        })
}