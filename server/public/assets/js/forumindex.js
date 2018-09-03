$(document).ready(function(){
  var data = {
    'parentId' : null
  }
  $.ajax({
    url: "/api/categories",
    type: "post",
    data: data,
    success: (res) => {
      if(jQuery.isEmptyObject(res)){

      }else{
        var template = $('#make-cards').html();
        let categoriesArray = JSON.parse(res);
        categoriesArray.forEach((elem) =>{
          let categoryName = elem.categoryname;
          var html = Mustache.render(template, {
            categoryname: elem.categoryname,
            categoryId: elem._id
          });
          $('#categories').append(html);

          fillthread(elem._id);
        });
      }
    },
    error: (res) => {
      alert("Internal server error");
    },
    complete: () => {

    }
  });


  $.ajax({
    url: "/api/getrecentactivitythreads",
    type: "get",
    success: (res) => {
      fillRecentActivityThreads(res);
    }
  })


  $.ajax({
    url: "/api/getrecentrepliesthreads",
    type: "get",
    data: {limit: 5},
    success: (res) => {

      $("#recent_replies_wrapper").append(renderSmThreads(res));
    }
  });

  $.ajax({
    // sorting methodology for this api needs to be reviewed,
    // what if multiple threads have same number of upvotes
    url: "/api/getmostupvotedthreads",
    type: "get",
    data: {limit: 5},
    success: (res) => {

      $("#most_upvoted_wrapper").append(renderSmThreads(res));
    }
  });

  $.ajax({
    url: "/api/getnewthreads",
    type: "get",
    data: {limit: 5},
    success: (res) => {

      $("#new_threads_wrapper").append(renderSmThreads(res));
    }
  });


})

function fillthread(categoryId){

  let data = {
    parentId: categoryId
  }
  $.ajax({
    url: "/api/subcategories",
    method: "POST",
    data: data,
    success: (res) => {
      var template = $('#fill-threads').html();

      if(res){
        res.forEach((elem) =>{
          let currentTime = new Date();
          let year = currentTime.getFullYear();
          let formattedTime;
          if(year == moment(elem.lastReplyAt).year()){
            formattedTime = moment(elem.lastReplyAt).format('HH:mm on DD-MMM');
          }else{
            formattedTime = moment(elem.lastReplyAt).format('HH:mm on DD-MMM-YYYY ');
          }
          var html = Mustache.render(template, {
            categoryId: elem._id,
            categoryName: elem.categoryname,
            categoryDescription: elem.categorydescription,
            replies: elem.posts,
            threads: elem.threadcount,
            replyAt: formattedTime
          });
          $('#'+ categoryId).append(html);
        });
      }


    },
    error: () => {
      alert("Internal server error");
    }
  })
}

function fillRecentActivityThreads(threads) {
  const threadElementTemplate = $("#threadlist-element-template").html();

  threads.forEach((thread) => {
    let currentTime = new Date();
    let year = currentTime.getFullYear();
    let formattedTime;
    if(year == moment(thread.lastReplyAt).year()){
      formattedTime = moment(thread.lastReplyAt).format('HH:mm on DD-MMM');
    }else{
      formattedTime = moment(thread.lastReplyAt).format('HH:mm on DD-MMM-YYYY ');
    }
    let renderedTemplate = Mustache.render(threadElementTemplate,{
      threadTitle: thread.title,
      upvoteCount: thread.upvoteCount,
      replyCount: thread.replycount,
      views: thread.views,
      compositeId: thread.compositeId,
      creatorUsername: thread.creatorUsername,
      lastActivityAt: formattedTime,
      tags: thread.tags[0]
    });
    $(".recent-activities-list").append(renderedTemplate);
  });

}


function renderSmThreads(threads) {
  const threadElementTemplate = $("#thead_sm_element_template").html();
  let renderedThreads = "";

  threads.forEach((thread) => {

    let currentTime = new Date();
    let year = currentTime.getFullYear();
    let formattedTime;
    if(year == moment(thread.lastReplyAt).year()){
      formattedTime = moment(thread.lastReplyAt).format('HH:mm on DD-MMM');
    }else{
      formattedTime = moment(thread.lastReplyAt).format('HH:mm on DD-MMM-YYYY ');
    }

    let renderedTemplate = Mustache.render(threadElementTemplate, {
      compositeId: thread.compositeId,
      threadTitle: thread.title,
      replyCount: thread.replycount,
      views: thread.views,
      upvoteCount: thread.upvoteCount,
      creatorUsername: thread.creatorUsername,
      lastReplyAt: formattedTime
    });

    renderedThreads += renderedTemplate;
  });
  return renderedThreads;
}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}
