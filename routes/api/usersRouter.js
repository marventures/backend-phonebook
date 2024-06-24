import express from 'express';
import { upload } from '../../middlewares/upload.js';
import { ctrlWrapper } from '../../helpers/ctrlWrapper.js';
// prettier-ignore
import { signupUser, loginUser, logoutUser, getCurrentUsers, updateUserSubscription, updateAvatar, updateUser} from "../../controllers/usersController.js";
import { authenticateToken } from '../../middlewares/authenticateToken.js';

const router = express.Router();

/* POST: // http://localhost:8000/api/users/signup
{
  "name":"example",
  "email": "example@example.com",
  "password": "examplepassword"
}
*/
router.post('/signup', ctrlWrapper(signupUser));

/* POST: // http://localhost:8000/api/users/login
{
  "email": "example@example.com",
  "password": "examplepassword"
}
*/
router.post('/login', ctrlWrapper(loginUser));

/* GET: // http://localhost:8000/api/users/logout */
router.get('/logout', authenticateToken, ctrlWrapper(logoutUser));

/* GET: // http://localhost:8000/api/users/current */
router.get('/current', authenticateToken, ctrlWrapper(getCurrentUsers));

/* PATCH: // http://localhost:8000/api/users/
{
    "subscription":"pro"
}
*/
router.patch('/', authenticateToken, ctrlWrapper(updateUserSubscription));

/* PATCH: // http://localhost:8000/api/users/avatars
    form-data
    avatar,file : image
*/
router.patch('/avatars', authenticateToken, upload.single('avatar'), ctrlWrapper(updateAvatar));

/* PUT: // http://localhost:8000/api/users/info
{
    "firstName": "Updated First Name",
    "lastName": "Updated Last Name",
    "email": "newemail@example.com",
} 
*/
router.put('/info', authenticateToken, ctrlWrapper(updateUser));

export { router };
