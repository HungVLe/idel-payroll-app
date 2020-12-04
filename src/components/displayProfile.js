async function displayProfile() {
    checkLogin(false, true);
    var email = getUserEmail();
    document.getElementById("email").value = email;
    var dataResult = getUserProfile();
    var profile_data = JSON.parse(dataResult);
    console.log(profile_data)
    document.getElementById("firstname").value = profile_data.Item.firstname;
    document.getElementById("lastname").value = profile_data.Item.lastname;
    document.getElementById("street").value = profile_data.Item.streetaddress;
    document.getElementById("city").value = profile_data.Item.city;
    document.getElementById("state").value = profile_data.Item.state_province;
    document.getElementById("zip").value = profile_data.Item.zip;
}