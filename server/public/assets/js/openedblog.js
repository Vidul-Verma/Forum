const blogTemplate = $("#blog_template").html();
const commentTemplate = $("#comment_template").html();
let globalLoggedIn = false;
let blogId;
let commentId;

window.onload = function() {
    document.body.style.opacity = '1'
    Particles.init({
        selector: '.background',
        color: '#ffffff',
        maxParticles: 400
    });
};

$(document).ready(function() {
  let hiddenTester = $.trim(getCookie('a-auth'))
  if(hiddenTester == '1011'){
    $('#deleteBlog').fadeIn('fast');
  }
  $(".create-comment").fadeOut();
    blogId = gup('blogid', window.location.href);
    $.ajax({
        url: '/api/getblog?blogid=' + blogId,
        method: "GET",
        success: (res) => {
            console.log(res);
            fillBlog(res.doc, res.loggedIn);
        },
        error: () => {
            alert("Internal server error");
        }
    });

    $.ajax({
        url: '/api/blog/getcomments?blogid=' + blogId,
        method: "GET",
        success: (res) => {
            console.log(res);
            fillComments(res.docs, res.loggedIn);

        },
        error: () => {
            alert("Internal server error");
        }
    });


});

$('#deleteBlog').on('click', () =>{
   var answer = confirm("Delete this blog?");
   if (answer == true) {
     $.ajax({
         url: '/admin/deleteblog/' + blogId,
         method: "POST",
         success: (res) => {
             window.location.href = '/blogs'
         },
         error: () => {
             alert("Internal server error");
         }
     });
   }
   else {
     
   }

})

function gup(name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}

function fillBlog(blog, loggedIn) {
  let currentTime = new Date();
  let year = currentTime.getFullYear();
  let formattedTime;
  if(year == moment(blog.createdAt).year()){
    formattedTime = moment(blog.createdAt).format('HH:mm on DD-MMM');
  }else{
    formattedTime = moment(blog.createdAt).format('HH:mm on DD-MMM-YYYY ');
  }
  let renderedTemplate;
  if(blog.featuredImage){
     renderedTemplate = Mustache.render(blogTemplate, {
        title: blog.title,
        featuredImage: blog.featuredImage,
        imagePresent: true,
        body: blog.body,
        views:blog.views,
        createdAt: formattedTime
    });
  }else{
    renderedTemplate = Mustache.render(blogTemplate, {
       title: blog.title,
       featuredImage: blog.featuredImage,
       imagePresent: false,
       body: blog.body,
       views:blog.views,
       createdAt: formattedTime
   });
  }

    $(".inside-container").html(renderedTemplate);

    $("#blog_comment_count").html(blog.comments);
    $("#blog_view_count").html(blog.views);
    $("#blog_upvote_count").html(blog.upvotes);

    if (blog.upvoteUsernames.includes(getCookie("u-auth"))) {
        $("#upvote_button").hide();
        $("#downvote_button").show();
    } else {
        $("#downvote_button").hide();
        $("#upvote_button").show();
    }

    globalLoggedIn = loggedIn;

    $(".show-textarea").on("click", showTextAreaOnClickHandler);
    $(".commentButton").on("click", createCommentOnClickHandler);
    $("#upvote_button").on("click", upvoteOnClickHandler);
    $("#downvote_button").on("click", downvoteOnClickHandler);
}

function fillComments(comments, loggedIn) {

  comments.forEach((comment) =>{
    let currentTime = new Date();
    let year = currentTime.getFullYear();
    let formattedTime;
    if(year == moment(comment.createdAt).year()){
      formattedTime = moment(comment.createdAt).format('HH:mm on DD-MMM');
    }else{
      formattedTime = moment(comment.createdAt).format('HH:mm on DD-MMM-YYYY ');
    }
    let renderedTemplate = Mustache.render(commentTemplate, {
        id:comment._id,
        comment: comment.comment,
        creatorName: comment.creatorUsername,
        avatar: "/uploads/" + comment.avatar,
        createdAt:formattedTime,
    });
    $(".comments-wrapper").append(renderedTemplate);

    if(loggedIn){
      if(getCookie('u-auth') == comment.creatorUsername){
        $("#"+ comment._id + 'btn').css("display", "block");
      }
    }
    $("#"+ comment._id + 'btn').on('click', deleteCommentOnClickHandler);

  })
}

deleteCommentOnClickHandler = function() {
  let commentId = $(this).parent().attr('id');
  let data = {
      commentId: commentId
  }
  $.ajax({
      url: "/api/blog/deleteblogcomment",
      type: "post",
      contentType: "application/json",
      data: JSON.stringify(data),
      success: (res) => {
        $(this).parent().remove();

      },
      error: (res) => {
          alert("Internal server error");
      }
  })

}

let upvoteOnClickHandler = function() {

  if(globalLoggedIn){
    let data = {
        blogId: blogId
    }
    $.ajax({
        url: "/api/upvoteblog",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: (res) => {
            $("#upvote_button").hide();
            $("#downvote_button").show();
            $("#blog_upvote_count").html(parseInt($("#blog_upvote_count").html())+1);

        },
        error: (res) => {
            alert("Internal server error");
        }
    })
  }else{
    alert('You must be logged to upvote this blog')
  }

}

let downvoteOnClickHandler = function() {
  if(globalLoggedIn){
    let data = {
        blogId: blogId
    }
    $.ajax({
        url: "/api/downvoteblog",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: (res) => {
            $("#downvote_button").hide();
            $("#upvote_button").show();
            $("#blog_upvote_count").html(parseInt($("#blog_upvote_count").html())-1);
        },
        error: (res) => {
            alert("Internal server error");
        }
    })
  }else{
    alert('You must be loggedin')
  }

}

let showTextAreaOnClickHandler  = function() {
  let createComment = $(".create-comment");
  $("#create-comment-textarea").val("");

  if (createComment.css("display") == "none") {
    createComment.fadeIn('slow');
  } else {
    createComment.fadeOut('slow');
  }

}

let createCommentOnClickHandler  = function() {
  if(globalLoggedIn){
    let comment = $('#create-comment-textarea').val();
    let data = {
        comment: comment
    }
    blogId = gup('blogid', window.location.href);
    let username = getCookie('u-auth');
    $.ajax({
        url: "/api/blog/createcomment?blogId="+ blogId,
        type: "post",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: (res) => {
          let renderedTemplate = Mustache.render(commentTemplate, {
              comment: comment,
              creatorName: username,
              createdAt:Date.now(),
              avatar: $("#my_avatar").attr("src")
          });
          $(".comments-wrapper").append(renderedTemplate);

            $(".create-comment").fadeOut('slow');
            $("#create-comment-textarea").val("");
            $("html, body").animate({ scrollTop: $(document).height() }, 500);

        },
        error: (res) => {
            alert("Internal server error");
        }
    })
  }else{
    alert('Please login!!');
  }
}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}
