// Set Variables
let appBackground = document.getElementById("app")

let city = document.querySelector(".city-name h3")

let date = document.querySelector(".city-name span")

let citybtn=document.getElementById("citybtn")

let imgsrc =document.querySelector(".app-temp img")

let windspeed = document.querySelector("#w-speed")

let windangle = document.querySelector("#w-angle")

let temp = document.querySelector(".app-temp p")

let allContent = document.querySelector(".all-content")

let tomorrowDiv = document.getElementById("tomorrow")

let modelDiv = document.createElement("div")

let reload = document.getElementById("reload")

let cityInput = document.getElementById("cityid")

let loading = document.getElementById("loading")

let showErrors = document.querySelector(".errors")

let loading_spinner = document.getElementById("loading-spinner")

let detectLocaion = document.getElementById("detectlocaion")

let hourlySection = document.getElementById("hourly")

function errors(massage){
    let funInterval = setInterval(show,1)
    let opa = 0
    function show(){
        if(opa >= 1){
            clearInterval(funInterval)
        }else{
            opa += 0.1
            showErrors.style.opacity = opa
            showErrors.innerHTML = massage
            setTimeout(function(){
                showErrors.style.opacity = "0"
            },5000)
        }
    }
}

function addElements(){
    for(let i=1; i < 7; i++){
        let dailyResponsive = document.createElement("div")
        dailyResponsive.classList.add("col-lg-2","col-md-4","col-sm-6","mb-2")
        let popupSummary = document.createElement("div")
        let daily = `<div id="day${i}" class="d-flex flex-column text-white py-2 rounded-1 fw-bold align-items-center" style="background-color:#0000005e">
                            <h3 class="text-center w-100 fs-5" id="date"></h3>
                            <p id="to-temp"></p>
                            <img src="" alt="" id="img">
                            <p id="to-weather"></p>
                            <p id="to-min-temp"></p>
                            <p id="to-max-temp"></p>
                            <button type="button" class="btn btn-primary btn-sm mt-2 text-capitalize fw-bold bg-dark border-0" data-bs-toggle="modal" data-bs-target="#staticBackdrop${i}" id="show_summary">
                                Forecast
                            </button>
                    </div>` 
                    
                    let model = `<div class="modal fade" id="staticBackdrop${i}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-top">
                    <div class="modal-content bg-dark text-white">
                        <div class="modal-header">
                        <h1 class="modal-title fs-6 fw-5" id="staticBackdropLabel"></h1>
                        <button type="button" class="btn-close bg-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body" id="summary">
            
                        </div>
                    </div>
                    </div>
                </div>` 
        popupSummary.innerHTML = model
        dailyResponsive.innerHTML += daily
        dailyResponsive.append(popupSummary)
        appBackground.append(dailyResponsive)
    }

    for(let h=0; h <= 11; h++){
        let hourly = document.createElement("div")
        hourly.classList.add("d-flex","justify-content-between")
        hourlySection.classList.add("mb-2","p-2","text-white","fw-bold","rounded-1","text-center")
        hourlySection.style.backgroundColor = "#0000005e"
        let hour = ` 
                    <p id="time" class="col-3"></p>
                    <div class="col-3"><img src="" id="image" height="25"></div>
                    <p class="col-3" id="h-weather"></p>
                    <p id="h-temp" class="col-3"></p>
                   `
        hourly.innerHTML = hour
        hourlySection.append(hourly)
    }

}
addElements()



// temp_summary
let find_any_place = "https://www.meteosource.com/api/v1/free/find_places_prefix?key=4u91kpim701bf7gitwqn9p2e3ppg9x39868ek644&text="
let weatherstack ="https://www.meteosource.com/api/v1/free/point?sections=all&timezone=auto&language=en&units=metric&key=4u91kpim701bf7gitwqn9p2e3ppg9x39868ek644&place_id="
let reginName = "https://www.meteosource.com/api/v1/free/nearest_place?key=4u91kpim701bf7gitwqn9p2e3ppg9x39868ek644&"


function GET_TEMP_SUMMARY(URL_ARG,value){
    let loading = document.getElementById("loading")
    loading.style.display = "block"
    let request = new XMLHttpRequest();
    request.open("get",URL_ARG+value)
    request.send();
    request.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){   
            let requestToObject = JSON.parse(request.responseText)

            if(URL_ARG.indexOf("find_places_prefix") !== -1){   

            if(requestToObject.length !== 0){
                let requestToObjectFirstCity = requestToObject[0]
                let cityName = requestToObjectFirstCity.name.toLowerCase()
                let vSlice = value.toLowerCase().slice(0,3)

                if(cityName.includes(vSlice)){
                    window.localStorage.setItem("city",value)
                    let place_id = requestToObjectFirstCity.place_id
                    createRequset(weatherstack,place_id,requestToObjectFirstCity)
                    cityInput.value = ""
                }else{
                    loading.style.display = "none"
                    errors("city is invalid")
                    console.log(cityName)
                    console.log(vSlice)
                }
               }else{
                loading.style.display = "none"
                errors("city is invalid")
               }
   
            }else{
                let place_id = requestToObject.place_id
                createRequset(weatherstack,place_id,requestToObject)
            }
            
            function createRequset(secondURL,value,assign){
                request.open("get",secondURL + value)
                request.send();
                request.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 200){
                    loading.style.display = "none"
                    let secondRequset = JSON.parse(request.responseText)
                    let objectAllData = Object.assign(assign,secondRequset)
                    city.firstChild.textContent = objectAllData.name
                    city.lastChild.textContent = objectAllData.country
                    let DateIndex = new Date(objectAllData.daily.data[0].day)
                    let DateArraySplite = DateIndex.toString().split(" ")
                    date.textContent = DateArraySplite[2] + " " + DateArraySplite[1] + " " +DateArraySplite[0]
                    imgsrc.src = "images/weather_icons/set01/small/"+`${objectAllData.current.icon_num}.png`
                    temp.firstChild.innerHTML = `${objectAllData.current.temperature} <sup>°C</sup>`
                    temp.lastChild.textContent = objectAllData.current.summary
                    windspeed.textContent ="Speed " + objectAllData.current.wind.speed + " m/s"
                    windangle.innerHTML = "Angle " + objectAllData.current.wind.angle + `<sup>°</sup>` + objectAllData.current.wind.dir
                    let daysArray = objectAllData.daily.data

                    for(let i=1; i < daysArray.length; i++){
                        let cityInSummary = document.querySelectorAll("#staticBackdropLabel")
                        let summaryInfo = document.querySelectorAll("#summary")
                        let otherDaysDates = document.querySelectorAll("#date")
                        if(i == 1){
                            otherDaysDates[i-1].textContent = "tommorow"
                            cityInSummary[i-1].textContent = `Tomorrow's weather forecast for the city ${objectAllData.name}`
                        }else{
                            let secondDay = new Date(objectAllData.daily.data[i].day).toString().split(" ")
                            otherDaysDates[i-1].textContent = secondDay[0]
                            cityInSummary[i-1].textContent = `${secondDay[0]} weather forecast for the city ${objectAllData.name}`
                        }
                        summaryInfo[i-1].textContent = objectAllData.daily.data[i].summary
                        
                        let otherDaysP = document.querySelectorAll("#to-temp")
                        let otherDaysImg = document.querySelectorAll("#img")
                        let otherDaysWeather = document.querySelectorAll("#to-weather")
                        let otherDaysMinTemp = document.querySelectorAll("#to-min-temp")
                        let otherDaysMaxTemp = document.querySelectorAll("#to-max-temp") 
                        otherDaysP[i-1].innerHTML = Math.round(objectAllData.daily.data[i].all_day.temperature) + `<sup>°</sup>` +"/"+ Math.round(objectAllData.daily.data[i].all_day.temperature_max)+`<sup>°</sup>`
                        otherDaysImg[i-1].src ="images/weather_icons/set01/small/" + `${objectAllData.daily.data[i].icon}.png`
                        otherDaysWeather[i-1].textContent = objectAllData.daily.data[i].all_day.weather.split("_").join(" ")
                        otherDaysMinTemp[i-1].innerHTML = "Min temp " + Math.round(objectAllData.daily.data[i].all_day.temperature_min) + `<sup>°</sup>`
                        otherDaysMaxTemp[i-1].innerHTML = "Max temp " + Math.round(objectAllData.daily.data[i].all_day.temperature_max) + `<sup>°</sup>`
                        

                    }
                    let temp_hourly = objectAllData.hourly.data
                    for(let h=0; h<=11; h++){
                        let time = document.querySelectorAll("#time");
                        let image = document.querySelectorAll("#image");
                        let temp = document.querySelectorAll("#h-temp");
                        let weather = document.querySelectorAll("#h-weather")
                        if(h == 0){
                            time[h].textContent = "now"
                        }else{
                            let x = new Date(temp_hourly[h].date)
                            let hour = x.getHours().toString()
                            if(hour.length == 2){
                                time[h].textContent = x.getHours() + ":" + x.getSeconds() + "0"
                            }else{
                                
                                time[h].textContent = "0" + x.getHours() + ":" + x.getSeconds() + "0"
                            }
                            
                        }
                        image[h].src = "images/weather_icons/set01/small/" + `${temp_hourly[h].icon}.png`
                        weather[h].textContent = temp_hourly[h].summary
                        temp[h].innerHTML = temp_hourly[h].temperature + `<sup>°c</sup>`
                    }
            }
        }
    } 
    }else if(this.readyState == 4 && this.status == 400){
            loading.style.display = "none"
            errors("city is invalid")
    }
    } 
    }      



// check input field and then get data
function CHECK_INPUT_SET_GET_DATA(){
    let cityValue = cityInput.value.trim()
    console.group(cityValue)
    if(cityValue != ""){
        if(cityValue.length >= 3 ){
            GET_TEMP_SUMMARY(find_any_place,cityValue)
        }else{
            errors("City Name must More Than or Eqal 3 letter")
        }
    }else{
        errors("city Name Cant Be Empty")
    }
}

citybtn.addEventListener("click",CHECK_INPUT_SET_GET_DATA)


// When Press on Refresh button Function will Get Data from Local Storage
function LOAD_FROM_LOCALSTORAGE(){
    let searchValue = window.localStorage.getItem("city")
    GET_TEMP_SUMMARY(find_any_place,searchValue)
}

reload.addEventListener("click",LOAD_FROM_LOCALSTORAGE)


function detectCurentLocaion(success,error){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(success,error)
    }
}


function success(e){
    let Coordinates = `lat=${e.coords.latitude}&lon=${e.coords.longitude}`
    GET_TEMP_SUMMARY(reginName,Coordinates)
}

function error(){
    loading.style.display = "block"
    loading_spinner.remove()
    showErrors.innerHTML = "Reload Page And Allow Location Permission To display Information"
    showErrors.style.opacity = "1"
    showErrors.style.top = "50%"
    showErrors.style.left = "50%"
    showErrors.style.transform = "translate(-50%,-50%)"
    showErrors.style.border = "none"
    showErrors.style.borderRadius = "0"
    showErrors.style.padding = "20px"
    loading.append(showErrors)
    
}

window.addEventListener("load",detectCurentLocaion.bind(null,success,error))
detectLocaion.addEventListener("click",detectCurentLocaion.bind(null,success,error))

