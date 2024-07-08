import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import { router as contactsRouter } from './routes/api/contactsRouter.js';
import { router as usersRouter } from './routes/api/usersRouter.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use(express.static('public'));

// Read Swagger JSON file
const swaggerPath = path.join(process.cwd(), 'swagger.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/contacts', contactsRouter);
app.use('/api/users', usersRouter);

app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, _req, res, _next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

export { app };
