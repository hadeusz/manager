function doFirst(){
   
    mydiv= document.getElementById('mydiv');
    mydiv.addEventListener("dragstart", startDrag, false);
    mydiv.addEventListener("dragend", endDrag, false);

    thebox = document.getElementById('thebox');
    thebox.addEventListener("dragenter", dragenter, false);
    thebox.addEventListener("dragleave", dragleave, false);
    thebox.addEventListener("dragover", function(e){e.preventDefault();}, false);
    thebox.addEventListener("drop", dropped, false);
}

function startDrag(e){
    e.dataTransfer.setData('Text', 'dupa');
}

function endDrag(e){
    filterdiv = e.target;
    filterdiv.style.visibility = 'hidden';
    thebox.innerHTML = generatePlayersList(filterdiv);
}

function dragenter(e){
    thebox.style.background = "SkyBlue";
    thebox.style.border = "3px solid green";
}

function dragleave(e){
    e.preventDefault();
    thebox.style.background = "White";
    thebox.style.border = "3px solid blue";
}

function dropped(e){
    e.preventDefault();
    thebox.innerHTML = e.dataTransfer.getData('Text');
}


function generatePlayersList(filterdiv){
    var criteriaName = filterdiv.attributes.name.nodeValue;
    //update in sessionstorage
    updateSearchedCriteriaValue(criteriaName);
    //here should query about players based on criterias from sessionstorage
    return criteriaName;
}

function updateSearchedCriteriaValue(criteriaName){
   //https://stackoverflow.com/questions/7196212/how-to-create-dictionary-and-add-key-value-pairs-dynamically

    //todo take it from session storage
    var searchCriteria = {};

    switch(criteriaName){
        case "agecriteria":
            searchCriteria["agecriteria"] = fetchAgeCriteria();
            break;
    }

    debugger
    fire_ajax_submit(criteriaName);

    return criteriaName;
}

function fetchAgeCriteria(){
    var ageCriterias = {};
    ageCriterias["from"] = 32;
    ageCriterias["to"] = 34;
    return ageCriterias;
}


function fire_ajax_submit(criteriaName) {

    var search = {}
    search["username"] = criteriaName;

    $("#btn-search").prop("disabled", true);

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/api/search",
        data: JSON.stringify(search),
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (data) {

            var json = "<h4>Ajax Response</h4><pre>"
                + JSON.stringify(data, null, 4) + "</pre>";
            $('#feedback').html(json);

            console.log("SUCCESS : ", data);
            $("#btn-search").prop("disabled", false);

        },
        error: function (e) {

            var json = "<h4>Ajax Response</h4><pre>"
                + e.responseText + "</pre>";
            $('#feedback').html(json);

            console.log("ERROR : ", e);
            $("#btn-search").prop("disabled", false);

        }
    });

}

window.addEventListener("load", doFirst, false);