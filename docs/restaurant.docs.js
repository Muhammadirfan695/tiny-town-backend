
/**
 * @swagger
 * /api/restaurants/restaurant:
 *   get:
 *     summary: Get a list of all restaurants
 *     description: Retrieves a paginated list of restaurants. Can be accessed by Admin, Manager, and Owner. Supports searching by name, address, and cuisine type.
 *     tags: [Restaurant]
 *     security:
 *       - bearerAuth: []
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of restaurants to return per page.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: A search term to filter restaurants by name, address, or cuisine type.
 *     responses:
 *       200:
 *         description: A list of restaurants.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 succeeded:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Restaurants fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 50
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Restaurant'
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */

/**
 * @swagger
 * /api/restaurants/restaurant/{id}:
 *   get:
 *     summary: Get a single restaurant by ID
 *     description: Retrieves detailed information for a specific restaurant. Accessible by Admin, Manager, and Owner.
 *     tags: [Restaurant]
 *     security:
 *       - bearerAuth: []
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique ID of the restaurant to retrieve.
 *     responses:
 *       200:
 *         description: Detailed information about the restaurant.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       404:
 *         description: Restaurant not found.
 *       401:
 *         description: Unauthorized.
 */

/**
 * @swagger
 * /api/restaurants/restaurant:
 *   patch:
 *     summary: Update a restaurant
 *     description: Updates an existing restaurant's details. Only Admins can re-assign owners and managers. Managers and Owners can update other details.
 *     tags: [Restaurant]
 *     security:
 *       - bearerAuth: []
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 description: The unique ID of the restaurant to update.
 *               name:
 *                 type: string
 *                 description: Restaurant name.
 *               description:
 *                 type: string
 *                 description: Description of the restaurant.
 *               address:
 *                 type: string
 *                 description: Address of the restaurant.
 *               owner_id:
 *                 type: string
 *                 format: uuid
 *                 description: New Owner ID (Admin only).
 *               manager_id:
 *                 type: string
 *                 format: uuid
 *                 description: New Manager ID (Admin only).
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Optional logo file upload.
 *               phone:
 *                 type: string
 *                 description: Restaurant contact number.
 *               email:
 *                 type: string
 *                 description: Restaurant email address.
 *               website:
 *                 type: string
 *                 description: Restaurant website URL.
 *               published:
 *                 type: boolean
 *                 description: Whether the restaurant is published.
 *     responses:
 *       200:
 *         description: Restaurant updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       400:
 *         description: Bad Request or validation error.
 *       404:
 *         description: Restaurant not found.
 *       403:
 *         description: Forbidden (e.g., Manager trying to change the owner).
 */

