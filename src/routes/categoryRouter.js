import { Router } from "express";
import { getCategories, postCategory } from "../controller/categoryController.js";
import {categoryMiddleware} from '../middlewares/categoryMiddleware.js';

const categoryRouter = Router();

categoryRouter.get('/categories', getCategories);
categoryRouter.post('/categories', categoryMiddleware, postCategory);

export default categoryRouter;