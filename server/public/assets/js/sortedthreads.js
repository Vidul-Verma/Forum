$(document).ready(function() {

    //DEFAULT TAB
    ajaxAndFill("/api/getrecentactivitythreads");


    $(".nav-tabs li").click(function() {
     
        $(".nav-tabs li").removeClass("active");
        $(this).addClass("active");

        switch($(this).attr("id")) {
            case "recent_activites_tab":
                ajaxAndFill("/api/getrecentactivitythreads");
                break;
            case "recent_replies_tab":
                ajaxAndFill("/api/getrecentrepliesthreads");
                break;
            case "most_upvoted_tab":
                ajaxAndFill("/api/getmostupvotedthreads");
                break;
            case "newly_created_tab":
                ajaxAndFill("/api/getnewthreads");
                break;
        }
    });

});

function ajaxAndFill(endPoint) {


    console.log(endPoint);

    let resData;
    $.ajax({
        url: endPoint,
        data: {
            limit: 100
        },
        method: "GET",
        success: (res) => {
            console.log(res);
            fillData(res);
        },
        error: () => {
            alert("Internal server error");
        }
    });




}

function fillData(threads) {

    $(".thread-wrapper").html("");

    let template = $("#threadlist_element_template").html();

    threads.forEach((thread) => {
        let renderedTemplate;
        var formattedTime = moment(thread.createdAt).format('MM-DD-YYYY HH:mm:ss');
        let arr = null;
        if (thread.tags) {
            arr = thread.tags;
        }

        renderedTemplate = Mustache.render(template, {
            threadTitle: thread.title,
            views: thread.views,
            creatorUsername: thread.creatorUsername,
            lastActivityAt: formattedTime,
            replyCount: thread.replycount,
            upvoteCount: thread.upvoteCount,
            compositeId: thread.compositeId,
            tags: arr
        });
        $(".thread-wrapper").append(renderedTemplate);
    });
}