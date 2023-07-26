import  express  from "express";
import { categorycontroller, creatcategorycontroller, deletesinglecategoryController, singlecategoryController, updatecategorycontroller } from "../controllers/categoryController.js";
const router = express.Router();
import { requiresignin,isadmin, } from "../middleware/authmiddleware.js";
//creating category
router.post('/creat-category',requiresignin,isadmin, creatcategorycontroller)
//updating category
router.put('/update-category/:id',requiresignin,isadmin,updatecategorycontroller)
//getting all categories
router.get('/categories',categorycontroller)
//getting single category
router.get('/single-categori/:slug',singlecategoryController)
//deleating category
router.delete('/delete-categori/:id',requiresignin,isadmin,deletesinglecategoryController)

export default router