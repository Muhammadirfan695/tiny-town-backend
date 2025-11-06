const { generateQRCode } = require("../utils/qrCodes");



const generateRestaurantQRCodes = async (restaurantId, token) => {
    const restaurantUrl = `https://frontend.com/restaurant/${restaurantId}?token=${token}`;

    const normal = await generateQRCode(
        restaurantUrl,
        `restaurant_${restaurantId}_normal.png`,
        { fgColor: "#000000", bgColor: "#ffffff" }
    );

    const light = await generateQRCode(
        restaurantUrl,
        `restaurant_${restaurantId}_light.png`,
        { fgColor: "#222222", bgColor: "#f9f9f9" }
    );

    return { normal, light };
};

const generateMenuQRCodes = async (restaurantId, menuId, token) => {
    const menuUrl = `https://frontend.com/restaurant/${restaurantId}/menu/${menuId}?token=${token}`;

    const normal = await generateQRCode(
        menuUrl,
        `restaurant_${restaurantId}_menu_${menuId}_normal.png`,
        { fgColor: '#000000', bgColor: '#ffffff' }
    );

    const light = await generateQRCode(
        menuUrl,
        `restaurant_${restaurantId}_menu_${menuId}_light.png`,
        { fgColor: '#222222', bgColor: '#f9f9f9' }
    );

    return { normal, light };
};


module.exports = {
    generateRestaurantQRCodes,
    generateMenuQRCodes,
};   