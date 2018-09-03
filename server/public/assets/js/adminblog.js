$("#create_category_button").click(() => {

    let data = new Object();
    data.title = $("#blogtitle").val();
    data.body = $("#body").val();
    data.bodysmall = $("#body-small").val();
    data.body = textarea.getContent();
    data = JSON.stringify(data);

    let url;

    let formData = new FormData();
    formData.append("title", $("#blogtitle").val());
    formData.append("body", textarea.getContent());
    formData.append("bodysmall", $("#body-small").val());
    
    if ($("input[type=file]")[0].files.length > 0) {
        url = "/admin/createblog";
        formData.append("featuredImage", $("input[type=file]")[0].files[0]);
        $.ajax({
            url: url,
            type: "post",
            data: formData,
            // contentType: "application/json",
            contentType: false,
            processData: false,
            success: (res) => {
                alert("Blog created successfully");
            },
            error: (res) => {
                alert("Internal server error");
            }
        })
    } else {
        url = "/admin/createblognoimage";
        $.ajax({
            url: url,
            type: "post",
            data: data,
            contentType: "application/json",
            success: (res) => {
                alert("Blog created successfully");
            },
            error: (res) => {
                alert("Internal server error");
            }
        })
    }


})