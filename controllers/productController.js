import slugify from "slugify";
import productModel from "../models/productModel.js"
import fs from "fs"; 
import { type } from "os";
export const creatprodictcontroller =async(req,res)=>{
    try {
        const { name, discription, price, category, quantity, shipping } =
          req.fields;
        const { photo } = req.files;
        //alidation
        switch (true) {
          case !name:
            return res.status(500).send({ error: "Name is Required" });
          case !discription:
            return res.status(500).send({ error: "Description is Required" });
          case !price:
            return res.status(500).send({ error: "Price is Required" });
          case !category:
            return res.status(500).send({ error: "Category is Required" });
          case !quantity:
            return res.status(500).send({ error: "Quantity is Required" });
          case photo && photo.size > 1000000:
            return res
              .status(500)
              .send({ error: "photo is Required and should be less then 1mb" });
        }
    
        const products = new productModel({ ...req.fields, slug: slugify(name) });
        if (photo) {
          products.photo.data = fs.readFileSync(photo.path);
          products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
          success: true,
          message: "Product Created Successfully",
          products,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          error,
          message: "Error in crearing product",
        });
      }
}
//gwting all
export const getprodictcontroller = async (req,res)=>{
  try {
    const product = await productModel.find({}).populate("category").select("-photo").limit(12).sort({cratedAt:-1})
    res.status(200).send({
      success:true,
      totalproducts: product.length,
      message:"Products",
      product,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      message:"There is an error",
      error,
    })
  }
}

//getting single product
export const getsingleprodictcontroller = async(req,res)=>{
  try {
      const product = await productModel.findOne({slug:req.params.slug}).populate("category").select("-photo")
      res.status(200).send({
        success:true,
        message:"product fatched",
        product,
      })
  } catch (error) {
    console.log(error),
    res.status(500).send({
      success:false,
      message:"There is some error",
      error,
    })
  }
}


//getting photo
export const getphotoprodictcontroller = async(req,res)=>{
  try {
    const product = await productModel.findById({_id:req.params.id}).select("photo")
    if(product.photo.data){
      res.set('Content-type',product.photo.contentType)
      return res.status(200).send(product.photo.data)
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      message:"Error while gettinf photo"
    })
  }
}

//delete product
export const deletephotoprodictcontroller = async(req,res)=>{
  try {
 await productModel.findByIdAndDelete(req.params.pid).select("-photo")
 res.status(200).send({
  success:true,
  message:"Product deleted success fully"
 })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      message:"There is an error ",
      error,
    })
  }
}

//update contriller
export const updateprodictcontroller = async (req,res)=>{
  try {
    const { name, discription, price, category, quantity, shipping } =
    req.fields;
  const { photo } = req.files;
  //alidation
  switch (true) {
    case !name:
      return res.status(500).send({ error: "Name is Required" });
    case !discription:
      return res.status(500).send({ error: "Description is Required" });
    case !price:
      return res.status(500).send({ error: "Price is Required" });
    case !category:
      return res.status(500).send({ error: "Category is Required" });
    case !quantity:
      return res.status(500).send({ error: "Quantity is Required" });
    case photo && photo.size > 1000000:
      return res
        .status(500)
        .send({ error: "photo is Required and should be less then 1mb" });
  }

  const products = await productModel.findByIdAndUpdate(req.params.pid,
    {...req.fields,slug:slugify(name)},{new:true}
    );
  if (photo) {
    products.photo.data = fs.readFileSync(photo.path);
    products.photo.contentType = photo.type;
  }
  await products.save();
  res.status(201).send({
    success: true,
    message: "Product updated Successfully",
    products,
  });

  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      message:"There is an error ",
      error,
    })
  }
}


//filters 
export const productFilter =async (req,res)=>{
try {
  const {checked,radio} = req.body
  let args = {}
  if (checked.length>0) {
    args.category = checked
  }
  if(radio.length){
    args.price = {$gte:radio[0],$lte:radio[1]}
  }
  const product = await productModel.find(args)
  res.status(200).send({
    success:true,
    product,
  })
} catch (error) {
  console.log(error)
  res.send(400).send({
    success:false,
    message:"error while filtering",
    error
  }
  )
}
}



//number of product 
export const productnumbercontroller = async (req,res)=>{
  try {
    const total = await productModel.find({}).estimatedDocumentCount()
    res.status(200).send({
      success:true,
      total,
    })
  } catch (error) {
   
    res.status(500).send({
      message:"there is an error",
      error,
    })
  }
}

//product list controller
export const productlistcontroller = async(req,res)=>{
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
}

//serch bar controller
export const searchbarcontroller= async(req,res)=>{
  try {
    const { kaywords } = req.params;

    const resutls = await productModel
      .find({
        $or: [
          { name: { $regex: kaywords, $options: "i" } },
          { discription: { $regex: kaywords, $options: "i" } },
        ],
      })
      .select("-photo");
    res.status(200).send({
      success:true,
      resutls,
    });
  } catch (error) {
 
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
}

//related product controller
export const relatedcontroller = async (req,res)=>{
  try {
    const {pid,cid}=req.params
    const product = await productModel.find({
      category:cid,
      _id:{$ne:pid}
    }).select('-photo').limit(6).populate("category")
    res.status(200).send({
      success:true,
      product,
    })
  } catch (error) {
  
    res.status(500).send({
      success:false,
   error,
      message:"There is an error"
    })
  }
}