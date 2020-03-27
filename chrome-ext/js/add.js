const GROUP_TEMP = /^(\d{1,2}|\d{1,2}[a-zA-Zа-яА-Я]{0,2}|\d[a-zA-Zа-яА-Я]{0,3})$/gm;

$(document).ready(function(){
    $(".add-screen").fadeIn("slow");
    $("#submit-btn").attr("disabled", true);
    populateGroups($("#faculty").children("option:selected").val(), $("#year").children("option:selected").val(), $("#degree").children("option:selected").val());


    $("#faculty").change(function(){

        populateGroups($("#faculty").children("option:selected").val(), $("#year").children("option:selected").val(), $("#degree").children("option:selected").val());
    });
    $("#year").change(function(){

        populateGroups($("#faculty").children("option:selected").val(), $("#year").children("option:selected").val(), $("#degree").children("option:selected").val());
    });
    $("#group").on('input', function(){
        // console.log($(this).val());
        if($(this).val()){
            
            $("#submit-btn").attr("disabled", false).css('color', '#138F34');
            // console.log("enabled");
            
        }else{
            // console.log("disasbled");
            
            $("#submit-btn").attr("disabled", true).css('color', '#bababa');
        }
        

    });
    $("#back-btn").click(function(){
        $(".add-screen").fadeOut('slow', function(){
            chrome.browserAction.setPopup({ popup: "../html/main.html" });
            location.href = "../html/main.html";
        });
    });
    $("#submit-btn").click(function(){
        // console.log(newFaculty.slug);
        
        chrome.storage.local.get(['faculties'], function(response){
            const newFaculty = createNewFaculty();
            const faculties = response.faculties;

            if(faculties){
                if(isFacultyUnique(faculties, newFaculty)){
                    console.log("alredy exists");
                    
                    return;
                }
                // console.log(newItem);
                // console.log("faculties");
                
                console.log(faculties);
                
                faculties.push(newFaculty);
                chrome.storage.local.set({faculties: faculties});
            }else{
                console.log("saving new");
                // {faculties: [newItem]}
                chrome.storage.local.set({faculties: [newFaculty]});                 
            }
            
        });
        $(".add-screen").fadeOut('slow', function(){
            chrome.browserAction.setPopup({ popup: "../html/main.html" });
            location.href = "../html/main.html";
        });
    });
});

function isFacultyUnique(faculties, faculty){
    return faculties.find((e,i,a)=>e.slug == faculty.slug) ? true : false;
}

function createNewFaculty(){
     const newFaculty = {
        study_form: {
            text: $("#study-form").children("option:selected").text(),
            value: $("#study-form").children("option:selected").val()
        },
        degree:{
            text: $("#degree").children("option:selected").text().toUpperCase(),
            value: $("#degree").children("option:selected").val(), 
        },
        faculty: {
            text: $("#faculty").children("option:selected").text().toUpperCase(),
            value: $("#faculty").children("option:selected").val(),
        },
        speciality: {
            text: $("#speciality").val(),
            value: $("#speciality").val()
        },
        year: {
            text: $("#year").children("option:selected").text(),
            value: $("#year").children("option:selected").val()
        },
        group: {
            text: $("#group").val(),
            value: $("#group").val()
        },
    };
    newFaculty.slug = slugify(newFaculty);
    return newFaculty;
    
}

function populateGroups(faculty, year, study_form="bakalavr"){
    const xhr = new XMLHttpRequest();
    // console.log(`http://pavel-test-knute.website/app/schedule/${faculty.value}/${year.value}/${group.value}/${study_form.value}/${day}`);

    xhr.open("GET", `http://pavel-test-knute.website/app/groups/${faculty}/${year}/${study_form}`, true);
    xhr.onreadystatechange = function (){
        if (xhr.readyState == 4) {

            // JSON.parse does not evaluate the attacker's scripts.
            const response = JSON.parse(xhr.responseText);

            
            console.log(response.groups);
            $("#group").autocomplete({
                source: response.groups.map(element => {
                    return element.title;
                })
            });
            // $("#group").empty().append();
            

        }
    }
    xhr.send();
}