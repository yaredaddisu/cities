const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

app.use(express.json());

// In-memory array for cities
let cities = [
//   { id: 1, name: 'Addis Ababa', population: 5000000, country: 'Ethiopia' },
//   { id: 2, name: 'New York', population: 8400000, country: 'USA' }
];
let nextId = 3;

/**
 * @swagger
 * components:
 *   schemas:
 *     City:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID
 *         name:
 *           type: string
 *           description: City name
 *         population:
 *           type: integer
 *           description: City population
 *         country:
 *           type: string
 *           description: Country name
 *       example:
 *         id: 1
 *         name: Addis Ababa
 *         population: 5000000
 *         country: Ethiopia
 */

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'City CRUD API',
      version: '1.0.0',
      description: 'A simple Express.js CRUD API for managing cities with in-memory storage',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ['./index.js'], // Path to the file with JSDoc comments (this file)
};

const specs = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

/**
 * @swagger
 * /cities:
 *   get:
 *     summary: Returns all cities
 *     responses:
 *       200:
 *         description: List of cities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/City'
 */
app.get('/cities', (req, res) => {
  res.json(cities);
});

/**
 * @swagger
 * /cities/{id}:
 *   get:
 *     summary: Get a city by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single city
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/City'
 *       404:
 *         description: City not found
 */
app.get('/cities/:id', (req, res) => {
  const city = cities.find(c => c.id === parseInt(req.params.id));
  if (city) {
    res.json(city);
  } else {
    res.status(404).json({ message: 'City not found' });
  }
});

/**
 * @swagger
 * /cities:
 *   post:
 *     summary: Create a new city
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               population:
 *                 type: integer
 *               country:
 *                 type: string
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Created city
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/City'
 */
app.post('/cities', (req, res) => {
  const newCity = {
    id: nextId++,
    ...req.body
  };
  cities.push(newCity);
  res.status(201).json(newCity);
});

/**
 * @swagger
 * /cities/{id}:
 *   put:
 *     summary: Update a city by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               population:
 *                 type: integer
 *               country:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated city
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/City'
 *       404:
 *         description: City not found
 */
app.put('/cities/:id', (req, res) => {
  const index = cities.findIndex(c => c.id === parseInt(req.params.id));
  if (index !== -1) {
    cities[index] = { id: cities[index].id, ...req.body };
    res.json(cities[index]);
  } else {
    res.status(404).json({ message: 'City not found' });
  }
});

/**
 * @swagger
 * /cities/{id}:
 *   delete:
 *     summary: Delete a city by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: City deleted successfully
 *       404:
 *         description: City not found
 */
app.delete('/cities/:id', (req, res) => {
  const index = cities.findIndex(c => c.id === parseInt(req.params.id));
  if (index !== -1) {
    cities.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'City not found' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
});