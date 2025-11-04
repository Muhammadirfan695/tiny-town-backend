
/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get the authenticated user's profile
 *     description: |
 *       Returns the profile information of the logged-in user.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
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
 *                   example: User profile fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: 123e4567-e89b-12d3-a456-426614174000
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
 *                       example: active
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: Admin
 *                     avatar:
 *                       type: string
 *                       example: https://example.com/uploads/avatar123.jpg
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/users/profile:
 *   patch:
 *     summary: Update the authenticated user's profile
 *     description: |
 *       Updates the profile of the logged-in user.  
 *       If the user uploads a new avatar, the previous one will be replaced.  
 *       Only local users can update their email (which will reset verification).  
 *       If an admin role is detected, they can update any user's profile by passing an `id` in the request body.
 *     tags:
 *       - User
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
 *               phone:
 *                 type: string
 *                 example: "+1 234 567 890"
 *                 description: User's phone number
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
 *                     phone:
 *                       type: string
 *                       example: "+1 234 567 890"
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
