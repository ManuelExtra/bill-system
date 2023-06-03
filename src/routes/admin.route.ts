import { Router } from 'express';

import isAuthenticated from '../middlewares/isAuthenticated';
import adminController from '../controllers/admin.controller';

import validate from '../middlewares/Validator/auth';
import isAuthorized from '../middlewares/isAuthorized';
// import { decrypt } from '../middlewares/Validator/encryption';

// For users assigned to the core product
// import { core } from '../middlewares/Validator/product';
// import { phone } from '../middlewares/data';

// For users assigned to the admin product
// import { admin } from '../middlewares/Validator/product';

const router = Router();

export default router;
