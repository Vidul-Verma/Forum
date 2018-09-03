
$(document).ready(function(){
  $.ajax({
    url: '/api/getbloglist',
    method: "GET",
    success: (res) => {
      res.forEach((blog) =>{
        fillData(blog)
        fillBlogList(blog)
      })

    },
    error: () => {
      alert("Internal server error");
    }
  });
});

$('#show-more-button').on('click', () =>{
  $.ajax({
    url: '/api/getbloglist/all',
    method: "GET",
    success: (res) => {
      document.getElementById("show-more-button").style.display = "none";
      res.forEach((blog) =>{
        fillBlogList(blog)
      })

    },
    error: () => {
      alert("Internal server error");
    }
  });
})
function fillData(data) {
  let renderedTemplate;
  let template = $("#blog_template").html();

  let currentTime = new Date();
  let year = currentTime.getFullYear();
  let formattedTime;
  if(year == moment(data.createdAt).year()){
    formattedTime = moment(data.createdAt).format('HH:mm on DD-MMM');
  }else{
    formattedTime = moment(data.createdAt).format('HH:mm on DD-MMM-YYYY ');
  }
  if(data.featuredImage){
    renderedTemplate = Mustache.render(template, {
      blogid: data._id,
      title: data.title,
      featuredImage: data.featuredImage,
      imagePresent:true,
      body: data.bodysmall,
      createdAt: formattedTime,
      views: data.views,
      upvotes: data.upvotes,
      comments: data.comments
    });
  }else{
    renderedTemplate = Mustache.render(template, {
      blogid: data._id,
      title: data.title,
      featuredImage: data.featuredImage,
      imagePresent: false,
      body: data.bodysmall,
      createdAt: formattedTime,
      views: data.views,
      upvotes: data.upvotes,
      comments: data.comments
    });
  }

  $(".row-page").prepend(renderedTemplate);



}

function fillBlogList(data) {
  let renderedTemplate;
  let template = $("#blog_list_template").html();

  let currentTime = new Date();
  let year = currentTime.getFullYear();
  let formattedTime;
  if(year == moment(data.createdAt).year()){
    formattedTime = moment(data.createdAt).format('HH:mm on DD-MMM');
  }else{
    formattedTime = moment(data.createdAt).format('HH:mm on DD-MMM-YYYY ');
  }

  renderedTemplate = Mustache.render(template, {
    blogid: data._id,
    title: data.title,
    body: data.bodysmall,
    createdAt: formattedTime,
    views: data.views,
    upvotes: data.upvotes,
    comments: data.comments
  });
  $(".list-container").prepend(renderedTemplate);

}
