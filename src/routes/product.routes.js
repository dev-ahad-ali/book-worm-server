import { Router } from 'express';
import {
  addProduct,
  getBrands,
  getProduct,
  getCategories,
} from '../controllers/product.controller.js';

const ProductRouter = Router();

ProductRouter.route('/get-product').get(getProduct);
ProductRouter.route('/add-product').post(addProduct);
ProductRouter.route('/get-brands').get(getBrands);
ProductRouter.route('/get-categories').get(getCategories);

export { ProductRouter };
