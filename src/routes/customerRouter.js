import { Router } from "express"; 
import { getAllCustomers,getOneCustomer, postCustomer, upDateCustomer } from "../controller/customerController.js";
import {customerMiddleware} from '../middlewares/customerMiddleware.js';

const customerRouter = Router();

customerRouter.post('/customers',customerMiddleware, postCustomer);
customerRouter.get('/customers', getAllCustomers);
customerRouter.get('/customers:id', getOneCustomer);
customerRouter.put('/customers:id', customerMiddleware, upDateCustomer)


export default customerRouter;