/**
 * @swagger
 * /api/admin/restaurants:
 *   post:
 *     summary: Create a new restaurant (Admin only)
 *     description: |
 *       Allows an admin to create a new restaurant.
 *       - Assigns an owner and a manager using their existing User IDs.
 *       - Uploads a logo and a header image.
 *       - **Important:** For `service_model`, provide a valid JSON array as a single string.
 *     tags: [Restaurant]
 *     security:
 *       - bearerAuth: []
 *       - AdminApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Pizza Palace"
 *               description:
 *                 type: string
 *                 example: "The best pizza in town, made with fresh ingredients."
 *               address:
 *                 type: string
 *                 example: "123 Food Street, Downtown"
 *               phone_number:
 *                 type: string
 *                 example: "0300-1234567"
 *               opening_hours:
 *                 type: string
 *                 example: "11:00 AM"
 *               closing_hours:
 *                 type: string
 *                 example: "12:00 AM"
 *               contact_email:
 *                 type: string
 *                 format: email
 *                 example: "contact@pizzapalace.com"
 *               cuisine_type:
 *                 type: string
 *                 example: "Italian"
 *               service_model:
 *                 type: string
 *                 description: "A JSON array formatted as a STRING. Must use double quotes."
 *                 example: '["dine-in", "takeaway", "delivery"]'
 *               owner_id:
 *                 type: string
 *                 format: uuid
 *                 description: "The UUID of an existing user with the 'Owner' role."
 *                 example: "5341beb8-685b-4872-99df-c89eee5b1db0"
 *               manager_id:
 *                 type: string
 *                 format: uuid
 *                 description: "The UUID of an existing user with the 'Manager' role."
 *                 example: "4c72cf2c-781a-488f-bcea-ea19171d3f9f"
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: The restaurant's logo image file (.png, .jpg, etc.).
 *               header_image:
 *                 type: string
 *                 format: binary
 *                 description: The restaurant's header/banner image file.
 *     responses:
 *       201:
 *         description: Restaurant created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       400:
 *         description: Bad Request (e.g., Owner/Manager ID not found).
 *       401:
 *         description: Unauthorized (invalid or missing token).
 *       403:
 *         description: Forbidden (user is not an Admin).
 *       422:
 *         description: Validation Failed (e.g., name is empty, email is invalid).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 succeeded:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Validation failed"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     example: {"name": "Name is required."}
 */

/**
 * @swagger
 * /api/admin/restaurants:
 *   get:
 *     summary: Get a list of all restaurants
 *     description: Retrieves a paginated list of restaurants. Can be accessed by Admin, Manager, and Owner. Supports searching by name, address, and cuisine type.
 *     tags: [Restaurant]
 *     security:
 *       - bearerAuth: []
 *       - AdminApiKeyAuth: []
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
 * /api/admin/restaurants/{id}:
 *   get:
 *     summary: Get a single restaurant by ID
 *     description: Retrieves detailed information for a specific restaurant. Accessible by Admin, Manager, and Owner.
 *     tags: [Restaurant]
 *     security:
 *       - bearerAuth: []
 *       - AdminApiKeyAuth: []
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
 * /api/admin/restaurants/{id}:
 *   patch:
 *     summary: Update a restaurant
 *     description: Updates an existing restaurant's details. Only Admins can re-assign owners and managers. Managers and Owners can update other details.
 *     tags: [Restaurant]
 *     security:
 *       - bearerAuth: []
 *       - AdminApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique ID of the restaurant to update.
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               # ... include all other restaurant fields as optional
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
 *         description: Forbidden (e.g., a Manager trying to change the owner).
 */

/**
 * @swagger
 * /api/admin/restaurants/{id}:
 *   delete:
 *     summary: Delete a restaurant (Admin only)
 *     description: Permanently deletes a restaurant from the database. This action is restricted to Admins.
 *     tags: [Restaurant]
 *     security:
 *       - bearerAuth: []
 *       - AdminApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique ID of the restaurant to delete.
 *     responses:
 *       200:
 *         description: Restaurant deleted successfully.
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
 *                   example: "Restaurant deleted successfully"
 *       404:
 *         description: Restaurant not found.
 *       403:
 *         description: Forbidden (user is not an Admin).
 *       401:
 *         description: Unauthorized.
 */