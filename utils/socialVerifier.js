const { OAuth2Client } = require("google-auth-library");
const appleSignin = require("apple-signin-auth");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


async function verifyGoogleToken(idToken) {
    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        console.log("payload", payload)
        const [firstName, ...lastNameParts] = payload.name.split(" ");
        const lastName = lastNameParts.join(" ");
        return {
            id: payload.sub,
            email: payload.email,
            firstName,
            lastName,
            avatar: payload.picture || null,
            provider: "google",
        };
    } catch (error) {
        console.error("❌ Google token verification failed:", error.message);
        throw new Error("Invalid Google token");
    }
}


async function verifyAppleToken(idToken) {
    try {
        const data = await appleSignin.verifyIdToken(idToken, {
            audience: 'com.your.app.bundle',
            ignoreExpiration: true,
        });

        const [firstName, ...lastNameParts] = (data.name || "").split(" ");
        const lastName = lastNameParts.join(" ");
        return {
            id: data.sub,
            email: data.email || `${data.sub}@apple.com`,
            firstName,
            lastName,
            name: data.name || null,
            avatar: null,
            provider: 'apple'
        };
    } catch (error) {
        console.error('Apple token verification failed:', error.message);
        return null;
    }
}

async function verifySocialToken(provider, token) {
    switch (provider) {
        case "google":
            return await verifyGoogleToken(token);
        case "apple":
            return await verifyAppleToken(token);
        default:
            throw new Error("Unsupported social provider");
    }
}
module.exports = { verifyGoogleToken, verifyAppleToken, verifySocialToken }