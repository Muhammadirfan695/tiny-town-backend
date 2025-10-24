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
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: X-API-KEY
 *     AdminApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: X-API-ADMIN-KEY
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


