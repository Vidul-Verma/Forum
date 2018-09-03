var threadId;
let activePage = 1;
const repliesShowPerPage = 10;
let currentPageRepliesCount, createReplyEditor;
let hiddenTester;

function fillData(data) {
  let renderedTemplate;
  let currentTime = new Date();
  let year = currentTime.getFullYear();
  let formattedTime;
  if(year == moment(data.thread.createdAt).year()){
    formattedTime = moment(data.thread.createdAt).format('HH:mm on DD-MMM');
  }else{
    formattedTime = moment(data.thread.createdAt).format('HH:mm on DD-MMM-YYYY ');
  }
  let template = $("#thread_template").html();

  let arr = null;
  if(data.thread.tags){
      arr = data.thread.tags;
  }
    let avatarFileName;
  if (data.thread.avatar) {
    avatarFileName = "/uploads/" + data.thread.avatar;
  } else {
    avatarFileName = "/assets/images/avatar.png";
  }
  renderedTemplate = Mustache.render(template, {
    avatar: avatarFileName,
    title: data.thread.title,
    threadId: data.thread.compositeId,
    body: data.thread.body,
    creatorUsername: data.thread.creatorUsername,
    createdAt: formattedTime,
    posts: data.thread.replycount,
    upvoteCount: data.thread.upvoteCount,
    views: data.thread.views,
    tags: arr
  });
  $(".thread-wrapper").append(renderedTemplate);


  let categoryId = data.thread.category;
  $("#delete_button").on("click", function(){
    deleteButtonOnClick(categoryId);
  });
  $("#bookmark_button").on("click", function(){
    bookmarkButtonOnClick();
  });
  $("#red_bookmark_button").on("click", function(){
    redBookmarkButtonOnClick();
  });
  if(loggedIn){
    if(hiddenTester == '1011' && !data.thread.closed){
      $("#close_button").removeClass("hidden");
    }else{
      if(hiddenTester == '1011' && data.thread.closed){
        $("#open_button").removeClass("hidden");
      }
    }
    $("#reply_button").removeClass("hidden");
    if(data.thread.creatorUsername == getCookie('u-auth') || hiddenTester == '1011'){
      $("#delete_button").removeClass("hidden");
    }
    if(data.threadBookmarked){
      $("#red_bookmark_button").removeClass("hidden");
    }else{
      $("#bookmark_button").removeClass("hidden");
    }

    $("#reply_button").on("click", replyButtonOnClickHandler);
    $("#close_button").on("click", closeButtonOnClickHandler);
    $("#open_button").on("click", openButtonOnClickHandler);

    //DISPLAY UPVOTE OR DOWNVOTE BUTTON
    if (data.thread.upvoted) {
      $("#downvote_button").removeClass("hidden");
    } else {
      $("#upvote_button").removeClass("hidden");
    }
    $("#upvote_button").on("click", upvoteButtonOnClickHandler);
    $("#downvote_button").on("click", downvoteButtonOnClickHandler);
  } else {

    $("#reply_button").removeClass("hidden");
    $("#reply_button").on("click", () => alert("You must be loggedIn to reply on this thread"));

    $("#upvote_button").removeClass("hidden");
    $("#upvote_button").on("click", () => alert("You must be loggedIn to upvote this thread"));
  }

  if(data.thread.closed){
    $('#closed-msg-div').fadeIn('slow');
    $('#reply_button').fadeOut('slow');
  }
  //pagination
  fillPaginator(data.thread.replycount);

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
  $("#"+activePage).addClass("active");
}

function fillReplies(data) {

  $("#"+activePage).addClass("active");
  $(".replies-wrapper").html('');
  let replies = data.replies;
  currentPageRepliesCount = replies.length;

  commentTemplate = $("#comment_template").html();
  console.log("Num of Replies " + replies.length)



  replies.forEach((reply) => {

    let currentTime = new Date();
    let year = currentTime.getFullYear();
    let formattedTime;
    if(year == moment(reply.createdAt).year()){
      formattedTime = moment(reply.createdAt).format('HH:mm on DD-MMM');
    }else{
      formattedTime = moment(reply.createdAt).format('HH:mm on DD-MMM-YYYY ');
    }
    if(!reply.replyDeleted){
      let avatarFileName;

      if (reply.avatar) {
      avatarFileName = "/uploads/" + reply.avatar;
      } else {
        avatarFileName = "/assets/images/avatar.png";
      }


      template = $("#reply_template").html();
      renderedTemplate = Mustache.render(template, {
        avatar: avatarFileName,
        replyId: reply._id,
        creatorUsername: reply.creatorUsername,
        creatorType: reply.creatorType,
        body: reply.body,
        votes: reply.voteCount,
        createdAt: formattedTime,
        replyNumber: reply.replyNumber
      });
      $(".replies-wrapper").append(renderedTemplate);

      if(reply.replyBookmarked){
        $("#"+reply._id + " .reply-red-bookmark-button").removeClass("hidden");
      }else{
        $("#"+reply._id + " .reply-bookmark-button").removeClass("hidden");
      }

    }else{
      template = $("#reply_deleted_template").html();
      renderedTemplate = Mustache.render(template, {
        replyId: reply._id,
        body: 'This reply was deleted',
        replyNumber: reply.replyNumber
      });
      $(".replies-wrapper").append(renderedTemplate);

      $("#"+reply._id + " .comment_button").remove();
    }




    $("#"+reply._id+" .reply-bookmark-button").on("click", bookmarkReplyButtonOnClickHandler);
    $("#"+reply._id+" .reply-red-bookmark-button").on("click", redBookmarkReplyButtonOnClickHandler);

    if(loggedIn){
      if(reply.creatorUsername == getCookie('u-auth') || hiddenTester == '1011'){
        $("#"+reply._id+" .delete_reply_button").removeClass("hidden");
      }
      if(reply.upvoted){
        $("#"+reply._id+" .downvote-reply-button").removeClass("hidden");
      }else{
        $("#"+reply._id+" .upvote-reply-button").removeClass("hidden");
      }
      $("#"+reply._id+" .upvote-reply-button").on("click", upvoteReplyButtonOnClickHandler);
      $("#"+reply._id+" .downvote-reply-button").on("click", downvoteReplyButtonOnClickHandler);
    } else {
      $("#"+reply._id+" .upvote-reply-button").removeClass("hidden");
      $("#"+reply._id+" .upvote-reply-button").on("click", () => alert("You must be loggedIn to upvote this reply"));
    }


    if (reply.comments.length) {

      // $("#" + reply._id ).append('<div class="comments-wrapper"></div>');
      $("#" + reply._id + " .comments-wrapper").show();


      reply.comments.forEach((comment) => {
        let currentTime = new Date();
        let year = currentTime.getFullYear();
        let formattedTime;
        if(year == moment(comment.createdAt).year()){
          formattedTime = moment(comment.createdAt).format('HH:mm on DD-MMM');
        }else{
          formattedTime = moment(comment.createdAt).format('HH:mm on DD-MMM-YYYY ');
        }
        renderedTemplate = Mustache.render(commentTemplate, {
          creatorUsername: comment.creatorUsername,
          body: comment.comment,
          createdAt: formattedTime,
          commentId: comment._id
        });
        $("#" + reply._id + " .comments-wrapper").append(renderedTemplate);

        if ((loggedIn && comment.creatorUsername === getCookie("u-auth")) || (loggedIn && hiddenTester == '1011')) {
          let btn = $("#" + reply._id + " .comments-wrapper #"+comment._id+" button");
          btn.removeClass("hidden");
          btn.click(deleteCommentOnClickHandler);
        }

      });
    }

  });
    $(".delete_reply_button").on('click', deleteReplyButtonClickHandler);

  //MOVE THIS INSIDE ABOVE forEach BLOCK
  if(loggedIn){
    $(".comment_button").click(function() {
      $(".create-comment").remove();
      $(this).hide();
      let replyId = $(this).attr('replyid');
      $("#"+replyId).append($("#create_comment_template").html());
      $('.commentButton').on('click', commentButtonOnClick);
    });
  } else {
    $(".comment_button").click(() => alert("You must be loggedIn to post comment"));
  }



    //to be removed
  // $('.commentButton').on('click', function(){
  //   let replyId = $(this).parent().attr('id');
  //   let commentData = $('#'+replyId+'d').val();
  //   let data = {
  //     replyId: replyId,
  //     commentData: commentData
  //   }

  //   $.ajax({
  //   method: 'POST',
  //   url: '/createcomment',
  //   datatype: 'json',
  //   data: data,
  //   success: (res) => {

  //     alert('comment saved');
  //   },
  //   error: () => {
  //     alert("Internal server error");
  //   }
  // });
  // });

}

let upvoteReplyButtonOnClickHandler = function() {
  var replyId = $(this).parent().parent().attr('id');
  let data = {
    replyId: replyId
  }

  $.ajax({
    url: "/api/upvotereply",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(data),

    success: (res) => {
      incrementReplyVoteCount(replyId);
      toggleReplyUpvoteDownvoteButton(replyId);
    },
    error: (res) => {
      alert("Internal server error");
    }
  });
}

let downvoteReplyButtonOnClickHandler = function() {
  var replyId = $(this).parent().parent().attr('id');
  let data = {
    replyId: replyId
  }

  $.ajax({
    url: "/api/downvotereply",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(data),

    success: (res) => {
      decrementReplyVoteCount(replyId);
      toggleReplyUpvoteDownvoteButton(replyId);
    },
    error: (res) => {
      alert("Internal server error");
    }
  });
}

let bookmarkReplyButtonOnClickHandler = function() {
  var replyId = $(this).parent().parent().attr('id');
  $.ajax({
  method: 'POST',
  url: '/addbookmarkedreply/' + replyId,
    success: (res) => {
      toggleReplyBookmarkButton(replyId);

    },
    complete: () =>{

    },
    error: () => {
      alert("Internal server error");
    }
  });
}

let redBookmarkReplyButtonOnClickHandler = function() {
  var replyId = $(this).parent().parent().attr('id');
  $.ajax({
  method: 'POST',
  url: '/removebookmarkedreply/' + replyId,
    success: (res) => {
      toggleReplyBookmarkButton(replyId);

    },
    complete: () =>{

    },
    error: () => {
      alert("Internal server error");
    }
  });
}

let deleteCommentOnClickHandler = function() {

  if (!confirm("Delete this comment?")) return;

  let data = new Object();
  data.replyId = $(this).parent().parent().parent().attr("id")
  data.commentId = $(this).parent().attr("id");

  $.ajax({
    url: "/api/deletecomment",
    type: "post",
    data: JSON.stringify(data),
    contentType: "application/json",
    success: (res) => {
      $(this).parent().remove();
    },
    error: (res) => {
      alert("Internal server error");
    }
  });

  if(hiddenTester == '1011'){
    $.ajax({
      url: "/api/admin/deletecomment",
      type: "post",
      data: JSON.stringify(data),
      contentType: "application/json",
      success: (res) => {
        $(this).parent().remove();
      },
      error: (res) => {
        alert("Internal server error");
      }
    });
  }
}

function deleteButtonOnClick(categoryId) {
  var threadId = $('#delete_button').parent().attr('id');
  $.ajax({
  method: 'POST',
  url: '/api/deletethread?threadId=' + threadId,
    success: (res) => {

      alert('thread deleted');

    },
    complete: () =>{
      window.location.href = '/threadlist/'+ categoryId;
    },
    error: () => {
      alert("Internal server error");
    }
  });

  if(hiddenTester == '1011'){
    $.ajax({
    method: 'POST',
    url: '/api/admin/deletethread?threadId=' + threadId,
      success: (res) => {

        alert('thread deleted');

      },
      complete: () =>{
        window.location.href = '/threadlist/'+ categoryId;
      },
      error: () => {
        alert("Internal server error");
      }
    });
  }
}

function bookmarkButtonOnClick() {
  var threadId = $('#bookmark_button').parent().attr('id');
  $.ajax({
  method: 'POST',
  url: '/addbookmarkedthread/' + threadId,
    success: (res) => {
      toggleBookmarkButton();

    },
    complete: () =>{

    },
    error: () => {
      alert("Internal server error");
    }
  });
}

function redBookmarkButtonOnClick() {
  var threadId = $('#red_bookmark_button').parent().attr('id');
  $.ajax({
  method: 'POST',
  url: '/removebookmarkedthread/' + threadId,
    success: (res) => {
      toggleBookmarkButton();

    },
    complete: () =>{

    },
    error: () => {
      alert("Internal server error");
    }
  });
}



let deleteReplyButtonClickHandler = function() {
  if(!confirm("Delete this reply?")) return;

  let replyId = $(this).attr('replyid');

  $.ajax({
    url: "/api/deletereply?replyId=" + replyId,
    type: "post",
    success: (res) => {
      $("#"+replyId).html("Reply Was Deleted");
    },
    error: (res) => {
      alert("Internal server error");
    }
  });

  if(hiddenTester == '1011'){
    $.ajax({
      url: "/api/admin/deletereply?replyId=" + replyId,
      type: "post",
      success: (res) => {
        $("#"+replyId).html("Reply Was Deleted");
      },
      error: (res) => {
        alert("Internal server error");
      }
    });
  }
}


var commentButtonOnClick = function(){

  let replyId = $(this).parent().parent().parent().attr('id');
  let commentData = $('#'+replyId+' textarea').val();
  let data = {
    replyId: replyId,
    commentData: commentData
  }

  if (commentData == "") {
    alert("Cannot create blank comment");
    return;
  }


  $(".comment_button").show();
  $('#'+replyId+' .create-comment').remove();

  $.ajax({
  method: 'POST',
  url: '/api/createcomment',
  datatype: 'json',
  data: data,
    success: (res) => {
      console.log(res);

      $("#" + replyId + " .comments-wrapper").show();
      let commentTemplate = $("#comment_template").html();
      let currentTime = new Date();
      let year = currentTime.getFullYear();
      let formattedTime;
      if(year == moment(res.createdAt).year()){
        formattedTime = moment(res.createdAt).format('HH:mm on DD-MMM');
      }else{
        formattedTime = moment(res.createdAt).format('HH:mm on DD-MMM-YYYY ');
      }
      renderedTemplate = Mustache.render(commentTemplate, {
        commentId: res._id,
        creatorUsername: res.creatorUsername,
        body: res.comment,
        createdAt: formattedTime
      });
      $("#" + replyId + " .comments-wrapper").append(renderedTemplate);

      let deleteBtn = $("#" + replyId + " .comments-wrapper #"+res._id + " button");
      deleteBtn.click(deleteCommentOnClickHandler);
      deleteBtn.removeClass("hidden");

    },
    error: () => {
      alert("Internal server error");
    }
  });
}

let upvoteButtonOnClickHandler = function() {
  let data = {
    threadId: threadId
  }
  console.log(data)
  $.ajax({
    url: "/api/upvotethread",
    type: "post",
    contentType: "application/json",
    data: JSON.stringify(data),
    success: (res) => {
      $("#upvote_count").html(parseInt($("#upvote_count").html()) + 1);
      toggleUpvoteDownvoteButton();
    },
    error: (res) => {
      alert("Internal server error");
    }
  });
}



let downvoteButtonOnClickHandler = function() {
  let data = {
    threadId: threadId
  }
  console.log(data)
  $.ajax({
    url: "/api/downvotethread",
    type: "post",
    contentType: "application/json",
    data: JSON.stringify(data),
    success: (res) => {
      $("#upvote_count").html(parseInt($("#upvote_count").html()) - 1);
      toggleUpvoteDownvoteButton();
    },
    error: (res) => {
      alert("Internal server error");
    }
  });
}

function toggleUpvoteDownvoteButton() {
  $("#upvote_button").toggleClass("hidden");
  $("#downvote_button").toggleClass("hidden");
}
function toggleBookmarkButton() {
  $("#bookmark_button").toggleClass("hidden");
  $("#red_bookmark_button").toggleClass("hidden");
}

function toggleReplyBookmarkButton(replyId) {
  $("#"+replyId + " .reply-red-bookmark-button").toggleClass("hidden");
  $("#"+replyId + " .reply-bookmark-button").toggleClass("hidden");
}

let replyButtonOnClickHandler = function() {
  let createReply = $(".thread-createreply-wrapper");
  if (createReply.css("display") == "none") {
    createReply.show();
  } else {
    createReply.hide();
  }
}

let closeButtonOnClickHandler = function() {
  threadId = $('#close_button').parent().attr('id');
  var answer = confirm("Close this thread?");
  if (answer == true) {
    $.ajax({
        url: '/api/admin/closethread/' + threadId,
        method: "POST",
        success: (res) => {
            location.reload();
        },
        error: () => {
            alert("Internal server error");
        }
    });
  }
  else {

  }
}

let openButtonOnClickHandler = function() {
  threadId = $('#open_button').parent().attr('id');
  var answer = confirm("Open this thread?");
  if (answer == true) {
    $.ajax({
        url: '/api/admin/openthread/' + threadId,
        method: "POST",
        success: (res) => {
            location.reload();
        },
        error: () => {
            alert("Internal server error");
        }
    });
  }
  else {

  }
}

function showPage(pageNum) {



  let urlArray = window.location.href.split("/");
  let thirdpart = urlArray[4].split('?');
  let url = "/api/getthreadandreplies/"+thirdpart[0]+ '?page=' + pageNum;
  console.log(url);
  $.ajax({
  url: url,
  method: "GET",
    success: (res) => {
      console.log(res);

      fillReplies(jQuery.parseJSON(res));
      fillPaginator(jQuery.parseJSON(res).thread.replycount);
    },
    error: () => {
      alert("Internal server error");
    }
  });

  $("#"+activePage).removeClass("active");
  activePage = parseInt(pageNum);
  $("#"+activePage).addClass("active");
}

$("#create_reply_button").click((e) => {

  let replyData = new Object();
  replyData.threadId = threadId;
  // replyData.body = $("#create_reply_textarea").val();
  replyData.body = createReplyEditor.getContent();

  if (replyData.body.trim() === "<br>") {
    alert("Cannot create blank reply");
    return;
  }
  createReplyEditor.setContent("");

  $.ajax({
    url: "/api/createreply",
    type: "post",
    contentType: "application/json",
    data: JSON.stringify(replyData),
    success: (res) => {

      //show latest reply count
      $("#reply_count").html(res.replycount);

      //reajax and show last page
      let newLastPage = parseInt((res.replycount - 1)/repliesShowPerPage) + 1;
      showPage(newLastPage);

      //scroll to last reply
      $('html, body').animate({
        scrollTop: $(".reply-comment-wrapper:last").offset().top
      }, 300);

    },
    error: (res) => {
      alert("Internal server error");
    }
  });


  $("#create_reply_textarea").val('')
  $(".thread-createreply-wrapper").hide();


  $("#reply_modal_textarea").val('');
  $("#create_thread_modal").modal("hide");
});

function toggleReplyUpvoteDownvoteButton(replyId) {
  $("#"+replyId+" .upvote-reply-button").toggleClass("hidden");
  $("#"+replyId+" .downvote-reply-button").toggleClass("hidden");
}

function incrementReplyVoteCount(replyId) {
  console.log("html " + $("#"+replyId + " .reply_upvote_count").html() + " + 1")
  $("#"+replyId + " .reply_upvote_count").html(parseInt($("#"+replyId + " .reply_upvote_count").html()) + 1);
}

function decrementReplyVoteCount(replyId) {
  console.log("html "+ $("#"+replyId + " .reply_upvote_count").html() + " - 1")
  $("#"+replyId + " .reply_upvote_count").html(parseInt($("#"+replyId + " .reply_upvote_count").html()) - 1);
}


$(document).ready(function(){
  hiddenTester = getCookie('a-auth');
  // nicEditors.allTextAreas();
  // createReplyEditor = nicEditors.findEditor("create_reply_textarea");


  let nicObejct;
  // let createReplyEditor;
    // nicEditors.allTextAreas()
  // textarea = nicEditors.findEditor('thread_body_input');

  nicObejct = new nicEditor({
    buttonList: ['bold','italic','underline','left','center','right','justify','ol','ul','subscript','superscript','strikethrough','removeformat','indent','outdent','hr','upload','forecolor','bgcolor','fontSize','fontFamily','fontFormat'],
    maxHeight : 350
  });
  nicObejct.panelInstance('create_reply_textarea');
  createReplyEditor = nicObejct.instanceById("create_reply_textarea");




  let urlArray = window.location.href.split("/");
  threadId = urlArray[4].split('?')[0];


// let urlArray = window.location.href.split("/");
// let url = "/api/getthread/"+urlArray[4]+"/1";
// if (urlArray.length == 6) {
//   if (urlArray[5]) {
//     url = "/api/getthread/"+urlArray[4]+"/" + urlArray[5];
//     activePage = parseInt(urlArray[5]);
//   } else {
//     url = "/api/getthread/"+urlArray[4]+"/1";
//   }

let url;
activePage = parseInt(gup('page', window.location.href));
if(activePage){
  url = "/api/getthreadandreplies/"+urlArray[4];
}else{
  activePage = 1;
  url = "/api/getthreadandreplies/"+urlArray[4]+"?page=1";
}

console.log(url);

$.ajax({
  url: url,
  method: "GET",
  success: (res) => {
    console.log(JSON.parse(res));


    fillData(JSON.parse(res))
    fillReplies(JSON.parse(res));
    getSiblingCategories(JSON.parse(res).thread.category);
  },
  error: () => {
    alert("Internal server error");
  }
});

  $.ajax({
    url: "/api/getrecentrepliesthreads",
    type: "get",
    data: {limit: 10},
    success: (res) => {
      console.log(res)
      $("#recent_replies_wrapper").append(renderSmThreads(res));
    }
  });

});



function gup( name, url ) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
}
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

function renderSmThreads(threads) {
  const threadElementTemplate = $("#thead_sm_element_template").html();
  let renderedThreads = "";

  threads.forEach((thread) => {
    let renderedTemplate = Mustache.render(threadElementTemplate, {
      compositeId: thread.compositeId,
      threadTitle: thread.title,
      replyCount: thread.replycount,
      views: thread.views,
      upvoteCount: thread.upvoteCount,
      creatorUsername: thread.creatorUsername,
      lastReplyAt: moment(thread.lastReplyAt).format('MM-DD-YYYY HH:mm')
    });

    renderedThreads += renderedTemplate;
  });
  return renderedThreads;
}

function getSiblingCategories(categoryId) {
  let categoryTemplate = $("#category_template").html();
  $.ajax({
    url: "/api/getsiblandparentcategories/"+categoryId,
    type: "get",
    success: function(res) {
      console.log(res);
        let renderedTemplate = Mustache.render(categoryTemplate, {
          parentCategoryName: res.category.categoryname,
          subCategories: res.subCategories
        });
        $(".content-right").prepend(renderedTemplate);
        $("#"+categoryId).addClass("category-element-active");
    }
  })
}
