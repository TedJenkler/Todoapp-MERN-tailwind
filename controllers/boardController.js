const Board = require('../schemas/boardSchema');
const Columns = require('../schemas/columnsSchema');

exports.getAll = async (req, res) => {
    try {
        const boards = await Board.find();
        if (boards.length === 0) {
            return res.status(404).json({ message: 'No boards found' });
        }
        
        res.status(200).json({ message: 'Successfully fetched boards', boards });
    } catch (error) {
        console.error('Error fetching all boards', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const board = await Board.findById(id);
        if(!board) {
            return res.status(404).json({ message: 'No board found' });
        }

        res.status(200).json({ message: 'Successfully fetched board', board});
    }catch (error) {
        console.error('Error fetching board', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.addBoard = async (req, res) => {
    try {
        const { name } = req.body;

        const existingBoard = await Board.findOne({ name: name });
        if(existingBoard) {
            return res.status(400).json({ message: 'Board already exists' });
        }

        const board = new Board({
            name,
        });

        const savedBoard = board.save();

        res.status(201).json({ message: 'Successfully added board', board: savedBoard });
    }catch (error) {
        console.error('Error adding board', error);
        res.status(500).json({ message: 'Internal Server Error'});
    }
};


exports.updateById = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        const updatedBoard = await Board.findByIdAndUpdate(id, { name }, { new: true });
        if (!updatedBoard) {
            return res.status(404).json({ message: 'No board found' });
        }

        res.status(200).json({ message: 'Successfully updated board', board: updatedBoard });
    } catch (error) {
        console.error('Error updating board', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.deleteById = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedBoard = await Board.findByIdAndDelete(id);
        if (!deletedBoard) {
            return res.status(404).json({ message: 'No board found' });
        }

        const filteredColumns = await Columns.find({ boardId: id });
        if (filteredColumns.length === 0) {
            console.log('No columns to delete');
        } else {
            await Columns.deleteMany({ boardId: id });
        }

        res.status(200).json({ message: 'Successfully deleted board and associated columns', board: deletedBoard });
    } catch (error) {
        console.error('Error deleting board', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.deleteAll = async (req, res) => {
    try {
        const deletedBoards = await Board.find();
        const deletedBoardIds = deletedBoards.map(board => board._id);
        
        for (const boardId of deletedBoardIds) {
            await Columns.deleteMany({ boardId: boardId });
        }

        const deleteBoardsResult = await Board.deleteMany();
        if (deleteBoardsResult.deletedCount === 0) {
            return res.status(404).json({ message: 'No boards found' });
        }

        console.log(`${deleteBoardsResult.deletedCount} boards deleted.`);

        res.status(200).json({ message: 'Successfully deleted all boards and associated columns' });
    } catch (error) {
        console.error('Error deleting boards and columns', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};