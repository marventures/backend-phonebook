import express from 'express';
import { ctrlWrapper } from '../../helpers/ctrlWrapper.js';
// prettier-ignore
import { addContact, deleteContactById, getAllContacts, getContactById, updateContactById, updateStatusContact } from "../../controllers/contactsController.js";
import { authenticateToken } from '../../middlewares/authenticateToken.js';

const router = express.Router();

/* GET: /api/contacts */
router.get('/', authenticateToken, ctrlWrapper(getAllContacts));

/* GET: /api/contacts/:contactId */
router.get('/:contactId', authenticateToken, ctrlWrapper(getContactById));

/* POST: /api/contacts/ 
    body: {
        "name": "Marvin Pacis",
        "email": "marvinpacis@example.com",
        "phone": "(639) 840-6611"
    } 
*/
router.post('/', authenticateToken, ctrlWrapper(addContact));

/* DELETE: /api/contacts/:contactId */
router.delete('/:contactId', authenticateToken, ctrlWrapper(deleteContactById));

/* PUT: /api/contacts/:contactId 
    body: {
        "name": "Yenn Collins",
        "email": "yenncollins@example.com",
        "number": "(639) 777-8819"
    } 
*/
router.put('/:contactId', authenticateToken, ctrlWrapper(updateContactById));

/* PATCH: /api/contacts/:contactId/favorite
    body: {
        "favorite": true,
    }
*/
// prettier-ignore
router.patch("/:contactId/favorite", authenticateToken, ctrlWrapper(updateStatusContact));

export { router };
