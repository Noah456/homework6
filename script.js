var APIKey = "af2c9b7257d733b1e6e74b86a1089f7a";
var local = "new+york"
var link = "https://api.openweathermap.org/data/2.5/weather?q=" + local +"&appid=" + APIKey;
var localArray = ["Montreal", "New York", "Miami"];




function localStorageFunc1(){


    var string1 = localStorage.getItem("local");
    console.log(string1);

    if(string1 == null){

        localStorage.setItem("local", localArray);

    }else{

        var array2 = string1.split(",");
        localArray = array2;
        
    }
}
localStorageFunc1();

function localStorageFunc2(){

    localStorage.setItem("local", localArray);

}

function asideTable(){

    var table = document.getElementById("tableAside");
    table.innerHTML = "";

    for(i = 0; i < localArray.length; i++){

        var data = localArray[i].replace(" ", "+");

        var tr = document.createElement("tr");
        tr.setAttribute("class", "roll");

        var th = document.createElement("th");
        th.setAttribute("class", "col");
        th.setAttribute("data-value", data);
        th.innerHTML = localArray[i];

        tr.append(th);
        table.append(tr);

        console.log(th)
        console.log(tr);


    }

}

asideTable();

var div = $("<div>").attr("id", "weatherDiv");

function weather(){

    $.ajax({
        url: link,
        method: "GET",
    }).then(function(response){
    

        div.empty();
        
        var uvLink = "http://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey +"&lat=" + response.coord.lat + "&lon=" + response.coord.lon +"";
        $.ajax({
            url: uvLink,
            method: "GET"
        }).then(function(index){

            console.log(response);
            var iconcode = response.weather[0].icon;
            var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";

            var innerText = "<h2 id='weatherDivTitle'><spam id='cityName'>"+ response.name + "</span><spam id='date'>" + new Date().toLocaleDateString() +"</spam><img src='" + iconurl + "'></h2><ul><li>temp:<spam id='temp'>" + response.main.temp + "</spam></li><li>humi:<span id='humi'>" + response.main.humidity + "</span></li><li>wind speed:<spam id='wind'>" + response.wind.speed + "</spam></li><li id='uvLi'>UV index:<div id='uvIndex'>" + index.value + "<div></ul>"
            div.html(innerText);
            $("#weatherMain").append(div);
            
            var indexNumber = parseInt(index.value);
            var liColor = document.getElementById("uvIndex");

            if  (indexNumber <= 3.3){
                
                liColor.setAttribute("class", "alert alert-success");
            }
            else if(indexNumber < 6.6){
                liColor.setAttribute("class", "alert alert-warning");
            }
            else if(indexNumber < 10){
                liColor.setAttribute("class", "alert alert-danger");
            }
            else if(indexNumber >= 10){
                liColor.setAttribute("class", "alert alert-danger");
            }

        })
        
    })

    var weekLink = "https://api.openweathermap.org/data/2.5/forecast?q=" + local + "&appid=" + APIKey + "";
    console.log(weekLink);

    $.ajax({
        url: weekLink,
        method: "GET"
    }).then(function(response){

        document.getElementById("weekTable").innerHTML = "";

       console.log(response);

       var count = 3;
       var tr = document.createElement("tr");
       tr.setAttribute("class", "weekTr");

       for(i = 0; i < 5; i++){

            
            var iconcode = response.list[count].weather[0].icon
            var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
            var fullDate = new Date(response.list[count].dt_txt);
            console.log(fullDate);
            var date = fullDate.toLocaleDateString();
            console.log(date);
            var th = document.createElement("th"); 
            var innerText = "<div class='div1'><ul><li><h4 class='weekH3'>" + date  + "</h4><li><img src='" + iconurl + "'></li><li class='weekLi'>Temp: " + response.list[count].main.temp + "</li><li class='weekHumi'>Humidity:" + response.list[count].main.humidity + "</li></ul></div>"; 
            th.innerHTML = innerText;
            tr.append(th);   
            count = count + 8;

       }

       document.getElementById("weekTable").append(tr);

    })

}

weather();

function aside(){

    console.log(this.getAttribute("data-value"));
    local = this.getAttribute("data-value");
    link = "https://api.openweathermap.org/data/2.5/weather?q=" + local +"&appid=" + APIKey;

    weather();

}


function addEventFunc(){
   
    var col = document.getElementsByClassName("col");

    for(i = 0; i < col.length; i++){

        col[i].addEventListener("click", aside);

    }

}
addEventFunc();
//search

var searchBtn = document.getElementById("searchSubmit");

searchBtn.addEventListener("click", function(e){

    e.preventDefault();

    var searchValue = document.getElementById("searchInput").value;

    local = searchValue.replace(" ", "+");
    link = "https://api.openweathermap.org/data/2.5/weather?q=" + local +"&appid=" + APIKey;

    $.ajax({
        url: link,
        method: "GET",
        success: function(response){
            
            if(localArray.indexOf(local) === -1){
                
                localArray.push(searchValue);
                asideTable();
                addEventFunc();
                localStorageFunc2();

            }
            
        },
        error: function(){
            console.log("error");
        }
    });




})
