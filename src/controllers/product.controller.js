import { Product } from '../models/product.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { methodHandler } from '../utils/methodHandler.js';

const addProduct = methodHandler(async (req, res) => {
  const { name, image, description, price, rating, category, brand } = req.body;

  const isAllValueAvailable = [name, image, description, price, rating, category, brand].every(
    Boolean
  );

  if (!isAllValueAvailable) {
    throw new ApiError(400, 'All fields are required');
  }

  const product = await Product.create({
    name,
    image,
    description,
    price,
    rating,
    category,
    brand,
  });

  const addedProductName = await Product.findById(product._id).select('name');

  if (!addedProductName) throw new ApiError(500, 'Something went wrong while saving the product');

  return res.status(200).json(new ApiResponse(200, addedProductName, 'Product added successfully'));
});

const getProduct = methodHandler(async (req, res) => {
  const { page, limit, search, brand, category, minPrice, maxPrice, sort } = req.query;

  const skip = (page - 1) * limit;
  const priceRange =
    minPrice && maxPrice ? { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) } : { $gte: 0 };

  let sorting = { _id: 1 };

  if (sort === 'new') sorting = { _id: -1 };
  if (sort && sort !== 'new') sorting = { price: parseInt(sort) };

  const products = await Product.find({
    name: { $regex: search, $options: 'i' },
    brand: { $regex: brand, $options: 'i' },
    category: { $regex: category, $options: 'i' },
    price: priceRange,
  })
    .skip(skip)
    .limit(limit)
    .sort(sorting);

  const productsCount = await Product.find({
    name: { $regex: search, $options: 'i' },
    brand: { $regex: brand, $options: 'i' },
    category: { $regex: category, $options: 'i' },
    price: priceRange,
  }).countDocuments();

  return res
    .status(200)
    .json(new ApiResponse(200, [products, productsCount], 'All product fetched successfully'));
});

const getBrands = methodHandler(async (_, res) => {
  const brands = await Product.distinct('brand'); //get a specific field from mongodb only if it has a unique value

  return res.status(200).json(brands);
});

const getCategories = methodHandler(async (_, res) => {
  const categories = await Product.distinct('category');
  return res.status(200).json(categories);
});

export { addProduct, getProduct, getBrands, getCategories };
