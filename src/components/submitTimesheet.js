
async function submitTimesheet() {
    var record = {
        "day_1": {
            "date": document.getElementById("date_1").value,
            "start": document.getElementById("start_1").value,
            "end": document.getElementById("end_1").value,
            "total": document.getElementById("hours_1").value
        },
        "day_2": {
            "date": document.getElementById("date_2").value,
            "start": document.getElementById("start_2").value,
            "end": document.getElementById("end_2").value,
            "total": document.getElementById("hours_2").value
        },
        "day_3": {
            "date": document.getElementById("date_3").value,
            "start": document.getElementById("start_3").value,
            "end": document.getElementById("end_3").value,
            "total": document.getElementById("hours_3").value
        },
        "day_4": {
            "date": document.getElementById("date_4").value,
            "start": document.getElementById("start_4").value,
            "end": document.getElementById("end_4").value,
            "total": document.getElementById("hours_4").value
        },
        "day_5": {
            "date": document.getElementById("date_5").value,
            "start": document.getElementById("start_5").value,
            "end": document.getElementById("end_5").value,
            "total": document.getElementById("hours_5").value
        },
        "day_6": {
            "date": document.getElementById("date_6").value,
            "start": document.getElementById("start_6").value,
            "end": document.getElementById("end_6").value,
            "total": document.getElementById("hours_6").value
        },
        "day_7": {
            "date": document.getElementById("date_7").value,
            "start": document.getElementById("start_7").value,
            "end": document.getElementById("end_7").value,
            "total": document.getElementById("hours_7").value
        }
    }

    console.log("submitTimesheet " + record)
    console.log("submitTimesheet" + JSON.stringify(record))
    await createRecord(record)
    alert("Submitted");
}

async function createRecord(record) {

    console.log("createRecord " + record)
    var email = getUserEmail();
    //var email = "123456"
    var record_id = uuidv4()

    var params = {
        'record_id': record_id
    }
    var body =
    {
        "operation": "update",
        "payload": {
            "TableName": "TimeSheet",
            "Key": {
                "record_id": record_id
            },
            "UpdateExpression": "set rd_status =:s, emailid =:i, record_hr =:r",
            "ExpressionAttributeValues": {
                ":s": "pending",
                ":i": email,
                ":r": record
            },
            "ReturnValues": "ALL_NEW"
        }
    }

    var additionalParams = {
        headers: {

        },
        queryParams: {
            'record_id': record_id
        }
    }
    await apigClient.timesheetdaoPost(params, body, additionalParams)
        .then(function (response) {
            console.log(response.data)
            var dataResult = response.data
            console.log(jQuery.isEmptyObject(dataResult).toString())
            console.log(JSON.stringify(dataResult))
        }).catch(function (error) {
            console.log(error)
        })
}

async function updateRecordStatus(record_id, status) {
    var params = {
        'record_id': record_id
    }
    var body =
    {
        "operation": "update",
        "payload": {
            "TableName": "TimeSheet",
            "Key": {
                "record_id": record_id
            },
            "UpdateExpression": "set rd_status =:s",
            "ExpressionAttributeValues": {
                ":s": status
            },
            "ReturnValues": "ALL_NEW"
        }
    }

    var additionalParams = {
        headers: {

        },
        queryParams: {
            'record_id': record_id
        }
    }
    await apigClient.timesheetdaoPost(params, body, additionalParams)
        .then(function (response) {
            console.log(response.data)
            var dataResult = response.data
            console.log(jQuery.isEmptyObject(dataResult).toString())
            console.log(JSON.stringify(dataResult))
        }).catch(function (error) {
            console.log(error)
        })
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

async function getPendingRecords() {
    var email = getUserEmail();
    //var email = "123456"

    var params = {
        "emailid": email
    }
    var body =
    {
        "operation": "list",
        "payload": {
            "TableName": "TimeSheet",
            "FilterExpression": "emailid = :r and rd_status =:s",
            "ExpressionAttributeValues": {
                ":r": email,
                ":s": "pending"
            }
        }
    }

    var additionalParams = {
        headers: {

        },
        queryParams: {
            "emailid": email
        }
    }
    await apigClient.timesheetdaoPost(params, body, additionalParams)
        .then(function (response) {
            console.log(response.data)
            var dataResult = response.data
            console.log(jQuery.isEmptyObject(dataResult).toString())
            console.log(JSON.stringify(dataResult))
            printTables(dataResult)
        }).catch(function (error) {
            console.log(error)
        })
}

async function getEmployeeRecordsWithStatus(email, status) {

    var params = {
        "emailid": email
    }
    var body =
    {
        "operation": "list",
        "payload": {
            "TableName": "TimeSheet",
            "FilterExpression": "emailid = :r and rd_status =:s",
            "ExpressionAttributeValues": {
                ":r": email,
                ":s": status
            }
        }
    }

    var additionalParams = {
        headers: {

        },
        queryParams: {
            "emailid": email
        }
    }
    await apigClient.timesheetdaoPost(params, body, additionalParams)
        .then(function (response) {
            console.log(response.data)
            var dataResult = response.data
            console.log(jQuery.isEmptyObject(dataResult).toString())
            console.log(JSON.stringify(dataResult))
            if (status === 'pending') {
                printManageTimesheet(dataResult)
            } else {
                printTables(dataResult)
            }
            
        }).catch(function (error) {
            console.log(error)
        })
}

async function getApprovedRecords() {
    var email = getUserEmail();
    //var email = "123456"

    var params = {
        "emailid": email
    }
    var body =
    {
        "operation": "list",
        "payload": {
            "TableName": "TimeSheet",
            "FilterExpression": "emailid = :r and rd_status =:s",
            "ExpressionAttributeValues": {
                ":r": email,
                ":s": "approved"
            }
        }
    }

    var additionalParams = {
        headers: {

        },
        queryParams: {
            "emailid": email
        }
    }
    await apigClient.timesheetdaoPost(params, body, additionalParams)
        .then(function (response) {
            console.log(response.data)
            var dataResult = response.data
            console.log(jQuery.isEmptyObject(dataResult).toString())
            console.log(JSON.stringify(dataResult))
            printTables(dataResult)
        }).catch(function (error) {
            console.log(error)
        })
}

async function getDeclinedRecords() {
    var email = getUserEmail();
    //var email = "123456"

    var params = {
        "emailid": email
    }
    var body =
    {
        "operation": "list",
        "payload": {
            "TableName": "TimeSheet",
            "FilterExpression": "emailid = :r and rd_status =:s",
            "ExpressionAttributeValues": {
                ":r": email,
                ":s": "declined"
            }
        }
    }

    var additionalParams = {
        headers: {

        },
        queryParams: {
            "emailid": email
        }
    }
    await apigClient.timesheetdaoPost(params, body, additionalParams)
        .then(function (response) {
            console.log(response.data)
            var dataResult = response.data
            console.log(jQuery.isEmptyObject(dataResult).toString())
            console.log(JSON.stringify(dataResult))
            printTables(dataResult)
        }).catch(function (error) {
            console.log(error)
        })
}

function printManageTimesheet(data) {
    var tables = $('#show_records')
    tables.html('');
    data.Items.forEach(function (item, i) {
        console.log(item);
        let li = document.createElement('li');
        let span = document.createElement('span');
        span.innerHTML = `
        <div>
            <b>Record ID </b> <i>${item.record_id}</i> </br>
            <button type="button" class="btn btn-success btn-sm" onclick="window.location.href='https://d28torhgmcngv.cloudfront.net/timesheetAction.html?record_id=${item.record_id}&action=approved'">Approve</button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="window.location.href='https://d28torhgmcngv.cloudfront.net/timesheetAction.html?record_id=${item.record_id}&action=declined'">Decline</button>
        </div>
        <table border="1">
            <tr>
                <td>
                    Date
                </td>
                <td>
                    Start
                </td>
                <td>
                    End
                </td>
                <td>
                    Hours
                </td>
            </tr>
            <tr>
                <td>
                    <p>${item.record_hr.day_1.date}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_1.start}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_1.end}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_1.total}</p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>${item.record_hr.day_2.date}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_2.start}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_2.end}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_2.total}</p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>${item.record_hr.day_3.date}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_3.start}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_3.end}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_3.total}</p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>${item.record_hr.day_4.date}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_4.start}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_4.end}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_4.total}</p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>${item.record_hr.day_5.date}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_5.start}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_5.end}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_5.total}</p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>${item.record_hr.day_6.date}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_6.start}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_6.end}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_6.total}</p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>${item.record_hr.day_7.date}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_7.start}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_7.end}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_7.total}</p>
                </td>
            </tr>
        </table>`;
        li.appendChild(span);
        tables.append(li);
    })
}

function printTables(data) {
    var tables = $('#show_records')
    tables.html('');
    data.Items.forEach(function (item, i) {
        console.log(item);
        let li = document.createElement('li');
        let span = document.createElement('span');
        span.innerHTML = `
        <b>Record ID </b> <i>${item.record_id}</i> </br>
        <table border="1">
            <tr>
                <td>
                    Date
                </td>
                <td>
                    Start
                </td>
                <td>
                    End
                </td>
                <td>
                    Hours
                </td>
            </tr>
            <tr>
                <td>
                    <p>${item.record_hr.day_1.date}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_1.start}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_1.end}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_1.total}</p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>${item.record_hr.day_2.date}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_2.start}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_2.end}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_2.total}</p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>${item.record_hr.day_3.date}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_3.start}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_3.end}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_3.total}</p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>${item.record_hr.day_4.date}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_4.start}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_4.end}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_4.total}</p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>${item.record_hr.day_5.date}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_5.start}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_5.end}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_5.total}</p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>${item.record_hr.day_6.date}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_6.start}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_6.end}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_6.total}</p>
                </td>
            </tr>
            <tr>
                <td>
                    <p>${item.record_hr.day_7.date}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_7.start}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_7.end}</p>
                </td>
                <td>
                    <p>${item.record_hr.day_7.total}</p>
                </td>
            </tr>
        </table>`;
        li.appendChild(span);
        tables.append(li);
    })
}

