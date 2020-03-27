const LESSONS_TIME_SCHEDULE = {
    1: {
        time: "8:20 - 9:40",
        start: "8:20",
        end: "9:40",
        break_time: "25 хв"
    },
    2: {
        time: "10:05 - 11:25",
        start: "10:05",
        end: "11:25",
        break_time: "40 хв"
    },
    3: {
        time: "12:05 - 13:25",
        start: "12:05",
        end: "13:25",
        break_time: "25 хв"
    },
    4: {
        time: "13:50 - 15:10",
        start: "13:50",
        end: "15:10",
        break_time: "15 хв"
    },
    5: {
        time: "15:25 - 16:45",
        start: "15:25",
        end: "16:45",
        break_time: "15 хв"
    },
    6: {
        time: "17:00 - 18:20",
        start: "17:00",
        end: "18:20",
        break_time: "10 хв"
    },
    7: {
        time: "18:30 - 19:50",
        start: "18:30",
        end: "19:50",
        break_time: "Mission Complete - +Respect"
    },

};

$(document).ready(function () {
    groupInfo();
    getSchedule($('.day-btn.active').attr('value'));

    $("#schedule-screen").fadeIn('slow');
    $("#faculty").click(function () {
        $("#schedule-screen").fadeOut('slow', function () {
            chrome.browserAction.setPopup({ popup: "../html/main.html" });
            location.href = "../html/main.html";
        });
    });
    $(".day-btn").click(function () {
        $(".day-btn.active").removeClass('active');
        $(this).addClass("active");
        getSchedule($(this).attr("value"));

    });
});

function groupInfo() {
    chrome.storage.local.get(['selected'], (response) => {
        const { faculty, year, group, study_form, speciality } = response.selected;
        $("#faculty").empty().append(`<h5>${faculty.text}</h5>`);
        $("#speciality").text(speciality.text);        
        $("#study_form").text(study_form.text);
        $("#number").text(`${year.text} - ${group.text}`);
    });
}

function getSchedule(day) {
    chrome.storage.local.get('selected', (response) => {
        const { faculty, year, group, study_form } = response.selected;
        const xhr = new XMLHttpRequest();
        // console.log(`http://pavel-test-knute.website/app/schedule/${faculty.value}/${year.value}/${group.value}/${study_form.value}/${day}`);

        xhr.open("GET", `http://pavel-test-knute.website/app/schedule/${faculty.value}/${year.value}/${group.value}/bakalavr/${day}`, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                
                // console.log(LESSONS_TIME_SCHEDULE[1]['time']);
                
                // JSON.parse does not evaluate the attacker's scripts.
                const response = JSON.parse(xhr.responseText);
                console.log(JSON.parse(xhr.responseText));
                // const content = createLesson(LESSONS_TIME_SCHEDULE[response.schedule[0].number_lesson]['time'], response.schedule[0].title, LESSONS_TIME_SCHEDULE[response.schedule[0].number_lesson]['break_time']);
                $('#schedule').fadeOut("fast", function(){
                    $(this).empty();
                    response.schedule.forEach((e,i,a)=>{
                        $('#schedule').append(createLesson(LESSONS_TIME_SCHEDULE[e.number_lesson]['time'], e.title, LESSONS_TIME_SCHEDULE[e.number_lesson]['break_time']));
                        
                    });
                    $(this).fadeIn("fast");
                });
                

            }
        }
        xhr.send();
    });
}

function createLesson(time, lesson, break_time) {
    if(lesson.includes("Самостійна")){

        return `
        <div class="lesson">\
            <div class="lesson-info">\

                <div class="lesson-title">\
                    <p>${lesson.replace('#','')}</p>\
                </div>\
            </div>\

        </div>`;
    }
    console.log(lesson.split('|').map((e,i,a)=>`<p>${e}</p>`).reduce((p,c)=>p+c));
    const lessons = lesson.split('|');
    console.log(lessons);
    
    const lessons_info = lessons.map((e,i,a)=> {
        const h = e.split("#");
        return {lesson: h[0], teacher: h[1]};
    });
    const content = lessons_info.map((e,i,a)=>`<p>${e.lesson}</p><p>${e.teacher}</p><br>`).reduce((p,c)=>p+c);
    console.log(lessons_info.map((e,i,a)=>`<p>${e.lesson}</p><p>${e.teacher}</p><br>`).reduce((p,c)=>p+c));
    
    return `
    <div class="lesson">\
        <div class="lesson-info">\
            <div class="lesson-time">\
                <h3>${time}</h3>\
            </div>\
            <div class="lesson-title">\
                ${content}\
            </div>\
        </div>\
        <div class="break-time">\
            <hr class="break-line">\
            <div>\
                <p>${break_time}</p>\
            </div>\
            <hr class="break-line">\
        </div>\
    </div>`;
}