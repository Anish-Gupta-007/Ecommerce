const Product = require("../models/productModels");
const cloudinary = require("../config/cloudinary");

const createProduct = async (req, res) => {
  try {
    const { title, description, price, stock, category, materials, variants } = req.body;
    if (!title || !description || !price || !stock || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Process multiple uploaded files
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      uploadedImages = req.files.map(file => ({
        public_id: file.filename,
        url: file.path
      }));
    }

    const newProduct = await Product.create({
      title,
      description,
      price,
      stock,
      category,
      materials: materials ? JSON.parse(materials) : [],
      variants: variants ? JSON.parse(variants) : [],
      images: uploadedImages,
    });
    res.status(201).json({
      success: true,
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
    console.log(error);
  }
};

const getAllProduct = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, page = 1 } = req.query;

    const query = {};

    // Search
    if (keyword) {
      query.title = {
        $regex: keyword,
        $options: "i",
      };
    }

    // Category
    if (category) {
      query.category = category;
    }

    // Price Filter
    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    const limit = req.query.limit ? Number(req.query.limit) : 50;

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalProducts = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      currentPage: Number(page),
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // If new images are uploaded, delete old ones from Cloudinary and save new ones
    if (req.files && req.files.length > 0) {
      for (const img of product.images) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }

      product.images = req.files.map(file => ({
        public_id: file.filename,
        url: file.path
      }));
    }

    product.title = req.body.title || product.title;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.stock = req.body.stock || product.stock;
    product.category = req.body.category || product.category;
    
    if (req.body.materials) product.materials = JSON.parse(req.body.materials);
    if (req.body.variants) product.variants = JSON.parse(req.body.variants);

    await product.save();

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete all images from cloudinary
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
