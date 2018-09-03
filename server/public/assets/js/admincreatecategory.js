  var categorypicker = $("#categorypicker");
  const categoryTemplate = $("#category_template").html();
  const categoryEditModeTemplate = $("#category_edit_mode_template").html();
  let renderedTemplate, sortedCategoriesGlobal;
$(document).ready(function(){

  $.ajax({
  	url: "/api/getallcategories",
  	type: "get",
  	success: (res) => {
      console.log(res);
      sortedCategoriesGlobal = getSortedCategories(res);
  		fillCategoreis(sortedCategoriesGlobal);
  	}
  })

  getCategories();

//   $('#categorypicker').on('change', function() {
//
//
//     var parentId= $(this).find("option:selected").val();
//
//     var parentName = $(this).find("option:selected").text();
//     var data = {
//       'parentId' : parentId
//     }
//     $.ajax({
//       url: "/admin/categories",
//       type: "post",
//       data: data,
//       success: (res) => {
//         if(jQuery.isEmptyObject(res)){
//
//         }else{
//           categorypicker.find('option').remove();
//           let subcategoriesArray = JSON.parse(res);
//           categorypicker.append($("<option />").val(parentId).text(parentName));
//           subcategoriesArray.forEach((elem) =>{
//               categorypicker.append($("<option />").val(elem._id).text(elem.categoryname));
//           });
//           categorypicker.append($("<option />").val(null).text('root'));
//         }
//         // res.forEach((elem) =>{
//         //   categorypicker.append($("<option />").val(elem.categoryname).text(elem.categoryname));
//         // });
//
//       },
//       error: (res) => {
//         alert("Internal server error");
//       },
//       complete: () => {
//
//       }
//     })
//
// })

});

function getSortedCategories(categories) {

  let sortedCategories = new Object();

  categories.forEach((category) => {
    if ("parentcategory" in category) {
      //its a clild
      if (!(category.parentcategory in sortedCategories)) {
        //parent does not exists
        sortedCategories[category.parentcategory] = new Object();
        sortedCategories[category.parentcategory].childs = new Array();
      }
      sortedCategories[category.parentcategory].childs.push(category);

    } else {
      //its a parent
      if (!(category.parentcategory in sortedCategories)) {
        //parent does not exists
        sortedCategories[category._id] = new Object();
        sortedCategories[category._id].childs = new Array();
      }
      sortedCategories[category._id].parent = category;

    }

  });

  return sortedCategories;
}

function fillCategoreis(sortedCategories) {

  $(".categories-wrapper").html("");

	for(let key in sortedCategories){
		renderedTemplate = Mustache.render(categoryTemplate, {
			parentCategoryName: sortedCategories[key].parent.categoryname,
			childs: sortedCategories[key].childs
		});

		$(".categories-wrapper").append(renderedTemplate);
	}
}

$("#create_category_button").click(() => {

  let parentId = $('#categorypicker').find(":selected").val();
  let parentName = $('#categorypicker').find(":selected").text();
  let categoryName = $('#categoryname').val();
  let description = $('#description').val();
  let data = {
    'parentId': parentId,
    'categoryname': categoryName,
    'description': description,
    'parentName': parentName
  };


  $.ajax({
    url: "/admin/createcategory",
    type: "post",
    data: data,
    success: (res) => {
      categorypicker.find('option').remove();
      getCategories();
      alert("Category created");
    },
    error: (res) => {
      alert("Internal server error");
    },
    complete: () => {
      window.location.reload();
    }
  })

})

function getCategories(){
  var data = {
    'parentId' : null
  }
  $.ajax({
    url: "/admin/categories",
    type: "post",
    data: data,
    success: (res) => {
      if(jQuery.isEmptyObject(res)){
        categorypicker.append($("<option />").val(null).text('root'));
      }else{
        let subcategoriesArray = JSON.parse(res);
        categorypicker.append($("<option />").val(null).text('root'));
        subcategoriesArray.forEach((elem) =>{
            categorypicker.append($("<option />").val(elem._id).text(elem.categoryname));
        });
      }
      // res.forEach((elem) =>{
      //   categorypicker.append($("<option />").val(elem.categoryname).text(elem.categoryname));
      // });

    },
    error: (res) => {
      alert("Internal server error");
    },
    complete: () => {

    }
  })
}

$("#edit_mode_toggle_button").on("click", function() {
  enableEditMode()
})


let selectedCategories = new Array();

$("#delete_button").on("click", function(argument) {
  ajaxForDelete(selectedCategories)
});

$("#cancel_button").on("click", function(argument) {
  $(".edit-mode").hide();
  $(".normal-mode").show();
  $(".edit-bar-text").html("All Categories");
  fillCategoreis(sortedCategoriesGlobal);
});

function addSelected(parentCategory) {
  if (!selectedCategories.includes(parentCategory)) {
    selectedCategories.push(parentCategory)
    $(`.sub-category-checkbox[parent=${parentCategory}]`)
      .prop('checked',true)
      .prop('disabled',true)
      .trigger("change");
  }
}

function removeSelected(parentCategory) {
  if (selectedCategories.includes(parentCategory)) {
    let index = selectedCategories.indexOf(parentCategory);
    selectedCategories.splice(index,1);
    $(`.sub-category-checkbox[parent=${parentCategory}]`)
    .prop('checked',false)
    .prop('disabled',false)
    .trigger("change");
  }
}


function enableEditMode() {
  $(".edit-bar-text").html("Edit Categories");
  $(".categories-wrapper").html("");

  console.log(sortedCategoriesGlobal)

  let renderedTemplate;
  for(let key in sortedCategoriesGlobal){
    renderedTemplate = Mustache.render(categoryEditModeTemplate, {
      parentCategoryId: sortedCategoriesGlobal[key].parent._id,
      parentCategoryName: sortedCategoriesGlobal[key].parent.categoryname,
      childs: sortedCategoriesGlobal[key].childs
    });
    $(".categories-wrapper").append(renderedTemplate);
  }

  $(".edit-mode").show();
  $(".normal-mode").hide();


  $(".category-checkbox").on("change", function() {
    if ($(this).is(":checked")) {
      addSelected($(this).attr("id"));
    } else {
      removeSelected($(this).attr("id"));
    }
    console.log(selectedCategories);
  })

  $(".sub-category-checkbox").on("change", function() {
    if ($(this).is(":checked")) {
      addSelected($(this).attr("id"));
    } else {
      removeSelected($(this).attr("id"));
    }
    console.log(selectedCategories)
  })

}

function ajaxForDelete(data) {
  let request = confirm('Warning: Deleting this category will delete all the threads, replies and comments inside it')
  if(request == true){
    $.ajax({
      url: "/api/admin/deletecategory",
      type: "post",
      contentType: "application/json",
      data: JSON.stringify(data),
      success: (res) => {

      },
      error: (res) => {
        alert("Internal Server error");
      },
      complete: () => {
        window.location.reload();
      }
    })
  }

}
