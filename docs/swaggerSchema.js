/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and password management
 */

/**
 * @swagger
 * tags:
 *   name: Cities
 *   description: API to manage cities
 */

/**
 * @swagger
 * tags:
 *   name: Countries
 *   description: API to manage countries
 */


/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: API to get stats on Dashboard
 */

/**
 * @swagger
 * tags:
 *   name: Dish
 *   description: API to manage Dishes
 */

/**
 * @swagger
 * tags:
 *   name: Menu
 *   description: API to manage menus
 */

/**
 * @swagger
 * tags:
 *   name: Newsletters
 *   description: API to manage Newsletters
 */


/**
 * @swagger
 * tags:
 *   name: Restaurant
 *   description: Restaurant management 
 */

/**
 * @swagger
 * tags:
 *   name: Role
 *   description: Role management 
 */


/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 */




/**
 * @swagger
 * components:
 *   securitySchemes:
 *     AdminApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: X-API-ADMIN-KEY
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: X-API-KEY
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *         profile_completion:
 *           type: integer
 *           default: 0
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           default: active
 *         avatar:
 *           type: string
 *           format: uri
 */

/**
 * @swagger
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
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         quantity:
 *           type: string
 *         validity_start:
 *           type: string
 *           format: date
 *         validity_end:
 *           type: string
 *           format: date
 *         published:
 *           type: boolean
 *         menus:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *         attachments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               path:
 *                 type: string
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           enum: [Admin, User, Business]
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRole:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         user_id:
 *           type: string
 *           format: uuid
 *         role_id:
 *           type: string
 *           format: uuid
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Restaurant:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "a9e0b238-91e2-4ac4-8231-2a7b3b4dc8e7"
 *         name:
 *           type: string
 *           example: "Pizza Palace"
 *         description:
 *           type: string
 *           example: "The best pizza in town, made with fresh ingredients."
 *         address:
 *           type: string
 *           example: "123 Food Street, Downtown"
 *         country:
 *           type: string
 *           example: "Pakistan"
 *         city:
 *           type: string
 *           example: "Lahore"
 *         latitude:
 *           type: number
 *           format: float
 *           example: 31.582045
 *         longitude:
 *           type: number
 *           format: float
 *           example: 74.329376
 *         phone_number:
 *           type: string
 *           example: "0300-1234567"
 *         opening_hours:
 *           type: string
 *           example: "11:00 AM"
 *         closing_hours:
 *           type: string
 *           example: "12:00 AM"
 *         contact_email:
 *           type: string
 *           format: email
 *           example: "contact@pizzapalace.com"
 *         cuisine_type:
 *           type: string
 *           example: "Italian"
 *         service_model:
 *           type: array
 *           items:
 *             type: string
 *           example: ["dine-in", "takeaway", "delivery"]
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["family", "budget", "fast-food"]
 *         owner_id:
 *           type: string
 *           format: uuid
 *           example: "5341beb8-685b-4872-99df-c89eee5b1db0"
 *         manager_id:
 *           type: string
 *           format: uuid
 *           example: "4c72cf2c-781a-488f-bcea-ea19171d3f9f"
 *         qr_normal:
 *           type: string
 *           example: "/uploads/qrcodes/normal-abc123.png"
 *         qr_light:
 *           type: string
 *           example: "/uploads/qrcodes/light-abc123.png"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-11-06T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-11-06T10:00:00.000Z"
 */
