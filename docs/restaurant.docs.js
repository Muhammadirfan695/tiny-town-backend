
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
 *         description: Search term to filter restaurants by name, address, or cuisine type.
 *       - in: query
 *         name: owner_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter restaurants by their owner ID.
 *       - in: query
 *         name: manager_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter restaurants by their manager ID.
 *       - in: query
 *         name: cuisine
 *         schema:
 *           type: string
 *         description: Filter by cuisine type (e.g., Italian, Chinese, etc.).
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Filter by country.
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city.
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *           example: "family,outdoor"
 *         description: Filter by one or more tags (comma-separated).
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *           format: float
 *           example: 31.5204
 *         description: Latitude for distance-based filtering.
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *           format: float
 *           example: 74.3587
 *         description: Longitude for distance-based filtering.
 *       - in: query
 *         name: maxDistance
 *         schema:
 *           type: number
 *           format: float
 *           default: 10
 *         description: Maximum distance (in kilometers) from the provided latitude and longitude.
 *       - in: query
 *         name: openToday
 *         schema:
 *           type: boolean
 *           example: true
 *         description: Filter restaurants that are currently open based on opening and closing hours.
 *     responses:
 *       200:
 *         description: A list of restaurants matching the filter criteria.
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
 *                     restaurants:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Restaurant'
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: Internal server error.
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
 *                 example: "a8b4c7e2-91d9-4b2b-bdf8-f7a54e8cd2b2"
 *               name:
 *                 type: string
 *                 description: Restaurant name.
 *                 example: "Pizza Palace"
 *               description:
 *                 type: string
 *                 description: Description of the restaurant.
 *                 example: "Authentic Italian pizzas made with fresh ingredients."
 *               address:
 *                 type: string
 *                 description: Restaurant address.
 *                 example: "123 Food Street, Downtown"
 *               country:
 *                 type: string
 *                 example: "Pakistan"
 *               city:
 *                 type: string
 *                 example: "Lahore"
 *               latitude:
 *                 type: number
 *                 format: float
 *                 description: Latitude between -90 and 90.
 *                 example: 31.582045
 *               longitude:
 *                 type: number
 *                 format: float
 *                 description: Longitude between -180 and 180.
 *                 example: 74.329376
 *               phone_number:
 *                 type: string
 *                 example: "+923001234567"
 *               contact_email:
 *                 type: string
 *                 format: email
 *                 example: "info@pizzapalace.com"
 *               cuisine_type:
 *                 type: string
 *                 example: "Italian"
 *               service_model:
 *                 type: string
 *                 description: A JSON array string (e.g., '["dine-in", "takeaway", "delivery"]').
 *                 example: '["dine-in", "takeaway"]'
 *               tags:
 *                 type: string
 *                 description: Comma-separated string or array of tags.
 *                 example: "family,fast-food,casual"
 *               owner_id:
 *                 type: string
 *                 format: uuid
 *                 description: New Owner ID (Admin only).
 *                 example: "5341beb8-685b-4872-99df-c89eee5b1db0"
 *               manager_id:
 *                 type: string
 *                 format: uuid
 *                 description: New Manager ID (Admin only).
 *                 example: "4c72cf2c-781a-488f-bcea-ea19171d3f9f"
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Optional logo file upload.
 *               header_image:
 *                 type: string
 *                 format: binary
 *                 description: Optional header/banner image file upload.
 *     responses:
 *       200:
 *         description: Restaurant updated successfully.
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
 *                   example: "Restaurant updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Restaurant'
 *       400:
 *         description: Bad Request — validation or JSON parsing error.
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
 *                     example: {"latitude": "Latitude must be between -90 and 90"}
 *       403:
 *         description: Forbidden — Only admins can reassign owner or manager.
 *       404:
 *         description: Restaurant not found.
 *       500:
 *         description: Server error while updating restaurant.
 */


/**
 * @swagger
 * /api/restaurants/add-favourites:
 *   post:
 *     summary: Add a restaurant to the user's favorites
 *     description: Allows a user (role "user") to add a restaurant to their list of favorites.
 *     tags: [Restaurant]
 *     security:
 *       - bearerAuth: []
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - restaurant_id
 *             properties:
 *               restaurant_id:
 *                 type: string
 *                 format: uuid
 *                 example: "d1f2a345-678b-4c9e-b123-7a5e8a1f5c3b"
 *     responses:
 *       201:
 *         description: Restaurant added to favorites successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FavouriteRestaurant'
 *       400:
 *         description: Invalid input or already favorited.
 *       403:
 *         description: Forbidden — only users with role "user" can add favorites.
 *       404:
 *         description: Restaurant not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/restaurants/remove-favourites/{restaurant_id}:
 *   delete:
 *     summary: Remove a restaurant from user's favorites
 *     description: Allows a user (role "user") to remove a restaurant from their favorites list..
 *     tags: [Restaurant]
 *     security:
 *       - bearerAuth: []
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurant_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the restaurant to remove from favorites.
 *     responses:
 *       200:
 *         description: Restaurant removed from favorites successfully.
 *       403:
 *         description: Forbidden — only users with role "user" can remove favorites.
 *       404:
 *         description: Favorite not found.
 *       500:
 *         description: Internal server error.
 */


/**
 * @swagger
 * /api/restaurants/favourites:
 *   get:
 *     summary: Get user's favorite restaurants
 *     description: Fetch all restaurants added to favorites by the logged-in user..
 *     tags: [Restaurant]
 *     security:
 *       - bearerAuth: []
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched favorite restaurants.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FavouriteRestaurant'
 *       401:
 *         description: Unauthorized — missing or invalid token.
 *       500:
 *         description: Internal server error.
 */