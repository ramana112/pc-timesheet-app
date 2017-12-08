   var container = document.getElementById('container1');
    var btn = document.getElementById("time_but"); 
    var cross = document.getElementById("close");

    btn.onclick=function() {
        container.style.display = "block";
    }
    cross.onclick = function() {
        container.style.display = "none";
    }
    window.onclick = function(event) {
    if (event.target == container) {
        container.style.display = "none";
    }
}