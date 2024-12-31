import { asyncHandler } from "../../utils/asyncHandler.js";
import Product from "../../models/medical.store.model/product.model.js";
//import { uploadOnCloudinary } from "../../utils/cloudnary.js";
import { uploadOnCloudinary } from "../../utils/cloudnary.js";


// const addProduct = asyncHandler(async (req, res) => {
//   try {
//     console.log("\n add product \n");
//     const {
//       name,
//       description,
//       price,
//       category,
//       quantity,
//       brand,
//     } = req.body;

//     // Validation
//     switch (true) {
//       case !name:
//         return res.json({ error: "Name is required" });
//       case !brand:
//         return res.json({ error: "Brand is required" });
//       case !description:
//         return res.json({ error: "Description is required" });
//       case !price:
//         return res.json({ error: "Price is required" });
//       case !category:
//         return res.json({ error: "Category is required" });
//       case !quantity:
//         return res.json({ error: "Quantity is required" });
//     }

//     // Upload images to Cloudinary
//     const images = Object.values(req.files);
//     console.log(images);
//     if (images.length > 4) {
//       return res.json({ error: "You can upload up to 4 images" });
//     }

//     const imageUrls = await Promise.all(
//       images.map(async (image) => {
//         try {
//           //console.log("\n\n\npath="+image)
//           console.log("\n\n\npath=" + JSON.stringify(image));
//           const url = await uploadOnCloudinary(image[0].path);
//           console.error("cloud"+url);
//           return url;
//         } catch (error) {
//           console.error("error");
//           console.error(error);
//           return null;
//         }
//       })
//     );

//     // Filter out any null values
//     const filteredImageUrls = imageUrls.filter((url) => url !== null);

//     // Create product
//     const product = new Product({
//       name,
//       description,
//       price,
//       category,
//       quantity,
//       brand,
//       image: filteredImageUrls.map((url) => url.url),
//     });

//     console.log("\n add product \n");
//     await product.save();
//     res.json(product);
//   } catch (error) {
//     console.error(error);
//     res.status(400).json(error.message);
//   }
// });




// const updateProductDetails = asyncHandler(async (req, res) => {
//   try {
//     const { name, description, price, category, quantity, brand } = req.fields;

//     // Validation
//     switch (true) {
//       case !name:
//         return res.json({ error: "Name is required" });
//       case !brand:
//         return res.json({ error: "Brand is required" });
//       case !description:
//         return res.json({ error: "Description is required" });
//       case !price:
//         return res.json({ error: "Price is required" });
//       case !category:
//         return res.json({ error: "Category is required" });
//       case !quantity:
//         return res.json({ error: "Quantity is required" });
//     }

//     const product = await Product.findByIdAndUpdate(
//       req.params.id,
//       { ...req.fields },
//       { new: true }
//     );

//     await product.save();

//     res.json(product);
//   } catch (error) {
//     console.error(error);
//     res.status(400).json(error.message);
//   }
// });



import fs from 'fs/promises';

const addProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.body;

    // Validation
    switch (true) {
      case !name:
        return res.status(400).json({ error: "Name is required" });
      case !brand:
        return res.status(400).json({ error: "Brand is required" });
      case !description:
        return res.status(400).json({ error: "Description is required" });
      case !price:
        return res.status(400).json({ error: "Price is required" });
      case !category:
        return res.status(400).json({ error: "Category is required" });
      case !quantity:
        return res.status(400).json({ error: "Quantity is required" });
    }

    // Check files and limit to 4
    const images = req.files ? Object.values(req.files).flat() : [];
    if (images.length > 4) {
      return res.status(400).json({ error: "You can upload up to 4 images" });
    }

    // Upload images to Cloudinary
    const imageUrls = await Promise.all(
      images.map(async (image) => {
        try {
          const url = await uploadOnCloudinary(image.path);
          await fs.unlink(image.path); // Delete the file after uploading
          return url; // { secure_url: '...', public_id: '...' }
        } catch (error) {
          console.error("Error uploading image:", error);
          await fs.unlink(image.path); // Delete the file even if upload fails
          return null;
        }
      })
    );

    // Filter out failed uploads
    const filteredImageUrls = imageUrls.filter((url) => url !== null);

    // Create the product
    const product = new Product({
      name,
      description,
      price,
      category,
      quantity,
      brand,
      image: filteredImageUrls.map((url) => url.url), // Secure URLs for product
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: error.message });
  }
});


const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.body;
    const files = req.files; // Files uploaded via multipart form-data

    // Validation
    switch (true) {
      case !name:
        return res.status(400).json({ error: "Name is required" });
      case !brand:
        return res.status(400).json({ error: "Brand is required" });
      case !description:
        return res.status(400).json({ error: "Description is required" });
      case !price:
        return res.status(400).json({ error: "Price is required" });
      case !category:
        return res.status(400).json({ error: "Category is required" });
      case !quantity:
        return res.status(400).json({ error: "Quantity is required" });
    }

    // Find the existing product
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Handle updated images
    const updatedImages = [...product.image]; // Existing images
    const imageKeys = ["image1", "image2", "image3", "image4"]; // Defined keys for images

    for (const key of imageKeys) {
      if (files && files[key]) {
        // Upload the new image to Cloudinary
        const uploadedImage = await uploadOnCloudinary(files[key][0].path);

        // If uploaded successfully, replace the corresponding image
        if (uploadedImage?.url) {
          const index = imageKeys.indexOf(key);
          if (index !== -1) {
            // Delete the old image from Cloudinary
            const oldImage = updatedImages[index];
            if (oldImage?.public_id) {
              await deleteFromCloudinary(oldImage.public_id); // Custom delete function
            }

            // Update the image array
            updatedImages[index] = {
              url: uploadedImage.url,
              public_id: uploadedImage.public_id,
            };
          }
        }

        // Unlink the local file after uploading
        fs.unlinkSync(files[key][0].path);
      }
    }

    // Update the product fields and images
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        image: updatedImages,
      },
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});







const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).limit(pageSize);

    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Product not found" });
  }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .limit(12)
      .sort({ createAt: -1 });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already reviewed");
      }

      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

export {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
};
