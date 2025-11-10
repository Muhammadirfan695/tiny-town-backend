/**
 * @swagger
 * /api/dashboard/stats:
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
 *       - ApiKeyAuth: []    
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
