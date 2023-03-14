let express = require('express');
let router = express.Router();
const withAuth = require('../middlewares/auth');

const Note = require('../models/note');

//Metodo para verificar se o usuario é dono da nota
const is_owner = (user, note) => {
    if(JSON.stringify(user._id) == JSON.stringify(note.author._id))
        return true;
    else
        return false;
}

//Endpoint para salvar notas
router.post('/', withAuth, async function(req, res) {
    const { title, body } = req.body;

    try {
        let note = new Note({title: title, body: body, author: req.user._id});
        await note.save();
        res.status(200).json(note);
    } catch (error) {
        res.status(401).send(err);
    }
});

//Endpoint para pesquisar notas
router.get('/search', withAuth, async function(req, res) {
    const { query } = req.query;
    try {
        let notes = await Note.find({author: req.user._id }).find({$text: {$search: query}})
        res.json(notes)
    } catch (error) {
        res.json({error: error}).status(500);
    }
});

//Endpoint para baixar uma nota especifica 
router.get('/:id', withAuth, async function(req, res) {
    try {
        const { id } = req.params;
        let note = await Note.findById(id);

        //Se for dono, libera a nota. Se não for, libera erro
        if(is_owner(req.user, note))
            res.json(note);
        else
            res.json({error: "Acess denied"}).status(500);
    } catch (error) {
        res.json({error: 'Problem to see a note'}).status(500)
    }
});

//Endpoint para buscar todas as notas
router.get('/', withAuth, async function(req, res) {
    try {
        let notes = await Note.find({author: req.user._id })
        res.send(notes)
    } catch (error) {
        res.json({error: 'A error hapened. Please try again'}).status(500)
    }
});

//Endpoint para atualizar notas
router.put('/:id', withAuth, async function(req, res) {
    const { title, body } = req.body;
    const { id } = req.params;
    try {
        let note = await Note.findById(id);
        //Se for dono, libera a nota. Se não for, libera erro
        if(is_owner(req.user, note)){
            let note = await Note.findOneAndUpdate(id,
                { $set: { title: title, body: body}},
                { upsert: true, 'new': true }
            )
        }
        else 
            res.json({error: "Acess denied"}).status(500);
        
    } catch (err) {
        res.json({error: 'Problem to update a note'}).status(500)
    }
});

//Endpoint para deletar notas
router.delete('/:id', withAuth, async function(req, res) {
    const { id } = req.params;
    try {
        let note = await Note.findById(id);
        if(note && is_owner(req.user, note)){
            await note.delete();
            res.json({message: 'Note deleted'}).status(204);
        }else{
            res.json({error: 'Acess denied'}).status(403);
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

