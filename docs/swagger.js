/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     security:
 *       - ApiKeyAuth: []
 *     summary: User login
 *     description: Login with email and password. Returns user data and JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
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
 *                   example: "Login successful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                           example: "550e8400-e29b-41d4-a716-446655440000"
 *                         firstName:
 *                           type: string
 *                           example: "John"
 *                         lastName:
 *                           type: string
 *                           example: "Doe"
 *                         email:
 *                           type: string
 *                           format: email
 *                           example: "user@example.com"
 *                         avatar:
 *                           type: string
 *                           format: uri
 *                           example: "https://example.com/avatar.png"
 *                         profile_completion:
 *                           type: integer
 *                           example: 0
 *                         status:
 *                           type: string
 *                           example: "active"
 *                         role:
 *                           type: string
 *                           example: "User"
 *                         token:
 *                           type: string
 *                           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Missing email or password
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
 *                   example: "Email and password are required"
 *       401:
 *         description: Invalid email or password
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
 *                   example: "Invalid email or password"
 *       403:
 *         description: User account inactive
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
 *                   example: "User account is inactive"
 *       500:
 *         description: Token generation failed
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
 *                   example: "Failed to generate authentication token"
 */

/**
 * @swagger
 * /api/auth/magic-link:
 *   post:
 *     summary: Send Magic Login Link
 *     description: Generates a secure magic link token and sends it to the user's email for passwordless login.
 *     tags:
 *       - Auth
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *                 description: The email address of the user requesting the magic login link
 *     responses:
 *       200:
 *         description: Magic link sent successfully
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
 *                   example: "Magic link sent to your email"
 *       400:
 *         description: Validation error (invalid email)
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
 *                   example: "Invalid email address"
 *       404:
 *         description: User not found
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
 *                   example: "User with this email does not exist"
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
 *                   example: "Something went wrong"
 */

/**
 * @swagger
 * /api/auth/magic-login:
 *   post:
 *     summary: Login using Magic Link
 *     description: Logs in a user by verifying a magic login token sent via email.
 *     tags:
 *       - Auth
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: Magic login token sent via email
 *                 example: "abcd1234-5678-efgh-9012-ijkl3456mnop"
 *     responses:
 *       200:
 *         description: Successfully logged in
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
 *                   example: "Login Successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         firstName:
 *                           type: string
 *                         lastName:
 *                           type: string
 *                         email:
 *                           type: string
 *                         status:
 *                           type: string
 *                           enum: [active, inactive]
 *                         avatar:
 *                           type: string
 *                         role:
 *                           type: string
 *                         token:
 *                           type: string
 *                           description: JWT token for authentication
 *       400:
 *         description: Invalid or expired token
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
 *                   example: "Invalid or expired magic link"
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Send OTP to reset password
 *     description: Generates an OTP and sends it to the user's email for password reset. OTP expires in 10 minutes.
 *     tags:
 *       - Auth
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: OTP sent successfully
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
 *                   example: "OTP sent successfully"
 *       400:
 *         description: Email is required
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
 *                   example: "Email is required"
 *       404:
 *         description: User not found
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
 *                   example: "No User Found"
 */


/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     description: Resets the user's password using a valid OTP. Password and confirm password must match.
 *     tags:
 *       - Auth
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *               - password
 *               - confirmPassword
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "123456"
 *                 description: OTP sent to user's email
 *               password:
 *                 type: string
 *                 example: "NewPassword123!"
 *                 description: New password
 *               confirmPassword:
 *                 type: string
 *                 example: "NewPassword123!"
 *                 description: Confirm the new password
 *     responses:
 *       200:
 *         description: Password reset successfully
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
 *                   example: "Password reset successfully"
 *       400:
 *         description: Validation error or expired/invalid OTP
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
 *                   example: "Otp, Password and Confirm Password are Required"
 *       404:
 *         description: User not found
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
 *                   example: "Invalid or expired Token"
 */


/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change password for logged-in user
 *     description: Allows a logged-in user to change their password by providing the current or new password and confirm password.
 *     tags:
 *       - Auth
 *     security:
 *       - ApiKeyAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - password
 *               - confirmPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 example: "NewPassword123!"
 *                 description: The current password
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "NewPassword123!"
 *                 description: The new password
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: "NewPassword123!"
 *                 description: Must match the new password
 *     responses:
 *       200:
 *         description: Password changed successfully
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
 *                   example: "Password changed successfully"
 *                 data:
 *                   type: object
 *                   nullable: true
 *       400:
 *         description: Validation error (e.g., passwords missing or do not match)
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
 *                   example: "Password and Confirm Password do not match"
 *       401:
 *         description: Unauthorized (if no bearer token or invalid token)
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
 *                   example: "Unauthorized"
 *       404:
 *         description: User not found
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
 *                   example: "User not found"
 */




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































