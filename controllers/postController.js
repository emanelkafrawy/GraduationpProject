const wordNetAPI = require('node-wordnet');
const data = require('../data');
const {validationResult} = require('express-validator');
const postModel = require('../models/postModel');
const userModel = require('../models/userModel');
const commentModel = require('../models/commentModel');
const itemsPerPage = 6; 

exports.conuterPosts = async(req, res, nxt) =>{
    try{
        const allpostApproved = await postModel.find({approved: true})
        const notApproved = await postModel.find({approved: false})
        return res.status(200).json({
            message: 'posts conut are fetched successfully',
            approvedlength: allpostApproved.length,
            notapprovedlength: notApproved.length
        });
    }catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        nxt(err);
    }
}
exports.getAllPost = async (req, res, nxt) => {
    try {
        let condition ; //to put it in find
        let mappedArr;
        //to track user
        const user = await userModel.findById(req.userId);
        const userInterests = user.interests;
        const page = req.query.page ? parseInt(req.query.page) : 1; //for pagination
        //checkif user has interests or not 
        if(userInterests.length <= 0) {
            condition = {approved: true}
        } else {
            //regulare expression
            mappedArr = [...userInterests.map(el => {
                return new RegExp(el, "i");
            })]
            condition = {$and:[{approved: true},
                {$or: [{description: {$in: mappedArr}}, {StartupName: {$in: mappedArr}}]}]}
        }
        //find
        const posts = await postModel.find(condition) //condition on retrieved posts
        .populate('createdBy', {firstName:1, lastName:1}) 
        .populate('categoryId', {name:  1})
        .populate({
            path: 'comments',
            select: 'content',
            populate: {
                path: 'userId',
                model: 'User',
                select: 'firstName lastName pic'
            }
        })
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage)
        .sort({createdAt: -1});
        if (!posts) {
            return res.status(404).json({
                "message" : "no posts found"
            });
        }
        
        // const allpostApproved = await postModel.find({approved: true})
        // const notApproved = await postModel.find({approved: false})
        return res.status(200).json({
            message: 'posts are fetched successfully',
            search_Result: posts.length,
            posts: posts.length > 0 ? posts : "No Posts Found",
            // approvedlength: allpostApproved.length,
            // notapprovedlength: notApproved.length
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        nxt(err);
    }
}
exports.findPost = async (req, res, nxt) => {
    try {
        //hold data
        const postId = req.params.postId;
        const post = await postModel.findById(postId)
        .sort({createdAt: -1})
        .populate('createdBy',{firstName:1, lastName:1})
        .populate('categoryId', {name:  1})
        .populate({
            path: 'comments',
            select: 'content',
            populate: {
                path: 'userId',
                model: 'User',
                select: 'firstName lastName pic'
            }
        })
        .exec()
        if(!post || !post.approved) {
            return res.status(404).json({
                message: "this post is not found"
            })
        }
        return res.status(200).json({
            // message: `the post ${postId} is retrieved successfully`,
            post
        });
    } catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        nxt(err);
    }
}; 

exports.createPost = async (req, res, nxt) => {
    try {
        // validation
        const errors = await validationResult(req);
       
        if (!errors.isEmpty()) {
            console.log(errors.array())
            return res.status(422).json({
                errors: errors.array()
            });
        }
        //hold data
        const {StartupName, description, facebookpage, websitelink, phone, 
            addressLine, Price, Productname, Posttype, category,Category,categoryId} = req.body;
        const user = req.userId;
        let pic = []; 
        //handle files
        if(req.files) {
            req.files.forEach(file => {
                pic.push(data.DOMAIN + file.filename);
            })
        }
        //create new object
        const post = new postModel({
            StartupName,
            description,
            categoryId,
            facebookpage,
            websitelink,
            phone,
            addressLine,
            Price,
            Productname,
            Posttype,
            pic,
            category,
            Category,
            createdBy: user
        });
        
        //save in db
        const postt = await post.save();
        //add it to userModel
        // const usermodel = await userModel.findById(user);
        // usermodel.posts.push(post);
        // await usermodel.save();
        return res.status(201).json({
            // message: "your post is created successfully",
            post: postt
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        nxt(err);
    }
};

exports.updatePost = async (req, res, nxt) => {
    try {
        //validation
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }
        const postId = req.params.postId;
        const post = await postModel.findById(postId)
        .populate('categoryId', {name:  1});
        if (!post || !post.approved) {
            return res.status(404).json({
                message: "the post is not exist"
            });
        }
        if (post.createdBy.toString() !== req.userId.toString()) {
            return res.status(401).json({
                message: "you're not authorized to update this post"
            });
        }
        //hold new values
        const {StartupName, description, facebookpage, websitelink, phone, 
            addressLine, price, productname, posttype, category} = req.body;
        let pic = [];
        //handle files
        if(req.files != undefined) {
            req.files.forEach(file => {
                pic.push(data.DOMAIN + file.filename);
            })
        }
        //override
        post.StartupName = StartupName;
        post.description = description;
        post.categoryId = categoryId;
        post.facebookpage = facebookpage;
        post.websitelink = websitelink;
        post.phone = phone;
        post.addressLine = addressLine;
        post.productname = productname;
        post.price = price;
        post.category = category;
        post.posttype = posttype;
        post.pic = pic;
        //save in db
        const updatedPost = await post.save();
        return res.status(200).json({
            message: 'post is updated successfully',
            post: updatedPost
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        nxt(err);
    }
};

exports.deletePost = async (req, res, nxt) => {
    try {
        const useradmin = await userModel.findById(req.userId)
        const postId = req.params.postId;
        const post = await postModel.findById(postId);
        if(!post || !post.approved) {
            return res.status(404).json({
                message: "the post is not exist"
            });
        }
        if (post.createdBy.toString() !== req.userId.toString() || useradmin.role == 'admin') {
            return res.status(401).json({
                message: "you're not authorized to delete this post"
            });
        }
        const result = await postModel.findByIdAndRemove(postId);
        //delete comments on this post 
        const comments = await commentModel.find({postId: postId});
        if(!comments) {
            return res.status(404).json({
                "message" : "comments are not found"
            });
        }
        await commentModel.deleteMany({postId: postId})
        //delete it from user model
        const user = await userModel.findById(req.userId);
        if(!user) {
            return res.status(404).json({
                "message": "user is not found"
            })
        }
        user.posts.pull(postId);
        await user.save();

        return res.status(200).json({
            message: 'the post is deleted successfully',
            post: result
        })
    } catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        nxt(err);
    }
};

exports.filter = async (req, res, nxt) => {
    try {

        //validation
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }
        //hold data
        const category = req.query.categoryId;
        var arr = [];
        const page = req.query.page ? parseInt(req.query.page) : 1; //for pagination
        const posts = await postModel.find({$and:[{categoryId: category},{approved: true}]}).populate('createdBy',
        {firstName:1, lastName:1})
        .populate('categoryId', {name:  1})
        .populate({
            path: 'comments',
            select: 'content',
            populate: {
                path: 'userId',
                model: 'User',
                select: 'firstName lastName pic'
            }
        })
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage)
        .sort({createdAt: -1})
        //filter posts according to approving
        posts.forEach(Element => {
            if(Element.approved) {
                arr.push(Element);
            }
        });
        //return posts
        return res.status(200).json({
            message: 'the posts are retrieved successfully',
            search_Result: posts.length,
            posts: posts.length>0 ? posts : "No Posts Found",
        })
    } catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        nxt(err);
    }
}

exports.search = async (req, res, nxt) =>{
    try {
        //validation
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }

        const key = req.query.key;
        let arr = [];
        let uniqueArray = [];
        const page = req.query.page ? parseInt(req.query.page) : 1; //for pagination
        let wordnet = new wordNetAPI();
        const words = await wordnet.lookupAsync(key);
        console.log(words);
        //loop on all data in api to combine it
        words.forEach(word => {
            arr.push(...word.synonyms);
        });
        //combine data with key
        if (!arr.includes(key)) {
            arr.push(key);
        }
        //remove deplicated value
        arr.forEach(val => {
            if(!uniqueArray.includes(val)) {
                uniqueArray.push(val);
            }
        }); //kda ana m3aya array h3ml find beha
        //regulare expression
        let mappedArr = uniqueArray.map(el => {
            return new RegExp(el, "i");
        })
        //add all this to user interests
        const user = await userModel.findById(req.userId);
        //check if element exist or not
        uniqueArray.map(el => {
            if(!user.interests.includes(el)) {
                user.interests.push(el);
            }
        });
        user.save();
        //l database
        const post = await postModel.find({$or: [{$and:[{description: {$in: mappedArr}}, {approved: true}]}, 
            {$and:[{StartupName: {$in: mappedArr}}, {approved: true}]}]})
            .populate('createdBy', {firstName:1, lastName:1})
            .populate('categoryId', {name:  1})
            .populate({
                path: 'comments',
                select: 'content',
                populate: {
                    path: 'userId',
                    model: 'User',
                    select: 'firstName lastName pic'
                }
            })
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .sort({createdAt: -1});
        if (!post) {
            return res.status(404).json({
                message: "no posts found"
            });
        }
        return res.status(200).json({
                message: "posts are fetched successfully",
                search_Result: post.length,
                posts: post.length>0 ? post : "No posts Found"
        });
    } catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        nxt(err);
    }
}

//for admin
exports.getAllUnapprovedPost = async (req, res, nxt) => {
    try {
        const userId = req.userId;
        const page = req.query.page ? parseInt(req.query.page) : 1; //for pagination
        const user = await userModel.findById(userId)
        if(!user || user.role !== 'admin') {
            return res.status(401).json({
                message: "you're unauthorized to perform this operation"
            });
        }
        const posts = await postModel.find({approved: false})
        .populate('categoryId', {name: 1})
        .sort({createdAt: -1})
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage);;
        return res.status(200).json({
            search_Result: posts.length,
            posts: posts.length != 0 ? posts : "No posts found",
            id: posts.map(post =>{
                return post._id
            })
            // id: posts._id,
            // content: posts.StartupName
        })
    } catch(err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        nxt(err)
    }
}
exports.approvPost = async (req, res, nxt) => {
    try {
        const postId = req.params.postId;
        const userId = req.userId;
        const user = await userModel.findById(userId)
        if(!user || user.role !== 'admin') {
            return res.status(401).json({
                message: "you're unauthorized to perform this operation"
            });
        }
        const post = await postModel.findById(postId);
        if(!post) {
            return res.status(404).json({
                message: "post is not found"
            })
        }
        post.approved = true;
        await post.save();
        const usermodel = await userModel.findById(post.createdBy._id);
        usermodel.posts.push(post);
        await usermodel.save();
        return res.status(200).json({
            message: "post is approved successfully",
            post: post
        })
    } catch(err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        nxt(err)
    }
}
exports.refusePost = async (req, res, nxt) => {
    try {
        const postId = req.params.postId;
        const userId = req.userId;
        const user = await userModel.findById(userId)
        if(!user || user.role !== 'admin') {
            return res.status(401).json({
                message: "you're unauthorized to perform this operation"
            });
        }
        const post = await postModel.findById(postId);
        if(!post) {
            return res.status(404).json({
                message: "the post is not exist"
            });
        }
        const deletePost = await postModel.findByIdAndRemove(postId);
        //delete it from user model
        const userOwnerId = post.createdBy; //id l user l 3amel l post
        const userOwner = await userModel.findById(userOwnerId);
        userOwner.posts.pull(postId);
        await userOwner.save();
        return res.status(200).json({
            message: "post is deleted successfully",
            post: deletePost
        })
    } catch(err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        nxt(err)
    }
}
