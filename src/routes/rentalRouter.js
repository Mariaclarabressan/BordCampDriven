import { Router } from "express"; 
import { deleteRent, getRentals, postRent, returnRental } from "../controller/rentalController.js";
import {rentalMiddleware} from '../middlewares/rentalMiddleware.js';

const rentalRouter = Router();

rentalRouter.get('/rentals', getRentals);
rentalRouter.post('/rentals', rentalMiddleware, postRent);
rentalRouter.get('/rentals:id/return', returnRental);
rentalRouter.put('/rentals:id', deleteRent);


export default rentalRouter;