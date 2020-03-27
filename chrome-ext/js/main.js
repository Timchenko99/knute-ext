window.onload = function () {
    !this.navigator.onLine && chrome.browserAction.setPopup({ popup: "../html/no-connection.html" });
};

$(document).ready(function () {
    populateSubs();
    $(".main-screen").fadeIn("slow");

    $("#add-button").click(function () {
        $(".main-screen").fadeOut("slow", function () {
            location.href = "../html/add.html";
        });
    });
    $("#more-btn button").click(function () {
        $(".main-screen").fadeOut("slow", function () {
            location.href = "../html/settings.html";
        });
    });



});

function createFacultyItem(faculty, speciality, study_form, group, year) {
    return `<button class="sub-item">\
    <section class="content-left">\
        <h5 class="title">${faculty}</h5>\
        <p class="spec">${speciality}</p>\
        <p class="study-form">${study_form}</p>\
    </section>\
    <section class="content-right">\
        <h5 class="group">${group} гр.</h5>\
        <h5 class="course">${year} курс</h5>\
    </section>\
</button>`;
}

function populateSubs() {
    $("#subs").empty();
    chrome.storage.local.get(['faculties'], (response) => {
        if (response.faculties) {
            response.faculties.forEach((e) => {
                $("#subs").append(createFacultyItem(e.faculty.text, e.speciality.text, e.study_form.text, e.group.text, e.year.text));
            });
            $(".sub-item").on("click",function (evt) {
                const data = {
                    faculty: this.children[0].children[0].innerText,
                    speciality: this.children[0].children[1].innerText,
                    study_form: this.children[0].children[2].innerText,
                    group: this.children[1].children[0].innerText[0],
                    year: this.children[1].children[1].innerText[0]
                };
                // console.log(slugifyText(data.study_form, data.faculty, data.speciality, data.year, data.group));
                // console.log(data);
                const faculty_data = response.faculties.find((e)=>e.slug == slugifyText(data.study_form, data.faculty, data.speciality, data.year, data.group));
        
                if(evt.ctrlKey){
                    const newFaculties = response.faculties.filter((e,i,a)=>e.slug != faculty_data.slug);
                    chrome.storage.local.set({faculties: newFaculties});
                   $(this).hide('fast');

                    return;
                    
                };
                
                chrome.storage.local.set({selected: faculty_data});
                $(".main-screen").fadeOut("slow", function () {
                    chrome.browserAction.setPopup({ popup: "../html/schedule.html" });
                    location.href = "../html/schedule.html";
                });
            });
        } else {
            return;
        }
    });
}