const tagTemplate = $("#tag_template").html();
const categoryTemplate = $("#category_template").html();
let renderedTemplate;

function fillTags(tags) {
	tags.forEach((tag) => {
		renderedTemplate = Mustache.render(tagTemplate, {
			tagName: tag.tagName
		});
		$(".tags-wrapper").append(renderedTemplate);
	});
}

function fillCategoreis(categories) {

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
		console.log(sortedCategories);
	});

	for(let key in sortedCategories){
		renderedTemplate = Mustache.render(categoryTemplate, {
			parentCategoryName: sortedCategories[key].parent.categoryname,
			parentCategoryDescription: sortedCategories[key].parent.categorydescription,
			childs: sortedCategories[key].childs
		});

		$(".categories-wrapper").append(renderedTemplate);
	}
}

$.ajax({
	url: "api/getalltags",
	type: "get",
	success: (res) => {
		fillTags(res);
	}
})

$.ajax({
	url: "api/getallcategories",
	type: "get",
	success: (res) => {
		console.log(res);
		fillCategoreis(res);
	}
})
