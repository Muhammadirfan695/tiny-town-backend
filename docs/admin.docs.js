
/**
 * @swagger
 * /api/admin/users:
 *   post:
 *     summary: Create a new user (Admin)
 *     description: Admin can create a user by providing basic details. A magic link will be sent to the user's email for login and password setup.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *       - AdminApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - role
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               role:
 *                 type: string
 *                 example: "admin"
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 default: active
 *                 example: active
 *     responses:
 *       200:
 *         description: User created successfully and magic link sent
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
 *                   example: "Magic Link Sent Successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     link:
 *                       type: string
 *                       example: "https://yourapp.com/magic-login?token=abcd1234"
 *       400:
 *         description: Validation error or user already exists
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
 *                   example: "User already exists"
 *       500:
 *         description: Server error
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
 *                   example: "Failed to send magic link"
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     description: |
 *       Fetch a paginated list of all users.  
 *       Supports filters for name, email, status, verification status, and soft-deleted users.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *       - AdminApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of users per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Filter by user status
 *       - in: query
 *         name: verified
 *         schema:
 *           type: boolean
 *         description: Filter by verified users
 *       - in: query
 *         name: firstName
 *         schema:
 *           type: string
 *         description: Filter by first name (partial match)
 *       - in: query
 *         name: lastName
 *         schema:
 *           type: string
 *         description: Filter by last name (partial match)
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter by email (partial match)
 *       - in: query
 *         name: deleted
 *         schema:
 *           type: boolean
 *           example: true
 *         description: |
 *           If `true`, only fetch soft-deleted users.  
 *           If omitted or `false`, fetch only active (non-deleted) users.
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Users fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 45
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                             example: "7e8f1f5b-d6e0-4b3b-9820-f2bfa4c4c2af"
 *                           firstName:
 *                             type: string
 *                             example: John
 *                           lastName:
 *                             type: string
 *                             example: Doe
 *                           email:
 *                             type: string
 *                             example: john.doe@example.com
 *                           status:
 *                             type: string
 *                             example: active
 *                           verified:
 *                             type: boolean
 *                             example: true
 *       400:
 *         description: Bad request (invalid query or parameters)
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/user:
 *   patch:
 *     summary: Update the user
 *     description: |
 *       Updates  user.  
 *       If the user uploads a new avatar, the previous one will be replaced.  
 *       Only local users can update their email (which will reset verification).  
 *       If an admin role is detected, they can update any user's profile by passing an `id` in the request body.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *       - AdminApiKeyAuth: []
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
 *                 example: "8d2a5f9e-3a24-4e89-9f61-98e8b6c41234"
 *                 description: User ID to update (required for admin updates only)
 *               firstName:
 *                 type: string
 *                 example: John
 *                 description: User's first name
 *               lastName:
 *                 type: string
 *                 example: Doe
 *                 description: User's last name
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *                 description: New email address (local users only)
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "Admin"
 *                 description: Role IDs or role names to assign (admins only)
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: New avatar image file
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 description: Updated user status
 *                 example: active
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: Admin
 *                     avatar:
 *                       type: string
 *                       example: https://example.com/uploads/avatar123.jpg
 *       400:
 *         description: Invalid request or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Failed to update user
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: |
 *       Retrieves a user's full profile by their unique ID.  
 *       Only **admins** can use this endpoint.  
 *       The response includes basic user details, assigned roles, and avatar (if available).
 *     tags:
 *       - Admin
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
 *           example: "8d2a5f9e-3a24-4e89-9f61-98e8b6c41234"
 *         description: The unique ID of the user to retrieve
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "8d2a5f9e-3a24-4e89-9f61-98e8b6c41234"
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *                     status:
 *                       type: string
 *                       enum: [active, inactive]
 *                       example: active
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: Admin
 *                     avatar:
 *                       type: string
 *                       example: https://example.com/uploads/avatar123.jpg
 *       400:
 *         description: Invalid user ID or request format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Invalid user ID
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/user/{id}:
 *   delete:
 *     summary: Delete a user (soft or hard)
 *     description: |
 *       Deletes a user by ID.  
 *       By default, this performs a **soft delete** (marks the user as inactive and sets `deletedAt`).  
 *       To permanently delete the user and all related records, pass `?hardDelete=true` in the query.
 *     tags:
 *       - Admin
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
 *         description: The UUID of the user to delete
 *       - in: query
 *         name: hardDelete
 *         required: false
 *         schema:
 *           type: boolean
 *           example: false
 *         description: |
 *           Set to `true` for a permanent (hard) delete.  
 *           Default is `false`, which performs a soft delete.
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User soft-deleted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: 5b69f043-933f-492e-8983-a87b55180b59
 *                     deleted:
 *                       type: boolean
 *                       example: true
 *                     hardDeleted:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Invalid request or failed to delete user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Failed to delete user
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/user/{id}:
 *   post:
 *     summary: Restore a user
 *     description: |
 *       Restore a user by ID.
 *     tags:
 *       - Admin
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
 *         description: The UUID of the user to restore
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User soft-deleted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: 5b69f043-933f-492e-8983-a87b55180b59
 *                     deleted:
 *                       type: boolean
 *                       example: true
 *                     hardDeleted:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Invalid request or failed to delete user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Failed to delete user
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/admin/accept-reject:
 *   post:
 *     summary: Approve or reject a signup request
 *     description: >
 *       Allows admin to approve or reject a pending signup request.  
 *       If approved — a new user account is created automatically, assigned the role from the signup request, and notified via email.  
 *       If rejected — the request is marked as rejected with a reason and the user is notified by email.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *       - AdminApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - action
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the signup request to act upon
 *                 example: "f9a5b3b0-3c2d-4b85-b5ad-8c92fa2e5f7c"
 *               action:
 *                 type: string
 *                 enum: [approve, reject]
 *                 description: Action to perform on the signup request
 *               reason:
 *                 type: string
 *                 description: Optional reason for rejection (required only when action is "reject")
 *                 example: "Insufficient details provided"
 *     responses:
 *       200:
 *         description: Signup request processed successfully
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
 *                   example: Signup request approved and user created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Invalid action or missing data
 *       404:
 *         description: Signup request not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/admin/restaurant:
 *   post:
 *     summary: Create a new restaurant (Admin only)
 *     description: |
 *       Allows an admin to create a new restaurant.
 *       - Assigns an owner and a manager using their existing User IDs.
 *       - Uploads a logo and a header image.
 *       - **Important:** For `service_model`, provide a valid JSON array as a single string.
 *     tags: [Admin]
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
 *                 example: "+92-300-1234567"
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
 *                 description: "UUID of an existing user with the 'Owner' role."
 *                 example: "5341beb8-685b-4872-99df-c89eee5b1db0"
 *               manager_id:
 *                 type: string
 *                 format: uuid
 *                 description: "UUID of an existing user with the 'Manager' role."
 *                 example: "4c72cf2c-781a-488f-bcea-ea19171d3f9f"
 *               website:
 *                 type: string
 *                 description: Website URL of the restaurant.
 *                 example: "https://pizzapalace.com"
 *               postal_code:
 *                 type: string
 *                 description: Postal/ZIP code of the restaurant.
 *                 example: "54000"
 *               total_weekly_hours:
 *                 type: number
 *                 description: Total number of operating hours per week.
 *                 example: 56
 *               country:
 *                 type: string
 *                 example: "Pakistan"
 *               city:
 *                 type: string
 *                 example: "Lahore"
 *               latitude:
 *                 type: number
 *                 format: float
 *                 example: 31.5204
 *               longitude:
 *                 type: number
 *                 format: float
 *                 example: 74.3587
 *               tags:
 *                 type: string
 *                 description: "Comma-separated tags or array of tags."
 *                 example: "pizza,fast food,dine-in"
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: "The restaurant's logo image file (.png, .jpg, etc.)."
 *               header_image:
 *                 type: string
 *                 format: binary
 *                 description: "The restaurant's header/banner image file."
 *     responses:
 *       201:
 *         description: Restaurant created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       400:
 *         description: Bad Request (e.g., invalid coordinates or invalid tags format).
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
 *                   example: "Invalid latitude value"
 *       401:
 *         description: Unauthorized (invalid or missing token).
 *       403:
 *         description: Forbidden (user is not an Admin).
 *       422:
 *         description: Validation Failed (e.g., missing required fields or invalid format).
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
 * /api/admin/restaurant:
 *   get:
 *     summary: Get a list of all restaurants
 *     description: Retrieves a paginated list of restaurants. Can be accessed by Admin, Manager, and Owner. Supports searching by name, address, and cuisine type.
 *     tags: [Admin]
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
 * /api/admin/restaurant/{id}:
 *   get:
 *     summary: Get a single restaurant by ID
 *     description: Retrieves detailed information for a specific restaurant. Accessible by Admin, Manager, and Owner.
 *     tags: [Admin]
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
 * /api/admin/restaurant:
 *   patch:
 *     summary: Update a restaurant
 *     description: Updates an existing restaurant's details. Only Admins can re-assign owners and managers. Managers and Owners can update other details.  
 *       The restaurant ID must be provided in the request body.
 *     tags: [Admin]
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
 *               website:
 *                 type: string
 *                 description: Website URL of the restaurant.
 *                 example: "https://pizzapalace.com"
 *               postal_code:
 *                 type: string
 *                 description: Postal/ZIP code of the restaurant.
 *                 example: "54000"
 *               total_weekly_hours:
 *                 type: number
 *                 description: Total number of operating hours per week.
 *                 example: 56
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
 * /api/admin/restaurant/{id}:
 *   delete:
 *     summary: Delete a restaurant (Admin only)
 *     description: Permanently deletes a restaurant from the database. This action is restricted to Admins.
 *     tags: [Admin]
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



/**
 * @swagger
 * /api/admin/menu:
 *   post:
 *     summary: Create a new menu for a restaurant
 *     description: Creates a menu belonging to a specific restaurant. Each restaurant can have multiple menus, but each menu belongs to only one restaurant.
 *     tags:
 *       - Admin
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
 * /api/admin/menu:
 *   get:
 *     summary: Get all menus with filters and pagination
 *     description: Retrieve a list of menus with optional filters such as name, status, timingStart, timingEnd, and restaurant_id.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *       - AdminApiKeyAuth: [] 
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
 * /api/admin/menu:
 *   patch:
 *     summary: Update an existing menu
 *     description: Update menu details and optionally replace header image.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *       - AdminApiKeyAuth: [] 
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
 * /api/admin/menu/{id}:
 *   get:
 *     summary: Get menu by ID
 *     description: Retrieve a single menu by its ID including restaurant details.
 *     tags:
 *       - Admin
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
 * /api/admin/menu/{id}:
 *   delete:
 *     summary: Delete menu by ID
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *       - AdminApiKeyAuth: []
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







/**
 * @swagger
 * /api/admin/dish:
 *   post:
 *     summary: Create a new dish
 *     description: Creates a dish, assigns it to menus, and uploads optional attachments (images).
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *       - AdminApiKeyAuth: []
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
 * /api/admin/dish/{id}:
 *   get:
 *     summary: Get a single dish by ID
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *       - AdminApiKeyAuth: []
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
 * /api/admin/dish:
 *   get:
 *     summary: Get all dishes with filters and pagination
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *       - AdminApiKeyAuth: []
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
 * /api/admin/dish:
 *   patch:
 *     summary: Update an existing dish
 *     description: Update dish details, manage attachments, and reassign menus.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *       - AdminApiKeyAuth: []
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
 * /api/admin/set-menus:
 *   post:
 *     summary: Assign menus to a dish
 *     description: Assign one or more menus to a dish. This will replace any existing menus linked to the dish.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *       - AdminApiKeyAuth: []
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
 * /api/admin/dish/{id}:
 *   delete:
 *     summary: Delete a dish
 *     description: Deletes a dish and all its attachments from the server and database.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *       - AdminApiKeyAuth: []
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
 * /api/admin/remove-menus:
 *   post:
 *     summary: Assign menus to a dish
 *     description: Assign one or more menus to a dish. This will replace any existing menus linked to the dish.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *       - AdminApiKeyAuth: []
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
 * /api/admin/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics based on user role
 *     description: |
 *       Returns aggregated statistics depending on the user's role.
 *       - **Admin**: Total counts of Users, Managers, Owners, Restaurants, Menus, and Dishes.
 *       - **Manager**: Total Restaurants, Menus, and Dishes managed by the manager.
 *       - **Owner**: Total Restaurants, Menus, and Dishes owned by the owner.
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: [] 
 *       - AdminApiKeyAuth: []    
 *     responses:
 *       200:
 *         description: Dashboard statistics fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 succeeded:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Dashboard statistics fetched successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: integer
 *                       example: 100
 *                     totalManagers:
 *                       type: integer
 *                       example: 10
 *                     totalOwners:
 *                       type: integer
 *                       example: 20
 *                     totalRestaurants:
 *                       type: integer
 *                       example: 50
 *                     totalMenus:
 *                       type: integer
 *                       example: 150
 *                     totalDishes:
 *                       type: integer
 *                       example: 600
 *       403:
 *         description: Access denied or invalid role.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 succeeded:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Access Denied or Invalid Role.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 succeeded:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Failed to fetch dashboard statistics.
 */
