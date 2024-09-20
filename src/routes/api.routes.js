import { Router } from "express";
import { createPost,getPosts,getPostById,updatePost, deletePost} from "../controllers/post.controller.js";
import { createComment, deleteComment, getComment, getCommentById, updateComment } from "../controllers/comment.controller.js";
import { createUser, userLogin, userLogout } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { sendTestEmail } from "../utils/testMail.js";
import { sendGmail } from "../utils/gmail.js";
import { sendEmail } from "../utils/smtpMail.js";
import { sendGmailwithHandlebar } from "../utils/mailHandlebars.js";
// import path from "path";
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


const router = Router();

// router.route('/post')
//     .post(verifyJWT,createPost)  
//     .get(verifyJWT,getPosts); 
router.route('/post')
    .post(createPost)  
    .get(getPosts); 
// router.route('/post/:id')
//     .get(verifyJWT,getPostById)
//     .put(verifyJWT,updatePost)
//     .delete(verifyJWT,deletePost)

router.route('/post/:id')
    .get(getPostById)
    .put(updatePost)
    .delete(deletePost)
// router.route('/comment')
//     .post(verifyJWT,createComment)
//     .get(verifyJWT,getComment)
    router.route('/comment')
    .post(createComment)
    .get(getComment)
// router.route("/comment/:id")
//     .get(verifyJWT,getCommentById)
//     .put(verifyJWT,updateComment)
//     .delete(verifyJWT,deleteComment)
router.route("/comment/:id")
    .get(getCommentById)
    .put(updateComment)
    .delete(deleteComment)

router.route('/register').post( upload.single('avatar'), createUser);


router.route('/login').post(userLogin)

router.route('/logout').post(verifyJWT,userLogout)

router.route('/send-testmail').post(sendTestEmail)
router.route('/send-gmail').post(sendGmail)
router.route('/send-mail').post(sendEmail)

router.route('/send-mail-handlebar').post(sendGmailwithHandlebar, (req, res) => {
    res.render("email");
});



    
    



export default router;