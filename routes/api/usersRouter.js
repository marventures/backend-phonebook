import express from 'express';
import { upload } from '../../middlewares/upload.js';
import { ctrlWrapper } from '../../helpers/ctrlWrapper.js';
// prettier-ignore
import { signupUser, loginUser, logoutUser, getCurrentUsers, updateUserSubscription, updateUser, getEmailVerification, resendEmailVerification} from "../../controllers/usersController.js";
import { authenticateToken } from '../../middlewares/authenticateToken.js';

const router = express.Router();

/* POST: /api/users/signup
  body: {
    "name":"example",
    "email": "example@example.com",
    "password": "examplepassword"
  }
*/
router.post('/signup', ctrlWrapper(signupUser));

/* POST: /api/users/login
  body: {
    "email": "example@example.com",
    "password": "examplepassword"
  }
*/
router.post('/login', ctrlWrapper(loginUser));

/* GET: /api/users/logout */
router.get('/logout', authenticateToken, ctrlWrapper(logoutUser));

/* GET: /api/users/current */
router.get('/current', authenticateToken, ctrlWrapper(getCurrentUsers));

/* PATCH: /api/users/
  body: {
    "subscription":"pro"
  }
*/
router.patch('/', authenticateToken, ctrlWrapper(updateUserSubscription));

/* PUT: /api/users/info
    body - multipart/form-data: {
      "avatar": "test.png"
      "firstName": "Updated First Name",
      "lastName": "Updated Last Name",
      "email": "newemail@example.com",
    }  
*/
router.put('/info', authenticateToken, upload.single('avatar'), ctrlWrapper(updateUser));

/* GET: // http://localhost:3000/api/users/verify/:verificationToken */
router.get('/verify/:verificationToken', ctrlWrapper(getEmailVerification));

/* POST: // http://localhost:3000/api/users/verify 
{
  "email": "example@example.com",
}
*/
router.post('/verify', authenticateToken, ctrlWrapper(resendEmailVerification));

export { router };
