let weatherstack ="https://www.meteosource.com/api/v1/free/point?sections=all&key=dp5w52ryu1pqg5bc2g3gga7zft06jz376h9gh0a4&place_id="
var data="a";
let request1 = new XMLHttpRequest();
request1.open("get","https://www.meteosource.com/api/v1/free/point?sections=all&key=dp5w52ryu1pqg5bc2g3gga7zft06jz376h9gh0a4&place_id=cairo")
request1.send();
request1.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
        // JSON.parse(request1.responseText).current
        request1.open("test.js")
    }
}
