const displayThreadsPerPage = 10;

function goToThread(threadId){
    window.location.href = '/thread/'+ threadId+ '?page=1';
}
let activePage = 1;

function fillThreads(threads) {

    let threadTemplate = $("#thread_list_element").html();
    $("#thread_list").html('');

    let renderedTemplate;


    for (var i = 0; i < threads.length; i++) {
      var formattedTime = moment(threads[i].createdAt).format('MMM-DD HH:mm');
      var formattedReplyTime = moment(threads[i].lastReplyAt).format('MMM-DD HH:mm');
        renderedTemplate = Mustache.render(threadTemplate,{
            createdAt: formattedTime,
            title: threads[i].title,
            createdBy: threads[i].creatorUsername,
            lastReplyAt: formattedReplyTime,
            replyCount: threads[i].replycount,
            threadId: threads[i].compositeId
        });
        $("#thread_list").append(renderedTemplate);
    }
}

$(document).ready(function() {
  var pathArray = window.location.pathname.split( '/' );

    $.ajax({
        url: "/api/getthreadstags/"+pathArray[pathArray.length-1]+'?pagethread=1' ,
        type: "GET",
        success: function(res) {
          let data = JSON.parse(res);
          let divTitleLeft = document.createElement('div');
          divTitleLeft.className = 'pull-left';
          divTitleLeft.style.width = '50%';
          let divTitleRight= document.createElement('div');
          divTitleRight.className = 'pull-right';
          divTitleRight.style.width = '50%';
          let h1 = document.createElement("H1");
          let title = document.createTextNode('#'+ pathArray[pathArray.length-1]);
          h1.appendChild(title);
          divTitleLeft.appendChild(h1);
          let para = document.createElement('P');
          para.style.float = 'right';


          divTitleRight.appendChild(para);
          $('#title').append(divTitleLeft);
          $('#title').append(divTitleRight);
          $("#category_description").html('');
          let description = document.createTextNode('');
          $("#category_description").append(description);

            fillThreads(data.docs);
            let nPages = parseInt((data.totalThreads - 1)/displayThreadsPerPage) + 1;
            let paginationHTML = "<a onclick='showPage(1)'>&laquo;</a>";
            for (var i = 1; i <= nPages; i++) {
              paginationHTML += "<a id='"+i+"' onclick='showPage(this.id)'>"+i+"</a>";
            }
            paginationHTML += "<a onclick='showPage("+nPages+")'>&raquo;</a>";
            $(".pagination").html(paginationHTML);
            $("#"+activePage).addClass("active");

        },
        error: function(res) {
            alert("Internal server error");
        }
    })
});

function showPage(pageNum) {

  $("#"+activePage).removeClass("active");
  activePage = pageNum;
  $("#"+activePage).addClass("active");


  let urlArray = window.location.href.split("/");
  let thirdpart = urlArray[4].split('?');
  let url = "/api/getthreadstags/"+thirdpart[0]+ '?pagethread=' + pageNum;
  console.log(url);

  $.ajax({
  url: url,
  method: "GET",
  success: (res) => {
    let data = JSON.parse(res);
    fillThreads(data.docs);
  },
  error: () => {
    alert("Internal server error");
  }
});
}
