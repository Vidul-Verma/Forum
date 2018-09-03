const threadElementTemplate = $("#thread_element_template").html();

const repliesShowPerPage = 10;

$(document).ready(function() {
    let query = decodeURIComponent(gup('search', window.location.href));
    let pagesearch = decodeURIComponent(gup('pagesearch', window.location.href));
    $.ajax({
        url: '/api/search?search=' + query + '&pagesearch='+pagesearch,
        method: "GET",
        success: (res) => {
            console.log(res);
            fillThreads(res.resultForPage);
            fillPaginator(res.totalResults);
        },
        error: () => {
            alert("Internal server error");
        }
    });
})

function gup(name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}

function fillThreads(threads) {

    if (!threads[0]) {
        $(".threads-wrapper").html("<center><h3 style='color: #a8a8a8;'>No threads found</h3></center>");
        return;
    }

    let renderedTemplate;
    threads.forEach((thread) => {
        if (thread) {
            
            renderedTemplate = Mustache.render(threadElementTemplate, {
                title: thread.title,
                body: (thread.body.length > 200)?thread.body.substring(0,200)+'...':thread.body,
                createdAt: thread.createdAt,
                lastReplyAt: thread.lastReplyAt,
                tags: thread.tags,
                creatorUsername: thread.creatorUsername,
                replyCount: thread.replycount,
                viewCount: thread.views,
                voteCount: thread.upvoteCount,
                compositeId: thread.compositeId
            });
            $(".threads-wrapper").append(renderedTemplate);
        }
    });
}


function fillPaginator(replycount){
  if (replycount - 1 < repliesShowPerPage) {
    return;
  }
  let nPages = parseInt((replycount - 1)/repliesShowPerPage) + 1;
  let paginationHTML = "<a onclick='showPage(1)'>&laquo;</a>";
  for (var i = 1; i <= nPages; i++) {
    paginationHTML += "<a id='"+i+"' onclick='showPage(this.id)'>"+i+"</a>";
  }
  paginationHTML += "<a onclick='showPage("+nPages+")'>&raquo;</a>";
  $(".pagination").html(paginationHTML);
  let activePage = gup("pagesearch");
  $("#"+activePage).addClass("active");
}

function showPage(pageNum) {
    let url = 'search'+window.location.search.split('&')[0] + '&pagesearch='+pageNum;
    console.log(url);
    window.location.href = url;
}