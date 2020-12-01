function checkDB() {
    var apigClient = apigClientFactory.newClient();
    var formData = {
        'EmployeeID': $('#employeeID').val()
    }
    var params = {
        'EmployeeID': $('#employeeID').val()
    }
    var body = {
        "operation": "read",
        "payload": {
            "TableName": "Payroll",
            "Key": {
                "EmployeeID": parseInt($('#employeeID').val())
            }
        }
    }
    var additionalParams = {
        headers: {

        },
        queryParams: {
            'EmployeeID': $('#employeeID').val()
        }
    }
    apigClient.payrollPost(params, body, additionalParams)
        .then(function (response) {
            console.log(response.data)
            var dataResult = response.data
            document.getElementById("result").innerHTML = JSON.stringify(dataResult)
        }).catch(function (error) {
            console.log(error)
        })
}