const Players = require('../models/players');

exports.getPlayers = async (req, res) => {
    try {
        const players = await Players.findAll({
            where: {
                userId: req.user.id
            }
        });
        res.status(200).json(players);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPlayerById = async (req, res) => {
    try {
        const player = await Players.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });
        if (player) {
            res.status(200).json(player);
        } else {
            res.status(404).json({ message: 'Player not found or not permitted to view this player' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createPlayer = async (req, res) => {
    try {
        const userId = req.user.id;
        const maxPlayers = req.user.numberOfPlayers;

        const playerCount = await Players.count({ where: { userId } });

        if (playerCount >= maxPlayers) {
            return res.status(403).json({ message: 'Maximum number of players reached. Please extend your license to add more players.' });
        }

        const playerData = {
            ...req.body,
            userId,
        };
        const player = await Players.create(playerData);
        res.status(201).json(player);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updatePlayer = async (req, res) => {
    try {
        const updatedData = {
            ...req.body,
            userId: req.user.id,
        };

        const [updated] = await Players.update(updatedData, {
            where: { 
                id: req.params.id, 
                userId: req.user.id 
            }
        });

        if (updated) {
            const updatedPlayer = await Players.findByPk(req.params.id);
            res.status(200).json(updatedPlayer);
        } else {
            res.status(404).json({ message: 'Player not found or you do not have permission to update this player' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePlayer = async (req, res) => {
    try {
        const deleted = await Players.destroy({
            where: {  
                id: req.params.id,
                userId: req.user.id 
            }
        });

        if (deleted) {
            res.status(204).send({ message: 'Player deleted' });
        } else {
            res.status(404).json({ message: 'Player not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};