const Users = require('../modules/users/models/users');
const { verifyToken, extractTokenFromHeader } = require('../utils/jwt');

const authenticateUser = async (req, res, next) => {
    const token = extractTokenFromHeader(req);
    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        const decoded = await verifyToken(token);
        req.user = decoded; // Attach decoded token data to req.user

        // Verify if the token is in the user's active tokens
        const user = await Users.findByPk(decoded.id);
        if (!user || !user.tokens.includes(token)) {
            return res.status(401).json({ message: 'Invalid or expired token.' });
        }

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = authenticateUser;
