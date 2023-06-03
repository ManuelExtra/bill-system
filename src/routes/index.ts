import customerRoutes from './user.route';
import adminRoutes from './admin.route';
import isAuthenticated from '../middlewares/isAuthenticated';
import cloudinary from '../utils/CloudinaryMediaProvider';
import errorHandler from '../middlewares/errorHandler';


import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

router.use('/user', customerRoutes);
router.use('/admin', adminRoutes);



router.post('/upload', isAuthenticated, (req:Request, res:Response, next:NextFunction) => {
  return cloudinary
    .upload(req)
    .then((response) => res.status(200).json(response))
    .catch(next);
});

router.get('/', (req, res) =>
  res
    .status(200)
    .send(`You have reached the ${process.env.SERVICE_NAME} service`)
);

router.all('*', (req, res) => res.sendStatus(404));

router.use((err: Error, req: Request, res: Response, next: NextFunction) => errorHandler(err, req, res));

export default router;
