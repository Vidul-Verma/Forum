const displayThreadsPerPage = 10;
let checkedArray;
let hiddenParam;
let categoriesArrayGlobal;
const categoryPicker = $("#category_picker");
const subCategoryPicker = $("#sub_category_picker")
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
            views: threads[i].views,
            upvotes: threads[i].upvoteCount,
            title: threads[i].title,
            createdBy: threads[i].creatorUsername,
            lastReplyAt: formattedReplyTime,
            replyCount: threads[i].replycount,
            threadId: threads[i].compositeId
        });
        $("#thread_list").append(renderedTemplate);

        if(hiddenParam == '1011'){
          $('#' +  threads[i].compositeId + 'c').fadeIn('fast');
        }

        if(jQuery.inArray(threads[i].compositeId, checkedArray) !== -1){
          $('#' +  threads[i].compositeId + 'c').attr('checked','checked');
        }

        $('#' +  threads[i].compositeId + 'c').change(function() {

          let id = $(this).parent().parent().attr('id');

          if(this.checked) {

            if (!checkedArray.includes(id)) {
              checkedArray.push(id);
            }
            $('#move').fadeIn('slow');
            $("#thread_count").html(checkedArray.length)
            //AJAX FOR categoriesArrayGlobal IF NOT PRESENT
            if (categoriesArrayGlobal == null) {
              getCategories();
            }

          } else {

            checkedArray = jQuery.grep(checkedArray, function(entries) {
                    return entries != id;
            });

            $("#thread_count").html(checkedArray.length)
            if (checkedArray.length == 0) {
              $('#move').fadeOut('slow');
            }
          
          }

          console.log(checkedArray);

        });




    }
}

$(document).ready(function() {
  var pathArray = window.location.pathname.split( '/' );
  checkedArray = [];
  hiddenParam = $.trim(getCookie('a-auth'));
    $.ajax({
        url: "/api/getthreads/"+pathArray[pathArray.length-1]+'?pagethread=1' ,
        type: "get",
        success: function(res) {
          let data = JSON.parse(res);

          let divTitleLeft = document.createElement('div');
          divTitleLeft.className = 'pull-left';
          divTitleLeft.style.width = '50%';
          let divTitleRight= document.createElement('div');
          divTitleRight.className = 'pull-right';
          divTitleRight.style.width = '50%';
          let h1 = document.createElement("H1");
          let title = document.createTextNode(data.categoryName);
          h1.appendChild(title);
          divTitleLeft.appendChild(h1);
          let para = document.createElement('P');
          para.style.float = 'right';
          para.innerHTML = 'Threads: ' + data.threadCount + '&nbsp &nbsp Replies: ' + data.replies;

          divTitleRight.appendChild(para);
          $('#title').append(divTitleLeft);
          $('#title').append(divTitleRight);
          $("#category_description").html('');
          let description = document.createTextNode(data.description);
          $("#category_description").append(description);

            fillThreads(data.docs);
            let nPages = parseInt((data.threadCount - 1)/displayThreadsPerPage) + 1;
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


    categoryPicker.on('change', categoryPickerOnChangeHandler);
    subCategoryPicker.on('change', subCategoryPickerOnChangeHandler);
    $("#category_change_submit_button").on("click", categoryChangeButtonOnClickHandler);


});

function showPage(pageNum) {

  $("#"+activePage).removeClass("active");
  activePage = pageNum;
  $("#"+activePage).addClass("active");


  let urlArray = window.location.href.split("/");
  let thirdpart = urlArray[4].split('?');
  let url = "/api/getthreads/"+thirdpart[0]+ '?pagethread=' + pageNum;


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

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}


function getCategories(){
  var data = {
    'parentId' : null
  }
  $.ajax({
    url: "/api/categories",
    type: "post",
    data: data,
    success: (res) => {
      categoriesArrayGlobal = JSON.parse(res);

      categoryPicker.append($("<option />").val(0).text("Choose.."));
      categoriesArrayGlobal.forEach((category) =>{
          categoryPicker.append($("<option />").val(category._id).text(category.categoryname));
      });
    
    },
    error: (res) => {
      alert("Internal server error");
    }
  })
}


const categoryPickerOnChangeHandler = function() {
    parentId = $(this).find("option:selected").val();
    parentName = $(this).find("option:selected").text();
    
    subCategoryPicker.html($("<option />").val(0).text("Choose.."));
    
    if (parentId == 0) {
        $("#category_change_submit_button").hide();
        return;
    } else {
        getSubCategories(parentId, parentName);
    }
}

const subCategoryPickerOnChangeHandler = function() {
    parentId = categoryPicker.find("option:selected").val();
    subId = $(this).find("option:selected").val();
    console.log(subId)
    if (subId != "0") {
        $("#category_change_submit_button").show();
    } else {
        $("#category_change_submit_button").hide();
    }
}

const categoryChangeButtonOnClickHandler = function() {
    let data = {
        categoryId: subCategoryPicker.val(),
        threads: checkedArray
    }

    $.ajax({
        url: "/api/changecategory",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: (res) => {
            alert(`Category of ${checkedArray.length} thread(s) changed successfully`);
        },
        error: (res) => {
            alert("Internal server error");
        },
        complete: window.location.reload()
    })

}

function getSubCategories(parentId, parentName){
    var data = {
        'parentId' : parentId
    }

    subCategoryPicker.find('option').remove();
    
    $.ajax({
        url: "/api/subcategories",
        type: "post",
        data: data,
        success: (res) => {

          let subcategoriesArray = res;
          subCategoryPicker.append($("<option />").val(0).text("Choose.."));
          subcategoriesArray.forEach((elem) =>{
              subCategoryPicker.append($("<option />").val(elem._id).text(elem.categoryname));
          });

        },
        error: (res) => {
          alert("Internal server error");
        }
    })
}