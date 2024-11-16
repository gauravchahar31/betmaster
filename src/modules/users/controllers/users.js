const Users = require('../models/users');
const bcrypt = require('bcryptjs');
const { signToken, extractTokenFromHeader } = require('../../../utils/jwt');
const { alert_user } = require('../../../utils/alerts');

exports.getUsers = async (req, res) => {
    try {
        if(req.user.isMaster){
            const users = await Users.findAll();
            return res.status(200).json(users);
        }
        res.status(401).json({ message: 'You\'re not authorized to access this API.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        if(req.user.isMaster){
            const user = await Users.findByPk(req.params.id);
            if (user) {
                return res.status(200).json(user);
            } else {
                return res.status(404).json({ message: 'User not found' });
            }
        }
        res.status(401).json({ message: 'You\'re not authorized to access this API.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { name, email, password, phoneNumber, licenseExpiry, numberOfPlayers, numberOfConcurrentLogins, reference } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        if(req.user.isMaster){
            const user = await Users.create({
                name,
                email,
                password: hashedPassword,
                phoneNumber,
                licenseExpiry,
                numberOfPlayers,
                numberOfConcurrentLogins,
                reference
            });
            alert_user(req.user, 'Created User', null, req.body);
            return res.status(201).json(user);
        }
        res.status(401).json({ message: 'You\'re not authorized to access this API.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { name, email, phoneNumber, isActive, licenseExpiry, numberOfPlayers, numberOfConcurrentLogins, reference } = req.body;
        if(req.user.isMaster){
            const [updated] = await Users.update({
                name,
                email,
                phoneNumber,
                isActive,
                licenseExpiry,
                numberOfPlayers,
                numberOfConcurrentLogins,
                reference
            }, {
                where: { id: req.params.id }
            });
    
            if (updated) {
                const updatedUser = await Users.findByPk(req.params.id);
                alert_user(req.user, 'Updated User', req.params.id, req.body);
                return res.status(200).json(updatedUser);
            } else {
                return res.status(404).json({ message: 'User not found' });
            }
        }
        res.status(401).json({ message: 'You\'re not authorized to access this API.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        if(req.user.isMaster){
            const deleted = await Users.destroy({
                where: { id: req.params.id }
            });
    
            if (deleted) {
                alert_user(req.user, 'Deleted User', req.params.id);
                return res.status(204).send({ message: 'User deleted' });
            } else {
                return res.status(404).json({ message: 'User not found' });
            }
        }
        res.status(401).json({ message: 'You\'re not authorized to access this API.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Users.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const currentDate = new Date();
        const licenseExpiryDate = new Date(user.licenseExpiry);

        if (licenseExpiryDate < currentDate) {
            return res.status(403).json({ message: 'License has expired. Please renew your license to continue.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const currentTokens = user.tokens || [];
        const maxLogins = user.numberOfConcurrentLogins || 1;

        if (currentTokens.length >= maxLogins) {
            return res.status(403).json({ message: `Maximum concurrent logins (${maxLogins}) reached. Please log out from other devices to continue.` });
        }

        const token = signToken({ id: user.id, email: user.email, name: user.name });

        currentTokens.push(token);
        await user.update({ tokens: currentTokens });

        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.logoutUser = async (req, res) => {
    try {
        const user = await Users.findByPk(req.user.id);
        if (user) {
            const currentToken = extractTokenFromHeader(req);

            const updatedTokens = (user.tokens || []).filter(token => token !== currentToken);

            await user.update({ tokens: updatedTokens });

            res.status(200).json({ message: 'User logged out successfully from the current session.' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.logoutOtherSessions = async (req, res) => {
    try {
        const currentUser = await Users.findByPk(req.user.id);
        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const currentToken = extractTokenFromHeader(req);
        const filteredTokens = (currentUser.tokens || []).filter(token => token === currentToken);

        await currentUser.update({ tokens: filteredTokens });

        res.status(200).json({ message: 'Other sessions have been logged out successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};