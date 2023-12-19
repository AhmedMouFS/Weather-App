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

let showErrors = document.querySelector(".errors")

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
            },7000)
        }
    }
}

function addElements(){
    for(let i=1; i < 7; i++){
        let dailyResponsive = document.createElement("div")
        dailyResponsive.classList.add("col-lg-2","col-md-4","col-sm-6","mb-2","mb-lg-0")
        let popupSummary = document.createElement("div")
        let daily = `<div id="day${i}" class="d-flex flex-column text-white py-2 rounded-1 fw-bold align-items-center" style="background-color:#0000005e">
                            <h3 class="text-center w-100 fs-5" id="date"></h3>
                            <p id="to-temp"></p>
                            <img src="" alt="" id="img">
                            <p id="to-weather"></p>
                            <p id="to-min-temp"></p>
                            <p id="to-max-temp"></p>
                            <button type="button" class="btn btn-primary btn-sm mt-2 text-capitalize fw-bold bg-dark border-0" data-bs-toggle="modal" data-bs-target="#staticBackdrop${i}" id="show_summary">
                             summary
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
}
addElements()

// temp_summary
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
            loading.style.display = "none"
            if(cityInput.value !== ""){
                window.localStorage.setItem("city",cityInput.value)
            }
            cityInput.value = ""
            
            let requestToObject = JSON.parse(request.responseText)
            
            let lat = requestToObject.lat
            let lon = requestToObject.lon

            let request_coordinates = new XMLHttpRequest();
            request_coordinates.open("get",reginName+`lat=${lat}&lon=${lon}`)
            request_coordinates.send();
            request_coordinates.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 200){
                    let request_coordinatesToObj = JSON.parse(request_coordinates.responseText)
                    city.firstChild.textContent = request_coordinatesToObj.name
                    city.lastChild.textContent = request_coordinatesToObj.country
                    let DateIndex = new Date(requestToObject.daily.data[0].day)
                    let DateArraySplite = DateIndex.toString().split(" ")
                    date.textContent = DateArraySplite[2] + " " + DateArraySplite[1] + " " +DateArraySplite[0]
                    imgsrc.src = "images/weather_icons/set01/small/"+`${requestToObject.current.icon_num}.png`
                    temp.firstChild.innerHTML = `${requestToObject.current.temperature} <sup>°C</sup>`
                    temp.lastChild.textContent = requestToObject.current.summary
                    windspeed.textContent ="Speed " + requestToObject.current.wind.speed + " m/s"
                    windangle.innerHTML = "Angle " + requestToObject.current.wind.angle + `<sup>°</sup>` + requestToObject.current.wind.dir
                
                    let daysArray = requestToObject.daily.data
                    for(let i=1; i < daysArray.length; i++){
                        let cityInSummary = document.querySelectorAll("#staticBackdropLabel")
                        let summaryInfo = document.querySelectorAll("#summary")
                        let otherDaysDates = document.querySelectorAll("#date")
                        if(i == 1){
                            otherDaysDates[i-1].textContent = "tommorow"
                            cityInSummary[i-1].textContent = `Tomorrow's weather forecast for the city ${request_coordinatesToObj.name}`
                        }else{
                            let secondDay = new Date(requestToObject.daily.data[i].day).toString().split(" ")
                            otherDaysDates[i-1].textContent = secondDay[0]
                            cityInSummary[i-1].textContent = `${secondDay[0]} weather forecast for the city ${request_coordinatesToObj.name}`
                        }
                        summaryInfo[i-1].textContent = requestToObject.daily.data[i].summary
                        
                        let otherDaysP = document.querySelectorAll("#to-temp")
                        let otherDaysImg = document.querySelectorAll("#img")
                        let otherDaysWeather = document.querySelectorAll("#to-weather")
                        let otherDaysMinTemp = document.querySelectorAll("#to-min-temp")
                        let otherDaysMaxTemp = document.querySelectorAll("#to-max-temp") 
                        otherDaysP[i-1].innerHTML = Math.round(requestToObject.daily.data[i].all_day.temperature) + `<sup>°</sup>` +"/"+ Math.round(requestToObject.daily.data[i].all_day.temperature_max)+`<sup>°</sup>`
                        otherDaysImg[i-1].src ="images/weather_icons/set01/small/" + `${requestToObject.daily.data[i].icon}.png`
                        otherDaysWeather[i-1].textContent = requestToObject.daily.data[i].all_day.weather.split("_").join(" ")
                        otherDaysMinTemp[i-1].innerHTML = "Min temp " + Math.round(requestToObject.daily.data[i].all_day.temperature_min) + `<sup>°</sup>`
                        otherDaysMaxTemp[i-1].innerHTML = "Max temp " + Math.round(requestToObject.daily.data[i].all_day.temperature_max) + `<sup>°</sup>`
                        
                    }
                }
            }
        }else if(this.readyState == 4 && this.status == 400){
                loading.innerHTML = `<div class="alert alert-danger fs-6 fw-medium position-absolute top-50 start-50 translate-middle" role="alert">
                            City Name is Incorrect
                        </div>`
                        setTimeout(() => {
                        loading.style.display = "none"
                        cityInput.value =""         
                        }, 3000);     
        }
    }
}


// check input field and then get data
function CHECK_INPUT_SET_GET_DATA(){
    if(cityInput.value != ""){
        if(cityInput.value.length >= 3 ){
            GET_TEMP_SUMMARY(weatherstack,cityInput.value)
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
    GET_TEMP_SUMMARY(weatherstack,searchValue)
}

reload.addEventListener("click",LOAD_FROM_LOCALSTORAGE)

window.onload = LOAD_FROM_LOCALSTORAGE


// function NAME_OF_REGION_GOVERNORATE(RG_URL,coordinates){
//     let request = new XMLHttpRequest();
//     request.open("get",RG_URL+coordinates)
//     request.send()
//     request.onreadystatechange = function(){
//         if(this.readyState == 4 && this.status == 200){
//             let REGION_NAME = JSON.parse(this.responseText)
//             console.log(REGION_NAME)
//             city.firstChild.textContent = REGION_NAME.adm_area1
//             city.lastChild.textContent = REGION_NAME.name

//             GET_TEMP_SUMMARY(weatherstack,REGION_NAME.place_id)
//         }
//     }

// }


// // window.onload =  
// navigator.geolocation.getCurrentPosition(function(e){
//     let Coordinates = `lat=${e.coords.latitude}&lon=${e.coords.longitude}`
//     // window.localStorage.setItem("value",Coordinates)
//     // NAME_OF_REGION_GOVERNORATE(reginName,Coordinates)
//     console.log(Coordinates)
// },function(error){
//     return error.message
// })



// // setInterval(function(){
// //    console.log("ahmed")
// // },5)





