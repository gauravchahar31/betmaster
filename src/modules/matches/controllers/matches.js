const Matches = require('../models/matches');

exports.getAllMatches = async (req, res) => {
    try {
        const matches = await Matches.findAll({ 
            where: {
                userId: req.user.id, 
                isDeleted: false 
            } 
        });
        res.status(200).json(matches);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMatchById = async (req, res) => {
    try {
        const match = await Matches.findOne({
            where: {
                id: req.params.id,
                isDeleted: false,
                userId: req.user.id
            }
        });

        if (!match) {
            return res.status(404).json({ message: 'Match not found or you do not have permission to view this match' });
        }

        res.status(200).json(match);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createMatch = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const matchData = {
            ...req.body,
            userId: req.user.id
        };

        const match = await Matches.create(matchData);
        res.status(201).json({ message: 'Match created successfully', match });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateMatch = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const match = await Matches.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id,
                isDeleted: false
            }
        });

        if (!match) {
            return res.status(404).json({ message: 'Match not found or you do not have permission to modify this match' });
        }

        await match.update(req.body);
        res.status(200).json({ message: 'Match updated successfully', match });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteMatch = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const match = await Matches.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id,
                isDeleted: false
            }
        });

        if (!match) {
            return res.status(404).json({ message: 'Match not found or you do not have permission to delete this match' });
        }

        await match.update({ isDeleted: true });
        res.status(200).json({ message: 'Match deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.declareWinner = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { id } = req.params;
        const { result } = req.body;

        const match = await Matches.findOne({
            where: {
                id: id,
                userId: req.user.id,
                isDeleted: false
            }
        });

        if (!match) {
            return res.status(404).json({ message: 'Match not found or you do not have permission to declare the winner for this match' });
        }

        if (match.isDeclared) {
            return res.status(400).json({ message: 'The winner has already been declared for this match' });
        }

        await match.update({ result, isDeclared: true });
        res.status(200).json({ message: 'Winner declared successfully', match });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
