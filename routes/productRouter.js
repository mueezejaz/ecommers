import express from "express"
import { isadmin, requiresignin } from "../middleware/authmiddleware.js";
import { creatprodictcontroller, deletephotoprodictcontroller, getphotoprodictcontroller, getprodictcontroller, getsingleprodictcontroller, productFilter, productlistcontroller, productnumbercontroller, relatedcontroller, searchbarcontroller, updateprodictcontroller } from "../controllers/productController.js";
import formidable from "express-formidable"
const router = express.Router();
//creating product
router.post("/creat-product",requiresignin,isadmin,formidable(),creatprodictcontroller)
//geting all products
router.get("/get-product",getprodictcontroller)
// getting single product
router.get("/get-product/:slug",getsingleprodictcontroller)
//geting photo
router.get("/product-photo/:id",getphotoprodictcontroller)
//deleating product 
router.delete("/product-delete/:pid",requiresignin,isadmin,deletephotoprodictcontroller)
//updating
router.put("/update-product/:pid",requiresignin,isadmin,formidable(),updateprodictcontroller)
//filter route
router.post("/product-filters",productFilter)
//number of product 
router.get('/product-count',productnumbercontroller)
//product perpage
router.get('/product-list/:page',productlistcontroller)
//serch bar controller
router.get("/search/:kaywords",searchbarcontroller)
//related product 
router.get("/related-product/:pid/:cid",relatedcontroller)

export default router;