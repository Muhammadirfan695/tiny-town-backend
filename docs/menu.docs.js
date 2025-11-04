/**
 * @swagger
 * /api/menus/menu:
 *   post:
 *     summary: Create a new menu for a restaurant
 *     description: Creates a menu belonging to a specific restaurant. Each restaurant can have multiple menus, but each menu belongs to only one restaurant.
 *     tags:
 *       - Menu
 *     security:
 *       - ApiKeyAuth: []    
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - restaurant_id
 *               - name
 *               - timingStart
 *               - timingEnd
 *             properties:
 *               restaurant_id:
 *                 type: string
 *                 format: uuid
 *                 example: "b93b3e59-134e-44b4-a421-5022f52c2129"
 *               name:
 *                 type: string
 *                 example: "Breakfast Menu"
 *               description:
 *                 type: string
 *                 example: "Delicious breakfast items served from 7am to 11am"
 *               timingStart:
 *                 type: string
 *                 example: "07:00"
 *                 description: "Start time in HH:mm or HH:mm:ss format"
 *               timingEnd:
 *                 type: string
 *                 example: "11:00"
 *                 description: "End time in HH:mm or HH:mm:ss format (must be after timingStart)"
 *               status:
 *                 type: boolean
 *                 example: true
 *                 description: "Menu active or inactive"
 *               header_image:
 *                 type: string
 *                 format: binary
 *                 description: "Optional header image for the menu"
 *     responses:
 *       200:
 *         description: Menu created successfully
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
 *                   example: "Menu created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "1e6e6de2-7e44-4f8f-8c5b-0e948b9e019d"
 *                     name:
 *                       type: string
 *                       example: "Breakfast Menu"
 *                     restaurant_id:
 *                       type: string
 *                       format: uuid
 *                       example: "b93b3e59-134e-44b4-a421-5022f52c2129"
 *                     timingStart:
 *                       type: string
 *                       example: "07:00"
 *                     timingEnd:
 *                       type: string
 *                       example: "11:00"
 *                     status:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Validation error (missing or invalid fields)
 *       404:
 *         description: Restaurant not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/menus/menu:
 *   get:
 *     summary: Get all menus with filters and pagination
 *     description: Retrieve a list of menus with optional filters such as name, status, timingStart, timingEnd, and restaurant_id.
 *     tags:
 *       - Menu
 *     security:
 *       - ApiKeyAuth: []  
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by menu name (partial match)
 *       - in: query
 *         name: status
 *         schema:
 *           type: boolean
 *         description: Filter by active/inactive status
 *       - in: query
 *         name: timingStart
 *         schema:
 *           type: string
 *           format: time
 *           example: "08:00"
 *         description: Filter menus that start at or after this time (HH:mm)
 *       - in: query
 *         name: timingEnd
 *         schema:
 *           type: string
 *           format: time
 *           example: "18:00"
 *         description: Filter menus that end at or before this time (HH:mm)
 *       - in: query
 *         name: restaurant_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by restaurant ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of menus fetched successfully
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
 *                   example: Menus fetched successfully
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 25
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "a0f72e1b-2f14-41c8-bb99-08dbf6f49744"
 *                       name:
 *                         type: string
 *                         example: "Breakfast Specials"
 *                       description:
 *                         type: string
 *                         example: "Morning menu with healthy options"
 *                       timingStart:
 *                         type: string
 *                         example: "07:00"
 *                       timingEnd:
 *                         type: string
 *                         example: "11:00"
 *                       status:
 *                         type: boolean
 *                         example: true
 *                       restaurant:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "3c7b5c4d-9d47-4a2f-a4d2-dcf66edfc4a5"
 *                           name:
 *                             type: string
 *                             example: "Local Bites"
 *                           address:
 *                             type: string
 *                             example: "123 Main Street, Lahore"
 *       400:
 *         description: Invalid parameters
 *       500:
 *         description: Internal server error
 */



/**
 * @swagger
 * /api/menus/menu:
 *   patch:
 *     summary: Update an existing menu
 *     description: Update menu details and optionally replace header image.
 *     tags:
 *       - Menu
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
 *                 example: "bfe479e2-5319-43bb-aa4a-3fb7749d322e"
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               restaurant_id:
 *                 type: string
 *                 format: uuid
 *               timingStart:
 *                 type: string
 *                 example: "09:00"
 *               timingEnd:
 *                 type: string
 *                 example: "22:00"
 *               status:
 *                 type: boolean
 *                 example: true
 *               header_image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Menu updated successfully
 *       404:
 *         description: Menu not found
 *       500:
 *         description: Internal server error
 */



/**
 * @swagger
 * /api/menus/menu/{id}:
 *   get:
 *     summary: Get menu by ID
 *     description: Retrieve a single menu by its ID including restaurant details.
 *     tags:
 *       - Menu
 *     security:
 *       - ApiKeyAuth: [] 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the menu.
 *     responses:
 *       200:
 *         description: Menu retrieved successfully.
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
 *                   example: Menu retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: 1a2b3c4d-5678-90ef-abcd-1234567890ab
 *                     name:
 *                       type: string
 *                       example: Breakfast Menu
 *                     description:
 *                       type: string
 *                       example: Morning specials including coffee and pancakes
 *                     restaurant:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                           example: 9e8f7d6c-5432-10ab-cdef-998877665544
 *                         name:
 *                           type: string
 *                           example: The Brunch Spot
 *                         address:
 *                           type: string
 *                           example: 123 Main Street, Cityville
 *       400:
 *         description: Invalid or missing ID parameter.
 *       404:
 *         description: Menu not found.
 *       500:
 *         description: Internal server error.
 */


/**
 * @swagger
 * /api/menus/menu/{id}:
 *   delete:
 *     summary: Delete menu by ID
 *     tags:
 *       - Menu
 *     security:
 *       - ApiKeyAuth: [] 
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Menu ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu deleted successfully
 */