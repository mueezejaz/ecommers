import CategoryModel from "../models/CategoryModel.js"
import slugify from "slugify"
export const creatcategorycontroller = async(req,res)=>{
try {
    const {name} = req.body
    if(!name){
        return res.status(401).send({
        messgae:"name is required"
        })
    }
    const existingCategory = await CategoryModel.findOne({name})
    if(existingCategory){
        return res.status(401).send({
            success:false,
            messgae:"This catedory already exist",
        })
    }
    const category= await new CategoryModel({name,slug:slugify(name)}).save()
    res.status(201).send({
        success:true,
        messgae:"New category created sucessfully",
        category
    })
} catch (error) {
   
    res.status(500).send({
        success:false,
        error,
        messgae:"Error in category",
    })
}
}

export const updatecategorycontroller=async(req,res) => {
try {
    const {name} = req.body
    const {id} = req.params
    const category = await CategoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true});
    res.status(200).send ({
        success:true,
        messgae:"category updated sucessfully",
        category
    })
} catch (error) {
  
    res.status(500).send({
        success:false,
        error,
        messgae:"Error in updating"
    })
}
}

export const categorycontroller =async (req,res)=>{
try {
    const category = await CategoryModel.find({})
    res.status(200).send({
        success:true,
        messgae:"All categories list",
        category,
    })
} catch (error) {
  
    res.status(500).send({
        success:false,
        messgae:"errors while getting categories",
        error,
    })
    }
}

export const singlecategoryController = async(req,res)=>{
    try {
        const {slug} = req.params
      
        const category = await CategoryModel.findOne({slug:slug})
        res.status(200).send({
            success:true,
            messgae:"gettinf category sucessfully",
            category,
        })
    } catch (error) {
        
        res.status(500).send({
            success:false,
            error,
            messgae:"Error while gettting category",
        })
    }
}

export const deletesinglecategoryController = async (req,res)=>{
    try {
        const {id} = req.params
      await CategoryModel.findByIdAndDelete(id)
      res.status(200).send({
        success:true,
        messgae:'deleated successfully',
      })
    } catch (error) {
       
        res.status(500).send({
            success:false,
            messgae:"error whle deleteing",
            error,
        })
    }
}