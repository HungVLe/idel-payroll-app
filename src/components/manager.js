async function showEmployees() {

    var params = {
        "emp_role": "employee"
    }
    var body =
    {
        "operation": "list",
        "payload": {
            "TableName": "Payroll",
            "FilterExpression": "emp_role = :r",
            "ExpressionAttributeValues": {
                ":r": "employee"
            }
        }
    }

    var additionalParams = {
        headers: {

        },
        queryParams: {
            "emp_role": "employee"
        }
    }
    await apigClient.timesheetdaoPost(params, body, additionalParams)
        .then(function (response) {
            console.log(response.data)
            dataResult = response.data
            console.log(jQuery.isEmptyObject(dataResult).toString())
            console.log(JSON.stringify(dataResult))
            printEmployees(dataResult)
        }).catch(function (error) {
            console.log(error)
        })
}

async function printEmployees(data) {
    var list = $('#show_employees')
    list.html('');

    let tables = `<table class="styled-table">
    <thead>
    <tr>
        <th>Email ID</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Go to</th>
    </tr>
    </thead>
    <tbody>`;
    await data.Items.forEach(function (item, i) {
        console.log(item);
        tables += `
            <tr>
                <td>${item.emailid}</td>
                <td>${item.firstname}</td>
                <td>${item.lastname}</td>
                <td>
                    <button type="button" class="btn btn-primary" onclick="window.location.href='https://d28torhgmcngv.cloudfront.net/employee.html?emailid=${item.emailid}'">Manage</button>
                </td>
            </tr>`;
    })
    tables += `</tbody></table>`;
    list.append(tables)
}