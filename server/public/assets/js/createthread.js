const categorypicker = $("#categorypicker");
const subcategorypicker = $("#subcategorypicker");
let parentId, parentName, subCategoryId, subCategoryName;
$(document).ready(function(){

  $('#rulesread').prop('checked', false); // Unchecks it

  getCategories();

  $('#rulesread').change(function() {
        if($(this).is(":checked")) {
          $('#category-section').fadeIn({queue: false, duration: 'slow'});
        }else{
          $('#category-section').fadeOut({queue: false, duration: 'slow'});
        }

    });

  $('#categorypicker').on('change', function() {
    $('.hidden-div').fadeOut({queue: false, duration: 'slow'});

    parentId = $(this).find("option:selected").val();
    parentName = $(this).find("option:selected").text();

    if (parentId == 0) {
      $("#subcategory_wrapper").hide();
      return;
    }

    getSubCategories(parentId, parentName);
    $('#path').html('/'+parentName);

    $("#subcategory_wrapper").show();
  })

  $('#subcategorypicker').on('change', function() {

    subCategoryId = $(this).find("option:selected").val();
    subCategoryName = $(this).find("option:selected").text();
    if (subCategoryId == 0) {
      $('.hidden-div').fadeOut({queue: false, duration: 'slow'});
      return;
    }

    $('#path').html('/'+parentName + '/' +subCategoryName);
    $('.hidden-div').fadeIn({queue: false, duration: 'slow'});

  })

})

$("#create_thread_button").click(() => {

  let tags = $('#thread_tags_input').val();
  let numTags = countWords(tags);
  let title = $("#thread_title_input").val();
  let body = textarea.getContent();
  if(tags && title && body){
    if(countWords(tags) < 6){
      let data = new Object();
      data.title = title;
      data.body = textarea.getContent();
      data.tags = tags;
      data.category = subcategorypicker.find("option:selected").val();

      data = JSON.stringify(data);
      $.ajax({
        url: "/api/createthread",
        type: "post",
        data: data,
        contentType: "application/json",
        success: (res) => {
          alert("Thread created successfully");
        },
        error: (res) => {
          alert("Internal server error");
        },
        complete: () => {
          $(location).attr("href","/threadlist/"+subCategoryId);
        }
      })
    }else{
      $('#thread_tags_input').val("").focus().blur().css("color","#ff0000").attr("placeholder", "Maximum allowed tags are 5");
    }
  }else{
    if(!tags){
      $('#thread_tags_input').val("").focus().blur().css("color","#ff0000").attr("placeholder", "Please enter atleast one tag");
    }else{
      if(!body){
        $('#thread_title_input').val("").focus().blur().css("color","#ff0000").attr("placeholder", "Body cannot be Empty");
      }else{
        if(!title){
          $('#thread_body_input').val("").focus().blur().css("color","#ff0000").attr("placeholder", "Title cannot be empty");
        }
      }
    }


  }



})

function getCategories(){
  var data = {
    'parentId' : null
  }
  $.ajax({
    url: "/api/categories",
    type: "post",
    data: data,
    success: (res) => {

      let categoriesArray = JSON.parse(res);
      categorypicker.append($("<option />").val(0).text("Choose.."));
      categoriesArray.forEach((category) =>{
          categorypicker.append($("<option />").val(category._id).text(category.categoryname));
      });
    },
    error: (res) => {
      alert("Internal server error");
    }
  })
}

function getSubCategories(parentId, parentName){
  var data = {
    'parentId' : parentId
  }
  $.ajax({
    url: "/api/subcategories",
    type: "post",
    data: data,
    success: (res) => {


      subcategorypicker.find('option').remove();

      let subcategoriesArray = res;
      subcategorypicker.append($("<option />").val(0).text("Choose.."));
      subcategoriesArray.forEach((elem) =>{
          subcategorypicker.append($("<option />").val(elem._id).text(elem.categoryname));
      });

    },
    error: (res) => {
      alert("Internal server error");
    }
  })
}

function countWords(str) {
  return str.trim().split(/\s+/).length;
}
