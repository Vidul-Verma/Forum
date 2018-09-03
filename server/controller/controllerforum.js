const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
var sanitizeHtml = require('sanitize-html');



//CREATE A MONGOOSE,USER OBJ
var {mongoose} = require('.././db/mongoose');
var {User} = require('.././models/user');
const {UserChats} = require('./../models/userchat');
var {authenticateCookie} = require('.././middleware/authenticateCookie');
var {authenticateCookieAndPublic} = require('.././middleware/authenticateCookieAndPublic');
var {authenticateAdmin} = require('.././middleware/authenticateAdmin');
const {Thread} = require('./../models/thread');
const {Tags} = require('./../models/tags');
const {ThreadCategory} = require('./../models/threadcategory');
const {Reply} = require('./../models/reply');
const {Blog} = require('./../models/blog');
const {BlogComments} = require('./../models/blogcomments');
const repliesPerPage = 10;
const threadsPerPage = 10;
const allowedUserTypes = ["alumni", "student", "guest"];
var urlEncodedParser = bodyParser.urlencoded({extended: false});


const blogImageUploadPath = path.join(__dirname + '/../public/uploads');

const storage = multer.diskStorage({
  destination: blogImageUploadPath,
  filename: function(req, file, cb) {
    cb(null,Date.now() + randomString(10) + path.extname(file.originalname));
  }
});

function randomString(length) {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

const uploadBlogImage = multer({
  storage: storage,
  limits: {
    fileSize: 10000000
  },
  fileFilter: function(req, file, cb) {
    checkFileType(file,cb)
  }
}).single("featuredImage")

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|svg/;
  const extnamePass = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetypePass = filetypes.test(file.mimetype);

  if (!file) {
  	cb("nofile")
  } else if (!extnamePass || !mimetypePass) {
    cb("noimage");
  } else {
    cb(null, true);
  }
}


module.exports = function(app, port) {

	app.get('/forum', (req, res) => {
    	res.render("forumindex");
	});

	app.get('/blogs', (req, res) => {
    	res.render("blogs");
	});

	app.get('/blogpost', (req, res) => {
    	res.render("openedblog");
	});

	app.get('/admin/dashboard', authenticateAdmin, (req, res) => {
    	res.render("admindashboard");
	});

	app.get('/admin/blog', authenticateAdmin, (req, res) => {
			res.render("adminblog");
	});


	app.get('/admin/createcategory', authenticateAdmin, (req, res) => {
		res.render("admincreatecategory");
	});

	app.get('/admin/forumusers', authenticateAdmin, (req, res) => {
		res.render("admin_forumusers");
	});

	app.get('/admin/enquiry', authenticateAdmin, (req, res) => {
		res.render("admin_enquiry");
	});

	app.get('/search', (req, res) => {
			res.render("search");
	});

	app.get('/threadlist/:categoryId', authenticateCookieAndPublic, (req, res) => {

    	res.render("threadlist", {
    		loggedIn: req.loggedIn
    	});
	});

	app.get('/createthread', authenticateCookie, (req, res) => {
		res.render("createthread");
	});

	app.get("/categories-tags",(req, res) => {
		res.render("categoriestags");
	})

app.post('/admin/categories', [authenticateAdmin, urlEncodedParser] , (req, res) => {

	ThreadCategory.find({'parentcategory': { "$exists" : false }}, {'categoryname': 1, '_id': 1}).then((docs) =>{
		if(!docs || typeof(docs) == 'undefined' || docs.length == 0){
			res.json({});
		}else{
			res.json(JSON.stringify(docs));
		}


	}).catch((err)=>{console.log('***********' + err);})

});

	app.post('/admin/subcategories', [authenticateAdmin, urlEncodedParser] , (req, res) => {

		if(req.body.parentId){
			ThreadCategory.find({'parentcategory': req.body.parentId}, {'categoryname': 1, '_id': 1}).then((docs) =>{
				if(!docs || typeof(docs) == 'undefined' || docs.length == 0){
					res.json({});
				}else{
					res.json(JSON.stringify(docs));
				}


			}).catch((err)=>{console.log('***********' + err);})
		}
		// else{
		// 	ThreadCategory.find({'parentcategory': { "$exists" : false }}, {'categoryname': 1, '_id': 1}).then((docs) =>{
		// 		if(!docs || typeof(docs) == 'undefined' || docs.length == 0){
		// 			res.json({});
		// 		}else{
		// 			res.json(JSON.stringify(docs));
		// 		}
		//
		//
		// 	}).catch((err)=>{console.log('***********' + err);})
		// }


	});

	app.post('/admin/createcategory', [authenticateAdmin, urlEncodedParser] , (req, res) => {
		let threadCategory;

		if(req.body.parentId){
			 threadCategory = new ThreadCategory({
				categoryname: req.body.categoryname,
				parentcategory: req.body.parentId,
				parentcategoryName: req.body.parentName,
				categorydescription: req.body.description
			});
			threadCategory.save().then((doc) => {
				res.sendStatus(200);
			}).catch((err) => {
				console.log(err)
				res.sendStatus(500);
			});
		}else{

			threadCategory = new ThreadCategory({
				categoryname: req.body.categoryname,
				categorydescription: req.body.description
			});
			threadCategory.save().then((doc) => {
				let defaultCategory = new ThreadCategory({
					categoryname: 'General Discussions',
					parentcategory: doc._id,
					categorydescription: 'All general threads for this category should be posted here'
				});
				defaultCategory.save().then((doc) =>{
					return Promise.resolve();
				})
				res.sendStatus(200);
			}).catch((err) => {
				console.log(err)
				res.sendStatus(500);
			});
		}




	});

  app.post('/api/admin/deletecategory', [authenticateAdmin, urlEncodedParser] , (req, res) => {
  	//NOT WORKING AS INTENED - NEEDS MORE WORKING
  	console.log(req.body);

      ThreadCategory.find({
      	$or: [
      		{
      			_id: {
      				$in: req.body
      			}
      		},
      		{
      			parentcategory: {
      				$in: req.body
      			}
      		}
      	]

      }).remove().then((categories) => {
      	// res.json(doc)
      		console.log("CATEGORY")
      		console.log(categories)

      		Thread.find({
      			category: {
      				$in: req.body
      			}
      		},{
      			_id: 1

       		}).then((threads) => {
      			console.log("THREAD")
      			console.log(threads)
      			let threadIds = new Array();
      			threads.forEach((thread) => {
      				threadIds.push(thread._id);
      			});
      			Reply.find({
      				threadId: {
      					$in: threadIds
      				}
      			}).remove().then((replies) => {

      				console.log("REPLY")
      				console.log(replies);

      				Thread.find({
		      			_id: {
		      				$in: threadIds
		      			}
		      		}).remove().then((result) => {
		      			console.log(result)
      					res.sendStatus(200);
      					console.log("DONE")
      					return Promise.resolve();
		      		}).catch((err) => {
				        console.log(err);
				     	res.sendStatus(500);
				    });

      				return Promise.resolve();
      			}).catch((err) => {
			        console.log(err);
			     	res.sendStatus(500);
			    });
      			return Promise.resolve();
      		}).catch((err) => {
		        console.log(err);
		     	res.sendStatus(500);
		    });
		return Promise.resolve();
      }).catch((err) =>{
        console.log(err);
		res.sendStatus(500);
      });


  });






	app.post('/api/categories', urlEncodedParser , (req, res) => {

		ThreadCategory.find({'parentcategory': { "$exists" : false }}, {'categoryname': 1, '_id': 1}).then((docs) =>{
			if(!docs || typeof(docs) == 'undefined' || docs.length == 0){
				res.json({});
			}else{
				res.json(JSON.stringify(docs));
			}


		}).catch((err)=>{console.log('***********' + err);})

	});


	app.post('/api/subcategories', urlEncodedParser , (req, res) => {


		if(req.body.parentId){
			ThreadCategory.find({'parentcategory': req.body.parentId}).then((docs) =>{
				if(!docs || typeof(docs) == 'undefined' || docs.length == 0){
					res.json({'error': 'categoryempty'});
				}else{
					res.json(docs);
				}


			}).catch((err)=>{console.log('***********' + err);})
		}

	});

	app.post('/api/createthread', authenticateCookie, (req, res) => {
		// console.log(req.user);
		let tagsArray;
		if(req.body.tags){
			tagsArray = req.body.tags.split(' ');
		}else{
			tagsArray = null;
		}

		let sanitizedBody = sanitizeHtml(req.body.body, {
			allowedTags: ["b","div","i","u","font","blockquote","sup","hr","img","sub","ul","br","ol","li","h1"],
			allowedAttributes: false
		})

		ThreadCategory.findOne({'_id': req.body.category}, { '_id': 1, 'categoryname': 1}).then((doc) =>{
			console.log(doc.categoryname);
			let thread = new Thread({
				title: req.body.title,
				body: sanitizedBody,
				category: doc._id,
				categoryName: doc.categoryname,
				createdAt: Date.now(),
				lastReplyAt: Date.now(),
				creatorId: req.user._id,
				creatorUsername: req.user.username,
				tags:tagsArray,
				compositeId: req.body.title.replace(/[^\w\s]/gi, '').split(/[\s]+/).join('-') + '-' + Date.now().toString(),
				avatar: req.user.avatar
			});

      User.findOneAndUpdate({'_id': req.user._id}, {$inc : {'posts' : 1}}).then(() =>{
        return Promise.resolve();
      })

			thread.save().then((doc) => {

				//ADD TO TAGS COLLECTION
				tagsArray.forEach((tag) =>{

					Tags.findOneAndUpdate({
						tagName: tag
					},{
						$addToSet: {
							threadIds: doc._id,
							tagCreators: req.user._id,
							tagCreatorsNames: req.user.username
						}
					}).then((result) => {
						if(!result){
							let tags = new Tags({
								tagName: tag,
								tagCreators: req.user._id,
								tagCreatorsNames: req.user.username,
								threadIds:[doc._id]
							});
							tags.save().then((elem) => {
								return Promise.resolve();
							});
						}
						return Promise.resolve();
					}).catch((err) =>{

						console.log(err);
						return Promise.reject();
					});
				});


				//THREAD COUNT
				ThreadCategory.findOne({'_id': doc.category}).then((threadCategory) =>{
					threadCategory.threadcount = threadCategory.threadcount + 1;
					threadCategory.save().then((elem) => {
						if(elem.parentcategory){
							ThreadCategory.findOneAndUpdate({'_id': elem.parentcategory}, {$inc : {'threadcount' : 1}}).then(() =>{
								return Promise.resolve();
							});
						}

						return Promise.resolve();
					});
				}).catch((err) =>{
					console.log(err);
				});
				res.sendStatus(200);
				return Promise.resolve();
			});
		}).catch((err) =>{
			console.log(err);
		});




	});

  app.post('/api/admin/closethread/:id', authenticateAdmin, (req, res) => {
    Thread.findOneAndUpdate({'compositeId': req.params.id}, {'closed': true}).then((doc) =>{
      res.sendStatus(200)
      return Promise.resolve();
    }).catch((err) =>{
      res.sendStatus(401);
      console.log(err);
    })
  })

  app.post('/api/admin/openthread/:id', authenticateAdmin, (req, res) => {
    Thread.findOneAndUpdate({'compositeId': req.params.id}, {'closed': false}).then((doc) =>{
      res.sendStatus(200)
      return Promise.resolve();
    }).catch((err) =>{
      res.sendStatus(401);
      console.log(err);
    })
  })



	app.get('/api/getthreads/:categoryId', (req, res) => {

		if(req.query.pagethread){
			Thread.find({'category': mongoose.Types.ObjectId(req.params.categoryId)},{_id: 0, __v: 0}).sort({lastReplyAt: -1})
			.skip(threadsPerPage*(req.query.pagethread - 1))
			.limit(threadsPerPage)
			.then((docs) => {

				ThreadCategory.findOne({'_id': mongoose.Types.ObjectId(req.params.categoryId)}).then((category) =>{

					var data = {
						docs: docs,
						threadCount: category.threadcount,
							categoryName: category.categoryname,
						  description: category.categorydescription,
							replies:category.posts
					};
					res.json(JSON.stringify(data));
				});


			});

		}else{
			Thread.find({'category': mongoose.Types.ObjectId(req.params.categoryId)},{_id: 0, __v: 0}).sort({lastReplyAt: -1}).then((docs) => {

				ThreadCategory.findOne({'_id': mongoose.Types.ObjectId(req.params.categoryId)}).then((category) =>{

					var data = {
						docs: docs,
						threadCount: category.threadcount,
						categoryName: category.categoryname
					};
					res.json(JSON.stringify(data));
				});

			}).catch((err) => {
				console.log(err);
				res.sendStatus(500);
			})
		}

	});

	app.get('/thread/:threadCompositeId', authenticateCookieAndPublic,(req, res) => {

			res.render("threadview", {
				loggedIn: req.loggedIn
			});
			Thread.findOneAndUpdate({'compositeId': req.params.threadCompositeId}, {$inc : {'views' : 1}}).then(() =>{
				return Promise.resolve();
			});

	});

	app.get('/api/getthreadandreplies/:threadCompositeId', authenticateCookieAndPublic, (req,res) => {
		let threadBookmarked = false;
		Thread.findOne({
			compositeId: req.params.threadCompositeId
		}).then((thread) => {
			if (!thread) {
				res.sendStatus(404);

			} else {
				if(req.user){
					if(req.user.bookmarkThreadIds){
						if(req.user.bookmarkThreadIds.includes(thread.compositeId)){
							threadBookmarked =true;
						}
					}
				}
				Reply.find({'threadId': thread._id},{threadId: 0, __v: 0})
					.skip(repliesPerPage*(req.query.page - 1))
					.limit(repliesPerPage)
					.lean()
					.then((replies) =>{
						let tempReplies = replies;

						if(replies){
							thread = thread.toObject();
							delete thread._id;
							delete thread.__v;
							thread.upvoteCount = thread.upvoteUsernames.length;
							if (req.user) {
								if (thread.upvoteUsernames.includes(req.user.username)){
									thread.upvoted = true;
								}else{
									thread.upvoted = false;
								}

								tempReplies.forEach((reply) =>{

									if (reply.upvoteUsernames.includes(req.user.username)){
										reply.upvoted = true;
									}else{
										reply.upvoted = false;
									}
									console.log('************' + req.user.bookmarkReplyIds +' = ' + reply._id);
									if(req.user.bookmarkReplyIds.indexOf(reply._id) > -1){
										reply.replyBookmarked = true;
										console.log('i am in');
									}else{
										reply.replyBookmarked = false;
									}
									reply.voteCount = reply.upvoteUsernames.length;
								});

							} else {
								tempReplies.forEach((reply) =>{
									reply.voteCount = reply.upvoteUsernames.length;
								});
							}
							delete thread.upvoteUsernames;

							let result = {
								thread: thread,
								replies: tempReplies,
								threadBookmarked: threadBookmarked
							}

							res.send(JSON.stringify(result));
							return  Promise.resolve();
						}else{
							return  Promise.reject();
						}

				});
			}
		}).catch((err) => {
			res.sendStatus(500);
		});

	});

	app.post("/api/createreply", authenticateCookie, (req,res) => {

		let sanitizedBody = sanitizeHtml(req.body.body, {
			allowedTags: ["b","div","i","u","font","blockquote","sup","hr","img","sub","ul","br","ol","li","h1"],
			allowedAttributes: false
		})
		
		Thread.findOne({
			compositeId: req.body.threadId
		}).then((thread) => {

      if(!thread.closed){
        let reply = new Reply({
  				threadId: thread._id,
  				threadTitle: thread.title,
  				body: sanitizedBody,
  				replyNumber: thread.replycount + 1,
  				creatorId: req.user._id,
  				creatorUsername: req.user.username,
  				creatorType: req.user.typeOfUser,
  				createdAt: Date.now(),
  				avatar: req.user.avatar
  			});
  			reply.save().then((doc) => {
  				let resData = {
  					replycount: thread.replycount + 1
  				}
  				res.send(resData);
  				thread.lastReplyAt = doc.createdAt;
  				thread.lastReplyBy = req.user.username;
  				thread.replycount = thread.replycount + 1;

          User.findOneAndUpdate({'_id': req.user._id}, {$inc : {'posts' : 1}}).then(() =>{
            return Promise.resolve();
          })

  				thread.save().then((doc)=>{
  					return Promise.resolve();
  				});



  				ThreadCategory.findOne({'_id': thread.category}).then((threadCategory) =>{
  					threadCategory.posts = threadCategory.posts + 1;
  					threadCategory.save().then((elem) => {
  						if(elem.parentcategory){
  							ThreadCategory.findOneAndUpdate({'_id': elem.parentcategory}, {$inc : {'posts' : 1}}).then(() =>{
  								return Promise.resolve();
  							});
  						}

  						return Promise.resolve();
  					});
  				}).catch((err) =>{
  					console.log(err);
  				});
  				return Promise.resolve();
  			});
      }else{
        res.sendStatus(401)
        return Promise.resolve();
      }


		}).catch((err) => {

			console.log(err);
			res.sendStatus(500);
		});



	});

	app.post("/api/createcomment", [authenticateCookie, urlEncodedParser], (req,res) => {
		let comment = req.body.commentData;
		let createdAt = new Date();
		let creatorId = req.user._id;
		let creatorUsername = req.user.username;
		Reply.findOne({'_id': req.body.replyId}).then((reply) =>{

			let commentDoc = {comment, createdAt,creatorUsername, creatorId};
			reply.comments = reply.comments.concat([commentDoc]);
			reply.save().then((updatedDoc)=>{
				res.send(updatedDoc.comments.pop());
			});

		}).catch((err) =>{
			res.sendStatus(500)
			console.log(err);})
		// chatRoom.msg = chatRoom.msg.concat([{msg, createdAt, direction}]);
	});

	app.post("/api/upvotethread",authenticateCookie, (req, res) => {
		console.log(req.body)
		if(req.user.username){
			Thread.findOneAndUpdate({
				compositeId: req.body.threadId
			},{
				$addToSet: {
					upvoteUsernames: req.user.username
				}
			},{
				new: true
			}).then((result) => {

        User.findOneAndUpdate({'_id': result.creatorId}, {$inc: {'votes': 1}}).then(()=>{
          return Promise.resolve();
        })
				result.upvoteCount = result.upvoteUsernames.length;
				result.save().then(()=>{
					res.sendStatus(200);
					return Promise.resolve();
				})
				return Promise.resolve();
			}).catch((err) =>{
				res.sendStatus(500)
				console.log(err);
			});
		}

	});

	app.post("/api/downvotethread",authenticateCookie, (req, res) => {
		if(req.user.username){
			Thread.findOneAndUpdate({
				compositeId: req.body.threadId
			},{
				$pullAll: {
					upvoteUsernames: [req.user.username]
				}
			},{
				new: true
			}).then((result) => {
        User.findOneAndUpdate({'_id': result.creatorId}, {$inc: {'votes': -1}}).then(()=>{
          return Promise.resolve();
        })
				result.upvoteCount = result.upvoteUsernames.length;
				result.save().then(()=>{
					res.sendStatus(200);
					return Promise.resolve();
				})
				return Promise.resolve();
			}).catch((err) =>{
				res.sendStatus(500)
				console.log(err);
			});
		}

	});

	app.post("/api/upvotereply",authenticateCookie, (req, res) => {
		console.log(req.body)
		if(req.user.username){
			Reply.findOneAndUpdate({
				'_id': req.body.replyId
			},{
				$addToSet: {
					upvoteUsernames: req.user.username
				}
			},{
        new: true
      }).then((result) => {
        User.findOneAndUpdate({'_id': result.creatorId}, {$inc: {'votes': 1}}).then(()=>{
          return Promise.resolve();
        })
				res.sendStatus(200);
			}).catch((err) =>{
				res.sendStatus(500)
				console.log(err);
			});
			}
		});


		app.post("/api/downvotereply",authenticateCookie, (req, res) => {
			if(req.user.username){
				Reply.findOneAndUpdate({
					'_id': req.body.replyId
				},{
					$pullAll: {
						upvoteUsernames: [req.user.username]
					},
				},{
          new: true
        }).then((result) => {
          User.findOneAndUpdate({'_id': result.creatorId}, {$inc: {'votes': -1}}).then(()=>{
            return Promise.resolve();
          })
					res.sendStatus(200);
				}).catch((err) =>{
					res.sendStatus(500)
					console.log(err);
				});
			}

		});

		app.get("/api/getthreadstags/:tag", (req, res) => {

				Tags.findOne({'tagName': req.params.tag}).then((tag) => {
					Thread.find({ '_id': { $in: tag.threadIds } }, {'creatorId':0, '_id':0}).sort({lastReplyAt: -1})
					.skip(threadsPerPage*(req.query.pagethread - 1))
					.limit(threadsPerPage).then((threads)=> {
						let data ={
							docs: threads,
							totalThreads: tag.threadIds.length
						}
						res.json(JSON.stringify(data));
						return Promise.resolve();
					})
					return Promise.resolve();
				}).catch((err) =>{
					res.sendStatus(500)
					console.log(err);
				});


		});

		app.get('/threadlisttags/:tag', authenticateCookieAndPublic, (req, res) => {

	    	res.render("threadlisttags", {
	    		loggedIn: req.loggedIn
	    	});
		});

		app.get('/api/getrecentactivitythreads', (req, res) =>{
			let limit =10;
			if(req.query.limit){
				limit = parseInt(req.query.limit);
			}
			Thread.find({},{
				_id: 0,
				__v: 0,
				body: 0,
				creatorId: 0
			}).sort({'lastReplyAt': -1}).limit(limit).then((threads) =>{
				res.json(threads);
			})
		});

		app.get('/api/getrecentrepliesthreads', (req, res) =>{
			let limit =10;
			if(req.query.limit){
				limit = parseInt(req.query.limit);
			}
			Thread.find({
				'replycount': {'$gt': 0}
			},{
				_id: 0,
				__v: 0,
				body: 0,
				creatorId: 0
			}).sort({'lastReplyAt': -1}).limit(limit).then((threads) =>{
				res.json(threads);
			})
		});

		app.get('/api/getnewthreads', (req, res) =>{
			let limit =10;
			if(req.query.limit){
				limit = parseInt(req.query.limit);
			}
			Thread.find({},{
				_id: 0,
				__v: 0,
				body: 0,
				creatorId: 0
			}).sort({'createdAt': -1}).limit(limit).then((threads) =>{
				res.json(threads);
			})
		});

		app.get('/api/getmostupvotedthreads', (req, res) =>{
			let limit =10;
			if(req.query.limit){
				limit = parseInt(req.query.limit);
			}
			Thread.find({},{
				_id: 0,
				__v: 0,
				body: 0,
				creatorId: 0
			}).sort({'upvoteCount': -1}).limit(limit).then((threads) =>{
				res.json(threads);
			})
		});

		app.get('/sortedthreads', (req, res) =>{
			res.render("sortedthreads");
		});

		app.post('/api/deletethread', authenticateCookie, (req, res)=>{
			Thread.find({'compositeId': req.query.threadId, 'creatorUsername': req.user.username}).remove().then(() => {
				res.sendStatus(200);
				return Promise.resolve();

			}).catch(()=>{
				res.sendStatus(404);
				return Promise.reject();
			})
		});

    app.post('/api/admin/deletethread', authenticateAdmin, (req, res)=>{
			Thread.find({'compositeId': req.query.threadId}).remove().then(() => {
				res.sendStatus(200);
				return Promise.resolve();

			}).catch(()=>{
				res.sendStatus(404);
				return Promise.reject();
			})
		});

		app.post('/api/deletereply', authenticateCookie, (req, res)=>{
			Reply.update({'_id': req.query.replyId, 'creatorUsername': req.user.username},{'replyDeleted': true, 'body':'deleted'}).then(() => {
				res.sendStatus(200);
				return Promise.resolve();

			}).catch(()=>{
				res.sendStatus(404);
				return Promise.reject();
			})
		});

    app.post('/api/admin/deletereply', authenticateAdmin, (req, res)=>{
			Reply.update({'_id': req.query.replyId},{'replyDeleted': true, 'body':'deleted'}).then(() => {
				res.sendStatus(200);
				return Promise.resolve();

			}).catch(()=>{
				res.sendStatus(404);
				return Promise.reject();
			})
		});

		app.post('/api/deletecomment', authenticateCookie, (req, res) => {
			console.log(req.body)
			Reply.update({
				'_id': req.body.replyId,
        'creatorId': req.user._id
			},{
					$pull: { comments: { _id: req.body.commentId } }
			}).then((result) => {
				console.log(result);
				res.sendStatus(200);
				return Promise.resolve();

			}).catch((err)=>{
				res.sendStatus(404);
				console.log(err);
				return Promise.reject();
			});
		});

    app.post('/api/admin/deletecomment', authenticateAdmin, (req, res) => {
			Reply.update({
				_id: req.body.replyId
			},{
					$pull: { comments: { _id: req.body.commentId } }
			}).then((result) => {
				console.log(result);
				res.sendStatus(200);
				return Promise.resolve();

			}).catch((err)=>{
				res.sendStatus(404);
				console.log(err);
				return Promise.reject();
			});
		});

		app.get('/api/getallcategories', (req, res) =>{

			ThreadCategory.find({}, {  '__v': 0})
			.then((categories) =>{
				res.json(categories);
				return Promise.resolve();
			}).catch((err) =>{
				console.log(err);
				return Promise.reject();
			})
		});

		app.get('/api/getalltags', (req, res) =>{

			Tags.find({}, {'threadIds':0,  '__v': 0})
			.then((categories) =>{
				res.json(categories);
				return Promise.resolve();
			}).catch((err) =>{
				console.log(err);
				return Promise.reject();
			})
		});

		app.get('/api/getmyreplies/:username', (req, res) =>{

			Reply.find({'creatorUsername': req.params.username},{'comments':0, 'upvoteUsernames': 0, 'body':0, 'creator_id':0})
			.then((replies) =>{
				res.json(replies);
				return Promise.resolve();
			}).catch((err) =>{
				console.log(err);
			})
		});

		app.get('/api/getmythreads/:username', (req, res) =>{
			Thread.find({'creatorUsername': req.params.username},{'_id':0, 'comments':0, 'upvoteUsernames': 0, 'body':0, 'creator_id':0,'upvoteUsernames':0, 'tags':0})
			.then((threads) =>{
				res.json(threads);
				return Promise.resolve();
			}).catch((err) =>{
				console.log(err);
			})
		});

    app.get('/api/getmybookmarkedthreads/:username', (req, res) =>{
      if(req.params.username){
        User.findOne({'username': req.params.username}).then((user) =>{
          Thread.find({'compositeId': { $in: user.bookmarkThreadIds } },{'_id':0, 'comments':0, 'upvoteUsernames': 0, 'body':0, 'creator_id':0,'upvoteUsernames':0, 'tags':0})
    			.then((threads) =>{
    				res.json(threads);
    				return Promise.resolve();
    			}).catch((err) =>{
    				console.log(err);
    			})
          return Promise.resolve();
        }).catch((err) =>{
          console.log(err);
        })
      }else{
        res.sendStatus(404);
      }

		});

    app.get('/api/getmybookmarkedreplies/:username', (req, res) =>{
      if(req.params.username){
        User.findOne({'username': req.params.username}).then((user) =>{
          Reply.find({'_id': { $in: user.bookmarkReplyIds } },{'comments':0, 'upvoteUsernames': 0, 'body':0, 'creator_id':0,'upvoteUsernames':0, 'tags':0})
    			.then((replies) =>{
    				res.json(replies);
    				return Promise.resolve();
    			}).catch((err) =>{
    				console.log(err);
    			})
          return Promise.resolve();
        }).catch((err) =>{
          console.log(err);
        })
      }else{
        res.sendStatus(404);
      }

		});

		app.get('/api/getmytags/:username', (req, res) =>{
			Tags.find({'tagCreatorsNames': req.params.username})
			.then((tags) =>{
				res.json(tags);
				return Promise.resolve();
			}).catch((err) =>{
				console.log(err);
			})
		});

		app.get('/api/getsiblandparentcategories/:categoryId', (req, res) => {
			ThreadCategory.findOne({
				_id: req.params.categoryId
			}).then((category) => {
				ThreadCategory.find({
					parentcategory: category.parentcategory
				}).then((categories) => {

					ThreadCategory.findOne({
						_id: category.parentcategory
					}).then((parentCategory) => {
						let result = {
							category: parentCategory,
							subCategories: categories
						}
						res.send(result);
					})

				})
			})
		});

		app.post("/addbookmarkedthread/:threadId",authenticateCookie, (req, res) => {
			if(req.user._id){
				User.update({
					'_id': req.user._id
				},{
					$addToSet: {
						bookmarkThreadIds: req.params.threadId
					}
				}).then((result) => {
					res.sendStatus(200);
				}).catch((err) =>{
					res.sendStatus(500)
					console.log(err);
				});
			}

		});

		app.post("/removebookmarkedthread/:threadId",authenticateCookie, (req, res) => {
			if(req.user._id){
				User.update({
					'_id': req.user._id
				},{
					$pullAll: {
						bookmarkThreadIds: [req.params.threadId]
					}
				}).then((result) => {
					res.sendStatus(200);
				}).catch((err) =>{
					res.sendStatus(500)
					console.log(err);
				});
			}

		});

		app.post("/addbookmarkedreply/:replyId",authenticateCookie, (req, res) => {
			if(req.user._id){
				User.update({
					'_id': req.user._id
				},{
					$addToSet: {
						bookmarkReplyIds: req.params.replyId
					}
				}).then((result) => {
					res.sendStatus(200);
				}).catch((err) =>{
					res.sendStatus(500)
					console.log(err);
				});
			}

		});

		app.post("/removebookmarkedreply/:replyId",authenticateCookie, (req, res) => {
			if(req.user._id){
				User.update({
					'_id': req.user._id
				},{
					$pullAll: {
						bookmarkReplyIds: [req.params.replyId]
					}
				}).then((result) => {
					res.sendStatus(200);
				}).catch((err) =>{
					res.sendStatus(500)
					console.log(err);
				});
			}

		});

		app.post("/admin/createblog",authenticateAdmin, (req, res) => {


			uploadBlogImage(req, res, (err) => {
				console.log("LJFSLJLJL "+err)
				if (err) {
					console.log(err);
					res.status(400);
					if (err === "noimage") {
						res.send("File was not an image");
					} else {
						res.send("ERROR");
					}
				} else {
					console.log('BLOG IMAGE UPLOADED');

					let blog = new Blog({
						title: req.body.title,
						body: req.body.body,
						bodysmall: req.body.bodysmall,
						createdAt: Date.now(),
						featuredImage: req.file.filename
				 	});

					blog.save().then(()=>{
						res.sendStatus(200);
						return Promise.resolve();
					}).catch((err) =>{
						if(err){
							res.sendStatus(404);
						}
					})
				}
			})

		});

		app.post("/admin/createblognoimage",authenticateAdmin, (req, res) => {

			let blog = new Blog({
				title: req.body.title,
				body: req.body.body,
				bodysmall: req.body.bodysmall,
				createdAt: Date.now()
		 	});

			blog.save().then(()=>{
				res.sendStatus(200);
				return Promise.resolve();
			}).catch((err) =>{
				console.log(err)
				res.sendStatus(500);
			})

		});

    app.post("/admin/deleteblog/:id",authenticateAdmin, (req, res) => {

      Blog.findOne({'_id': req.params.id}).remove().then((doc) =>{
        if(doc){
          res.sendStatus(200);
        }else{
          sendStatus(404);
        }
        return Promise.resolve();
      }).catch((err) =>{
        console.log(err);
      })

    });

		app.get("/api/getbloglist", (req, res) => {

			Blog.find({}, {'body' : 0, '__v' :0}).sort({'createdAt': -1}).limit(8).then((docs) =>{
				res.json(docs);
				return Promise.resolve();
			}).catch((err) =>{
				res.sendStatus(500);
			})
		});

    app.get("/api/getbloglist/all", (req, res) => {

			Blog.find({}, {'body' : 0, '__v' :0}).sort({'createdAt': -1}).skip(8).then((docs) =>{
				res.json(docs);
				return Promise.resolve();
			}).catch((err) =>{
				res.sendStatus(500);
			})
		});

		app.get("/api/getblog", authenticateCookieAndPublic, (req, res) => {

			Blog.findOneAndUpdate({'_id': req.query.blogid}, {$inc : {'views' : 1}},{new: true}).then((doc) =>{
				let data = {
					doc,
					loggedIn: req.loggedIn
				};
				res.json(data);
				return Promise.resolve();
			}).catch((err) =>{
				res.sendStatus(500);
			})
		});

		app.post("/api/upvoteblog", authenticateCookie, (req, res) => {

			Blog.findOneAndUpdate({
				_id: req.body.blogId,
			},{
				$addToSet: {
					upvoteUsernames: req.user.username
				}
			},{
				new: true
			}).then((result) => {
				result.upvotes = result.upvoteUsernames.length;
				result.save().then(()=>{
					res.sendStatus(200);
					return Promise.resolve();
				})
				return Promise.resolve();
			}).catch((err) => {
				res.sendStatus(500)
				console.log(err);
			});

		});

		app.post("/api/downvoteblog", authenticateCookie, (req, res) => {

			Blog.findOneAndUpdate({
				_id: req.body.blogId,
			},{
				$pullAll: {
					upvoteUsernames: [req.user.username]
				}
			},{
				new: true
			}).then((result) => {
				result.upvotes = result.upvoteUsernames.length;
				result.save().then(()=>{
					res.sendStatus(200);
					return Promise.resolve();
				})
				return Promise.resolve();
			}).catch((err) => {
				res.sendStatus(500)
				console.log(err);
			});

		});

		app.post("/api/blog/createcomment", authenticateCookie, (req, res) => {

			let blogComment = new BlogComments({
				blogId: req.query.blogId,
			 comment: req.body.comment,
			 creatorId: req.user._id,
			 creatorUsername: req.user.username,
			 	avatar : req.user.avatar,
			 createdAt: Date.now()
		 });

		 blogComment.save().then(()=>{
			 res.sendStatus(200);
			 return Promise.resolve();
		 }).catch((err) =>{
			 if(err){
				 res.sendStatus(404);
			 }
		 })
		 Blog.findOneAndUpdate({'_id': req.query.blogId}, {$inc : {'comments' : 1}}).then(() =>{
		 	return Promise.resolve();
		}).catch((err) =>{
			if(err){
				console.log(err);
			}
		});
		});

		app.post("/api/blog/deleteblogcomment", authenticateCookie, (req, res) => {

			BlogComments.findOne({'creatorId': req.user._id, '_id': req.body.commentId}).remove().then(() =>{
				res.sendStatus(200);
				return Promise.resolve();
			}).catch((err) =>{
				console.log(err);
				res.sendStatus(404);
			})

		});

		app.get("/api/blog/getcomments", authenticateCookieAndPublic, (req, res) => {


		 BlogComments.find({'blogId': req.query.blogid}, {'creatorId': 0}).then((docs) =>{

				 let data = {
					 docs:docs,
					 loggedIn: req.loggedIn
				 }

			 res.json(data);
			 return Promise.resolve();
		 }).catch((err) =>{
			 if(err){
				 console.log(err);
				 res.sendStatus(500);
			 }
		 })

	 });

	 app.get("/api/search", (req, res) => {
		Thread.find(
		        { $text : { $search : req.query.search } },
		        { score : { $meta: "textScore" } }
		    ).then((allResults) => {

			    Thread.find(
			        { $text : { $search : req.query.search } },
			        { score : { $meta: "textScore" } }
			    ).sort({ score : { $meta : 'textScore' } })
				.exec(function(err, results) {
							let totalLength = results.length;
							let startIndex = threadsPerPage*(req.query.pagesearch - 1);
							let endIndex = threadsPerPage*(req.query.pagesearch - 1) + threadsPerPage;
							let arrTemp = [];
							let pointer = 0;
							for(let i=startIndex; i<endIndex; i++){
								arrTemp[pointer] = results[i];
								pointer++;
							}

			        res.json({
			        	resultForPage: arrTemp,
			        	totalResults: allResults.length
			        });
			    });

		    })

	 });

	 app.get("/api/getnotificationcount", authenticateCookie, (req,res) => {
	 	UserChats.findOne({
	 		userId: req.user._id,
	 	},{
	 		unreadCount: 1,
	 		_id: 0
	 	}).then((doc) => {
	 		console.log(doc);
	 		res.json(doc);
	 	})
	 })

	 app.post("/api/changecategory", authenticateAdmin, (req,res) => {

	 	//QUERY 1
	 	Thread.findOne({
	 		compositeId: req.body.threads[0]
	 	}).then((thread) => {

	 		//QUERY 2
	 		ThreadCategory.findOneAndUpdate({
	 			_id: thread.category
	 		},{
	 			$inc: {
	 				threadcount: -(req.body.threads.length)
	 			}
	 		}).then((category) => {

	 			//QUERY 3
				 ThreadCategory.findOneAndUpdate({
			 		_id: req.body.categoryId,
			 		parentcategory: {
			 			$exists: true
			 		}
			 	},{
			 		$inc: {
			 			threadcount: req.body.threads.length
			 		}
			 	}).then((subCategory) => {

			 		//QUERY 4
				 	Thread.update({
				 		compositeId: {
				 			$in: req.body.threads
				 		}
				 	},{
				 		category: subCategory._id,
				 		categoryName: subCategory.categoryname
				 	},{
				 		multi: true
				 	}).then((result) => {
				 		console.log(result)
				 		res.sendStatus(200);

			 			return Promise.resolve();
			 		}).catch((err) => {
			 			console.log(err);
			 			res.sendStatus(500);
			 			return Promise.reject();
			 		})

			 		return Promise.resolve();
			 	}).catch((err) => {
			 		console.log(err);
			 		res.sendStatus(500);
		 			return Promise.reject();
			 	})

			 	return Promise.resolve();
			}).catch((err) => {
		 		console.log(err);
		 		res.sendStatus(500);
		 		return Promise.reject();
		 	})

 			return Promise.resolve();
 		}).catch((err) => {
 			console.log(err);
 			res.sendStatus(500);
 			return Promise.reject();
 		});
 	});

	app.get("/api/gotothreadpage/:replyId", (req,res) => {
		Reply.findOne({
			_id: req.params.replyId
		}).then((reply) => {

			Thread.findOne({
				_id: reply.threadId
			}).then((thread) => {

				let url = "/thread/"+thread.compositeId + "?page=" + (parseInt((reply.replyNumber - 1)/repliesPerPage)+1);
				res.redirect(url);

			}).catch((err) => {
				console.log(err);
				res.sendStatus(500);
			})

		}).catch((err) => {
			console.log(err);
			res.sendStatus(500);
		});
	});
}
