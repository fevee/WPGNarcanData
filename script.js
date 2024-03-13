/******w**************
    
    Assignment 4 Stylesheet
    Name: Faye Vaquiar
    Date: March 10, 2024
    Description: 

*********************/
let currentPage = 1;
const resultsPerPage = 50;

function displayResults() {
    // Clear previous results
    document.getElementById("output").innerHTML = "";
    document.getElementById("numberOfResults").innerText = "";

    // Get search criteria
    var age = document.getElementById("age").value;
    var gender = document.getElementById("gender").value;
    var neighborhood = document.getElementById("neighborhood").value;
    var year = document.getElementById("year").value; // Get year input
    var orderBy = document.getElementById("orderBy").value;
    var orderDirectionRadios = document.getElementsByName('orderDirection');
    var orderDirection = '';
    if (orderDirectionRadios[0].checked) {
        orderDirection = orderDirectionRadios[0].value;
    } else if (orderDirectionRadios[1].checked) {
        orderDirection = orderDirectionRadios[1].value;
}

    // Calculate offset for fetching results to paginate data
    var offset = (currentPage - 1) * resultsPerPage;

    // API query URL
    var apiUrl = "https://data.winnipeg.ca/resource/qd6b-q49i.json?$limit=" + resultsPerPage + "&$offset=" + offset;

    // Where clause to filter by year
    if (year !== "") {
        var startOfYear = year + "-01-01T00:00:00.000";
        var endOfYear = year + "-12-31T23:59:59.999";
        apiUrl += "&$where=dispatch_date between '" + startOfYear + "' and '" + endOfYear + "'";
    }

    if (age !== "") {
        apiUrl += "&age=" + age;
    }
    if (gender !== "") {
        apiUrl += "&gender=" + gender;
    }
    if (neighborhood !== "") {
        apiUrl += "&neighbourhood=" + neighborhood;
    }
    if (orderBy !== "") {
        apiUrl += "&$order=" + orderBy;
    }
    if (orderDirection !== "") {
        apiUrl += orderDirection;
    }

    // Fetch data from the API
    fetch(apiUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            // Display the search results
            data.forEach(function(record) {
                var row = "<tr>";
                row += "<td>" + record.incident_number + "</td>";
                row += "<td>" + formatDispatchDate(record.dispatch_date) + "</td>"; // Format the dispatch date
                row += "<td>" + record.age + "</td>";
                row += "<td>" + record.gender + "</td>";
                row += "<td>" + record.narcan_administrations + "</td>";
                row += "<td>" + record.neighbourhood + "</td>";
                row += "</tr>";
                document.getElementById("output").innerHTML += row;
            });

            // Display the number of results
            if (data.length == 0) {
                document.getElementById("numberOfResults").innerText = "No results found."
            } else {
                var startRange = (currentPage - 1) * resultsPerPage + 1;
                var endRange = Math.min(currentPage * resultsPerPage, startRange + data.length - 1);
                document.getElementById("numberOfResults").innerText = "Results " + startRange + "-" + endRange;
            }

            // Show/hide pagination buttons based on the current page and data length
            if (currentPage > 1) {
                document.getElementById("prevPageBtn").style.display = "block";
            } else {
                document.getElementById("prevPageBtn").style.display = "none";
            }

            if (data.length === resultsPerPage) {
                document.getElementById("nextPageBtn").style.display = "block";
            } else {
                document.getElementById("nextPageBtn").style.display = "none";
            }
        })
        .catch(function(error) {
            console.log("Error fetching data: ", error);
        });
}

function nextPage() {
    currentPage++;
    displayResults();
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayResults();
    }
}

function clearResults() {
    // Clear search criteria inputs
    document.getElementById("age").value = "";
    document.getElementById("gender").value = "";
    document.getElementById("neighborhood").value = "";
    document.getElementById("year").value = "";
    document.getElementById("orderBy").value = "";
    

    // Clear previous results and count
    console.log("Clearing table..."); // Check if this part executes
    document.getElementById("output").innerHTML = "";
    document.getElementById("numberOfResults").innerText = "";

    currentPage = 1;
    document.getElementById("nextPageBtn").style.display = "none";
    document.getElementById("prevPageBtn").style.display = "none";
    orderDirectionDiv.style.display = "none";
}

function formatDispatchDate(dateString) {
    // Create a new Date object from the dateString
    var date = new Date(dateString);

    // Format the date using toLocaleDateString with military time
    var formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });
    return formattedDate;


}
