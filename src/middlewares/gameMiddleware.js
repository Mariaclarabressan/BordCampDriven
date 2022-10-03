import connection from '../db/database.js';
import gameSchema from '../schemas/gameSchema.js';


export async function gameMiddleware(req, res, next) {
    const {categoryId, name} = req.body

    const {error} = gameSchema.validate(req.body, {abortEarly:false})

    if(error) {
        return res.status(400).send(error)
    }

    const {rows: selectedCategory } = await connection.query('SELECT * FROM categories WHERE id = $1;', [categoryId])

    const {rows: selectedGame} = await connection.query('SELECT * FROM games WHERE LOWER (name) LIKE $1;', [name])


    if(selectedCategory.length === 0){
        return res.status(400).send('a categoria selecionada não existe')
    }else if(selectedGame.length > 0) {
        return res.status(409).send('Esse jogo já existe')
    }

    next()
}

