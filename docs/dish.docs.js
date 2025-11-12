/**
 * @swagger
 * /api/dishes/dish:
 *   post:
 *     summary: Create a new dish
 *     description: Creates a dish, assigns it to menus, and uploads optional attachments (images).
 *     tags:
 *       - Dish
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Grilled Chicken"
 *                 description: Dish name
 *               description:
 *                 type: string
 *                 example: "Delicious grilled chicken with herbs."
 *                 description: Optional description of the dish
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 12.99
 *                 description: Price of the dish
 *               quantity:
 *                 type: string
 *                 example: "2 person"
 *                 description: Quantity (e.g., '2 person' or '800g')
 *               validity_start:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-11-01T00:00:00Z"
 *                 description: Start date of dish validity
 *               validity_end:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-31T23:59:59Z"
 *                 description: End date of dish validity
 *               published:
 *                 type: boolean
 *                 example: true
 *                 description: Whether the dish is published or not
 *               menuIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 example: ["9b8d9f32-1c4b-45a7-9dbf-fc9a8b8c7a8e"]
 *                 description: List of menu IDs to assign this dish to
 *               restaurant_id:
 *                 type: string
 *                 example: "9b8d9f32-1c4b-45a7-9dbf-fc9a8b8c7a8e"
 *               tags:
 *                 type: string
 *                 description: Comma-separated string or array of tags.
 *                 example: "family,fast-food,casual"
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: One or more image files for the dish
 *     responses:
 *       201:
 *         description: Dish created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Dish created successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "ab12cd34-ef56-7890-gh12-ijkl3456mnop"
 *                     name:
 *                       type: string
 *                       example: "Grilled Chicken"
 *                     price:
 *                       type: number
 *                       example: 12.99
 *                     menus:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           name:
 *                             type: string
 *                     attachments:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           image_name:
 *                             type: string
 *                             example: "grilled_chicken.jpg"
 *                           image_path:
 *                             type: string
 *                             example: "public/images/grilled_chicken.jpg"
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 400
 *                 succeeded:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: "price"
 *                       message:
 *                         type: string
 *                         example: "Price must be a positive number."
 *       401:
 *         description: Unauthorized (API key missing or invalid)
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/dishes/dish/{id}:
 *   get:
 *     summary: Get a single dish by ID
 *     tags:
 *       - Dish
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Dish ID
 *     responses:
 *       200:
 *         description: Dish fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Dish fetch successfully."
 *                 data:
 *                   $ref: '#/components/schemas/Dish'
 *       400:
 *         description: Invalid dish ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Dish ID must be a valid UUID"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Failed to fetch dish"
 */


/**
 * @swagger
 * /api/dishes/dish:
 *   get:
 *     summary: Get all dishes with filters and pagination
 *     tags:
 *       - Dish
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter dishes by name (partial match)
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: validityDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter dishes that are valid on this date
 *       - in: query
 *         name: published
 *         schema:
 *           type: boolean
 *         description: Filter by published status
 *       - in: query
 *         name: quantity
 *         schema:
 *           type: string
 *         description: Filter by quantity (e.g., "2 person", "800g")
 *       - in: query
 *         name: menuIds
 *         schema:
 *           type: string
 *         description: Comma-separated menu IDs to include (fetch dishes that belong to these menus)
 *       - in: query
 *         name: notInMenuIds
 *         schema:
 *           type: string
 *         description: Comma-separated menu IDs to exclude (fetch dishes that are not part of these menus)
 *       - in: query
 *         name: restaurantId
 *         schema:
 *           type: string
 *         description: Filter by restaurant ID (returns dishes belonging to the given restaurant)
 *       - in: query
 *         name: excludeRestaurantId
 *         schema:
 *           type: string
 *         description: Exclude dishes belonging to the given restaurant ID
 *     responses:
 *       200:
 *         description: Dishes fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Dishes fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Dish'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 100
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 10
 */


/**
 * @swagger
 * /api/dishes/dish:
 *   patch:
 *     summary: Update an existing dish
 *     description: Update dish details, manage attachments, and reassign menus.
 *     tags:
 *       - Dish
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the dish to update
 *                 example: "b45f78e0-7f94-4d17-bc3a-91b56ef9923c"
 *               name:
 *                 type: string
 *                 description: Updated name of the dish
 *                 example: "Grilled Chicken"
 *               description:
 *                 type: string
 *                 description: Updated description of the dish
 *                 example: "Juicy grilled chicken with herbs"
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Updated price of the dish
 *                 example: 14.99
 *               quantity:
 *                 type: string
 *                 description: Quantity description (e.g. for how many people)
 *                 example: "2 servings"
 *               validity_start:
 *                 type: string
 *                 format: date
 *                 description: Start date for dish availability
 *                 example: "2025-11-01"
 *               validity_end:
 *                 type: string
 *                 format: date
 *                 description: End date for dish availability
 *                 example: "2025-12-01"
 *               published:
 *                 type: boolean
 *                 description: Whether the dish is published
 *                 example: true
 *               menuIds:
 *                 type: array
 *                 description: List of menu IDs to associate with the dish
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 example: ["9d2fa82b-8a71-4bfa-bd14-f7b5c299d124", "0b3f22a2-bc94-4d77-935b-1e5c11bfb25f"]
 *               existingAttachmentIds:
 *                 type: array
 *                 description: IDs of existing attachments to keep (others will be deleted)
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 example: ["f54a89c7-2b3d-4e11-8b8c-6bb1f14dca64"]
 *               tags:
 *                 type: string
 *                 description: Comma-separated string or array of tags.
 *                 example: "family,fast-food,casual"
 *               restaurant_id:
 *                 type: string
 *                 example: "9b8d9f32-1c4b-45a7-9dbf-fc9a8b8c7a8e"
 *               attachments:
 *                 type: array
 *                 description: New image files to upload
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Dish updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Dish updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Dish'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Dish not found
 *       500:
 *         description: Internal server error
 *
 * components:
 *   schemas:
 *     Dish:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           example: "Grilled Chicken"
 *         description:
 *           type: string
 *           example: "Juicy grilled chicken with herbs"
 *         price:
 *           type: number
 *           example: 14.99
 *         quantity:
 *           type: string
 *           example: "2 servings"
 *         validity_start:
 *           type: string
 *           format: date
 *         validity_end:
 *           type: string
 *           format: date
 *         published:
 *           type: boolean
 *           example: true
 *         menus:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               name:
 *                 type: string
 *         attachments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               file_path:
 *                 type: string
 *                 example: "uploads/dishes/169f23e0.jpg"
 *               file_name:
 *                 type: string
 *                 example: "dish_image.jpg"
 */

/**
 * @swagger
 * /api/dishes/set-menus:
 *   post:
 *     summary: Assign multiple dishes to a single menu
 *     description: Assign one or more dish IDs to a specific menu. This replaces any existing menu assignments for those dishes.
 *     tags:
 *       - Dish
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - menuId
 *               - dishIds
 *             properties:
 *               menuId:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of the menu to assign dishes to
 *                 example: "c1234567-89ab-4cde-9012-3456789abcd"
 *               dishIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 description: Array of dish IDs to be assigned to the menu
 *                 example:
 *                   - "b45f78e0-7f94-4d17-bc3a-91b56ef9923c"
 *                   - "d22f88a0-5a34-4b16-ae8a-55a22fa45cbe"
 *     responses:
 *       200:
 *         description: Dishes assigned successfully
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
 *                   example: "Dishes assigned to menu successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     menuId:
 *                       type: string
 *                       example: "c1234567-89ab-4cde-9012-3456789abcd"
 *                     dishIds:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example:
 *                         - "b45f78e0-7f94-4d17-bc3a-91b56ef9923c"
 *                         - "d22f88a0-5a34-4b16-ae8a-55a22fa45cbe"
 *       404:
 *         description: Menu or some dish IDs do not exist
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
 *                   example: "The following dish IDs do not exist: <ids>"
 *       400:
 *         description: Invalid input data
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
 *                   example: "menuId must be a valid string"
 *       500:
 *         description: Internal server error
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
 *                   example: "Failed to assign dishes to menu"
 */



/**
 * @swagger
 * /api/dishes/dish/{id}:
 *   delete:
 *     summary: Delete a dish
 *     description: Deletes a dish and all its attachments from the server and database.
 *     tags:
 *       - Dish
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the dish to delete
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "b45f78e0-7f94-4d17-bc3a-91b56ef9923c"
 *     responses:
 *       200:
 *         description: Dish deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Dish deleted successfully"
 *       404:
 *         description: Dish not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Dish not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Failed to delete dish"
 *                 error:
 *                   type: string
 *                   example: "Some error message"
 */



/**
 * @swagger
 * /api/dishes/remove-menus:
 *   post:
 *     summary: Assign multiple dishes to a single menu
 *     description: Assign one or more dish IDs to a specific menu. This replaces any existing menu assignments for those dishes.
 *     tags:
 *       - Dish
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - menuId
 *               - dishIds
 *             properties:
 *               menuId:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of the menu to assign dishes to
 *                 example: "c1234567-89ab-4cde-9012-3456789abcd"
 *               dishIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 description: Array of dish IDs to be assigned to the menu
 *                 example:
 *                   - "b45f78e0-7f94-4d17-bc3a-91b56ef9923c"
 *                   - "d22f88a0-5a34-4b16-ae8a-55a22fa45cbe"
 *     responses:
 *       200:
 *         description: Dishes assigned successfully
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
 *                   example: "Dishes assigned to menu successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     menuId:
 *                       type: string
 *                       example: "c1234567-89ab-4cde-9012-3456789abcd"
 *                     dishIds:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example:
 *                         - "b45f78e0-7f94-4d17-bc3a-91b56ef9923c"
 *                         - "d22f88a0-5a34-4b16-ae8a-55a22fa45cbe"
 *       404:
 *         description: Menu or some dish IDs do not exist
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
 *                   example: "The following dish IDs do not exist: <ids>"
 *       400:
 *         description: Invalid input data
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
 *                   example: "menuId must be a valid string"
 *       500:
 *         description: Internal server error
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
 *                   example: "Failed to assign dishes to menu"
 */

