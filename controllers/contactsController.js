import { Contact } from '../models/contactsModel.js';
// prettier-ignore
import { contactValidation, favoriteValidation } from "../validations/validation.js";
import { httpError } from '../helpers/httpError.js';

/**
 * Retrieves a paginated list of contacts, optionally filtered by favorite status.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.query - The query parameters of the request.
 * @param {number} [req.query.page=1] - The page number for pagination (default is 1).
 * @param {number} [req.query.limit=20] - The number of contacts per page (default is 20).
 * @param {boolean} [req.query.favorite] - Filter contacts by favorite status (optional).
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves with no value.
 */
const getAllContacts = async (req, res) => {
  const { page = 1, limit = 20, favorite } = req.query;
  const query = favorite ? { favorite: true } : {};

  const result = await Contact.find(query)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.json(result);
};

/**
 * Retrieves a contact by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The URL parameters of the request.
 * @param {string} req.params.contactId - The ID of the contact to retrieve.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves with no value.
 * @throws {Error} Will throw an error if the contact ID is not found.
 */
const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);

  if (!result) {
    throw httpError(404, 'Contact ID Not Found');
  }

  res.json(result);
};

/**
 * Adds a new contact with the provided data.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The body of the request containing contact data.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves with no value.
 * @throws {Error} Will throw an error if validation fails or if required fields are missing.
 */
const addContact = async (req, res) => {
  // Preventing lack of necessary data for contacts (check validations folder)
  const { error } = contactValidation.validate(req.body);

  if (error) {
    throw httpError(400, 'missing required fields');
  }

  const result = await Contact.create(req.body);

  res.status(201).json(result);
};

/**
 * Deletes a contact by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The URL parameters of the request.
 * @param {string} req.params.contactId - The ID of the contact to delete.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} A promise that resolves with no value.
 * @throws {Error} Will throw an error if the contact ID is not found.
 */
const deleteContactById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndDelete(contactId);

  if (!result) {
    throw httpError(404);
  }

  res.json({
    message: 'Contact deleted',
  });
};

const updateContactById = async (req, res) => {
  // Preventing lack of necessary data for contacts (check validations folder)
  const { error } = contactValidation.validate(req.body);
  if (error) {
    throw httpError(400, 'missing fields');
  }

  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  if (!result) {
    throw httpError(404);
  }

  res.json(result);
};

const updateStatusContact = async (req, res) => {
  // Preventing lack of necessary data for favorite (check validations folder)
  const { error } = favoriteValidation.validate(req.body);
  if (error) {
    throw httpError(400, 'missing field favorite');
  }

  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  if (!result) {
    throw httpError(404);
  }

  res.json(result);
};

// prettier-ignore
export { getAllContacts, getContactById, addContact, deleteContactById, updateContactById, updateStatusContact};
