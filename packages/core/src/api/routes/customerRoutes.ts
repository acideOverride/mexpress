import { Router } from 'express';
import { customerController } from '../controllers/CustomerController';

const router = Router();

// Customer routes
router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.getCustomerById);
router.post('/', customerController.createCustomer);
router.put('/:id', customerController.updateCustomer);

export default router;