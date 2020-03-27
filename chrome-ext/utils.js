function slugify(faculty){
    return `${faculty.study_form.text}${faculty.faculty.text}${faculty.speciality.text}${faculty.year.text}${faculty.group.text}`.replace(/\s+/g, '');
}

function slugifyText(study_form, faculty, speciality, year, group){
    return `${study_form}${faculty}${speciality}${year}${group}`.replace(/\s+/g, '');
}