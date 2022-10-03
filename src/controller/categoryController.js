import connection from '../db/database.js';

export async function getCategories(req, res) {
    try {

        const { rows: categories } = await connection.query('SELECT * FROM categories');

        res.status(200).send(categories);
    
    } catch (error) {
        console.log(error);
        resizeBy.status(500).send('Erro no get das Categorias')
    }
}

export async function postCategory(req,res){
    try {

        const addCategory = req.body;

        const showCategory = await connection.query('INSERT INTO categories (name) VALUES ($1)',
        [addCategory.name]
        );

        res.status(201).send(showCategory);
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Não foi possível criar a categoria erro no postCategory')
    }
}

