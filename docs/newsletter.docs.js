/**
 * @swagger
 * /api/newsletters/newsletter:
 *   post:
 *     summary: Create a new newsletter (with optional image upload)
 *     description: >
 *       Creates a newsletter with title, content, type, and associations.
 *       You can also upload an image (banner or attachment).  
 *       If an email doesn't exist in the system, it's still added as a recipient with a null user_id.
 *     tags:
 *       - Newsletters
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
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Weekly Deals"
 *               content:
 *                 type: string
 *                 example: "<p>Check out our new offers!</p>"
 *               type:
 *                 type: string
 *                 enum: [manual, weekly]
 *                 default: manual
 *               restaurantId:
 *                 type: string
 *                 format: uuid
 *                 example: "a1b2c3d4-e5f6-7890-1234-56789abcdef0"
 *               recipientEmails:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: email
 *                 example: ["john@example.com", "guest@example.com"]
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Optional multiple image attachments
 *     responses:
 *       201:
 *         description: Newsletter created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 type:
 *                   type: string
 *                 status:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request (validation or upload error)
 *       500:
 *         description: Internal server error
 */



/**
 * @swagger
 * /api/newsletters/newsletter:
 *   patch:
 *     summary: Update an existing newsletter
 *     description: |
 *       Update newsletter details including title, content, type, status, recipient emails, and linked restaurants.
 *       - If a new image file is uploaded, it replaces the old image.
 *       - If `image` is sent as `null`, the old image is deleted.
 *       - If no image or file is sent, the existing image remains unchanged.
 *     tags:
 *       - Newsletters
 *     security:
 *       - bearerAuth: []
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
 *                 description: Newsletter ID to update
 *                 example: "f8a22d3a-12a1-4c9a-931a-28b1bcbf1234"
 *               title:
 *                 type: string
 *                 example: "Winter Deals Newsletter"
 *               content:
 *                 type: string
 *                 example: "<p>Check out our latest winter promotions!</p>"
 *               type:
 *                 type: string
 *                 enum: [manual, weekly]
 *                 example: manual
 *               restaurantId:
 *                 type: string
 *                 format: uuid
 *                 example: "f8a22d3a-12a1-4c9a-931a-28b1bcbf1234"
 *               recipientEmails:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["user1@example.com", "user2@example.com"]
 *               removeAttachmentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 description: IDs of attachments to remove
 *                 example: ["a1b2c3d4-e5f6-7890-1234-56789abcdef0"]
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Upload new files to add as attachments
 *     responses:
 *       200:
 *         description: Newsletter updated successfully
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
 *                   example: "Newsletter updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     content:
 *                       type: string
 *                     type:
 *                       type: string
 *                     status:
 *                       type: string
 *       400:
 *         description: Invalid input or validation error
 *       404:
 *         description: Newsletter not found
 *       500:
 *         description: Server error
 */



/**
 * @swagger
 * /api/newsletters/newsletter/{id}/status:
 *   patch:
 *     summary: Change newsletter status
 *     description: |
 *       Updates the status of a newsletter.  
 *       - Only `draft` newsletters can be changed to `ready`.  
 *       - When changing to `ready`, all recipients will be queued for sending emails.  
 *       - This endpoint does not modify the newsletter content, title, or attachments.
 *     tags:
 *       - Newsletters
 *     security:
 *       - bearerAuth: []
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Newsletter ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [draft, ready, completed]
 *                 description: New status for the newsletter
 *                 example: ready
 *     responses:
 *       200:
 *         description: Newsletter status updated successfully
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
 *                   example: "Newsletter status updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     content:
 *                       type: string
 *                     type:
 *                       type: string
 *                     status:
 *                       type: string
 *                       example: ready
 *       400:
 *         description: Invalid status transition or request
 *       404:
 *         description: Newsletter not found
 *       500:
 *         description: Server error
 */



/**
 * @swagger
 * /api/newsletters/newsletter:
 *   get:
 *     summary: Get all newsletters with pagination and filters
 *     description: Retrieve a paginated list of newsletters with optional filters for title, status, and type.
 *     tags:
 *       - Newsletters
 *     security:
 *       - bearerAuth: []
 *       - ApiKeyAuth: [] 
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page.
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter newsletters by title (partial match).
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, ready, completed]
 *         description: Filter newsletters by status.
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [manual, weekly]
 *         description: Filter newsletters by type.
 *     responses:
 *       200:
 *         description: List of newsletters retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 25
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 3
 *                 newsletters:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       content:
 *                         type: string
 *                       type:
 *                         type: string
 *                         enum: [manual, weekly]
 *                       status:
 *                         type: string
 *                         enum: [draft, ready, completed]
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       restaurants:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             name:
 *                               type: string
 *                       attachments:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             file_path:
 *                               type: string
 *                             file_name:
 *                               type: string
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Internal server error.
 */


/**
 * @swagger
 * /api/newsletters/newsletter/{id}:
 *   get:
 *     summary: Get a newsletter by ID
 *     description: Retrieve a single newsletter by its unique ID, including associated restaurants and attachments.
 *     tags:
 *       - Newsletters
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
 *         description: Unique ID of the newsletter to fetch.
 *     responses:
 *       200:
 *         description: Newsletter fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Newsletter Fetched Successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     content:
 *                       type: string
 *                     type:
 *                       type: string
 *                       enum: [manual, weekly]
 *                     status:
 *                       type: string
 *                       enum: [draft, ready, completed]
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     restaurants:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                     attachments:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           file_path:
 *                             type: string
 *                           file_name:
 *                             type: string
 *       404:
 *         description: Newsletter not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Newsletter not found"
 *                 status:
 *                   type: integer
 *                   example: 404
 *       500:
 *         description: Internal server error.
 */




/**
 * @swagger
 * /api/newsletters/newsletter/{id}:
 *   delete:
 *     summary: Delete a newsletter by ID
 *     description: Delete a single newsletter by its unique ID.
 *     tags:
 *       - Newsletters
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
 *         description: Unique ID of the newsletter to fetch.
 *     responses:
 *       200:
 *         description: Newsletter fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Newsletter Fetched Successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     content:
 *                       type: string
 *                     type:
 *                       type: string
 *                       enum: [manual, weekly]
 *                     status:
 *                       type: string
 *                       enum: [draft, ready, completed]
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     restaurants:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                     attachments:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           file_path:
 *                             type: string
 *                           file_name:
 *                             type: string
 *       404:
 *         description: Newsletter not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Newsletter not found"
 *                 status:
 *                   type: integer
 *                   example: 404
 *       500:
 *         description: Internal server error.
 */
