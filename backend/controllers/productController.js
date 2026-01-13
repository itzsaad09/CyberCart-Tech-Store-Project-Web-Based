import productModel from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";

// Controller Function for Adding Product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      description,
      price,
      color,
      countInStock,
      rating,
      numReviews,
      newArrival,
      viralProduct,
      date,
    } = req.body;
    const image1 = req.files?.image1?.[0];
    const image3 = req.files?.image3?.[0];
    const image2 = req.files?.image2?.[0];

    const images = [image1, image2, image3].filter(
      (item) => item !== undefined
    );

    let imagesUrl;
    if (images.length > 0) {
      imagesUrl = await Promise.all(
        images.map(async (item) => {
          const result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
          });
          return result.secure_url;
        })
      );
    } else {
      // Default Image URL
      imagesUrl = [
        "https://res.cloudinary.com/dop0d5y5g/image/upload/v1690000000/no-image-available-icon-6_sx4q0n.png",
      ];
    }

    const productData = await productModel.create({
      name,
      image: imagesUrl,
      brand,
      category,
      description,
      price: Number(price),
      color,
      countInStock: Number(countInStock),
      rating,
      numReviews,
      newArrival: newArrival == "true" ? true : false,
      viralProduct: viralProduct == "true" ? true : false,
      timestamps: Date.now(),
    });

    const product = new productModel(productData);
    await product.save();

    res.status(201).json({ message: "Product Added Successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller Function for Single Product
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const productData = await productModel.findById(productId);
    if (!productData) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ product: productData });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller Function for Displaying and Searching Products
const displayProduct = async (req, res) => {
  try {
    const { keyword, category, brand, minPrice, maxPrice, newArrival, viralProduct } = req.query;
    const query = {};

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
      ];
    }

    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    if (brand) {
      query.brand = { $regex: brand, $options: "i" };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    if (newArrival !== undefined) {
      query.newArrival = newArrival === "true";
    }

    if (viralProduct !== undefined) {
      query.viralProduct = viralProduct === "true";
    }

    const products = await productModel.find(query);
    res.status(200).json({ products });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller Function for Updating Product
const updateProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    let product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updateFields = {
      name: req.body.name,
      brand: req.body.brand,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price ? Number(req.body.price) : undefined,
      color: req.body.color,
      countInStock: req.body.countInStock
        ? Number(req.body.countInStock)
        : undefined,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      newArrival:
        req.body.newArrival !== undefined
          ? req.body.newArrival === "true"
          : undefined,
      viralProduct:
        req.body.viralProduct !== undefined
          ? req.body.viralProduct === "true"
          : undefined,
    };

    Object.keys(updateFields).forEach(
      (key) => updateFields[key] === undefined && delete updateFields[key]
    );

    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];

    const newImages = [image1, image2, image3].filter(
      (item) => item !== undefined
    );

    if (newImages.length > 0) {
      const newImagesUrl = await Promise.all(
        newImages.map(async (item) => {
          const result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
          });
          return result.secure_url;
        })
      );
      updateFields.image = newImagesUrl;
    }

    product = await productModel.findByIdAndUpdate(
      productId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller Function for Deleting Product
const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const productData = await productModel.findByIdAndDelete(
      productId,
      req.body
    );
    if (!productData) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  addProduct,
  singleProduct,
  displayProduct,
  updateProduct,
  deleteProduct,
};