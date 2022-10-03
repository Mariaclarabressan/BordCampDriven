import categorySchema from '../schemas/categorySchema.js';
import connection from '../db/database.js';

export async function categoryMiddleware(req, res, next) {
    const category = req.body;
    const authorization = categorySchema.validate(category);

    if (authorization.error) {
        return res.status(400).send("Erro no middleware categoria, estrutura errada")
    }

    const { rows: categoryName } = await connection.query(`SELECT * FROM categories WHERE name= '${req.body.name}'`)

    if(categoryName.length>0){
        return res.status(409).send('Essa categoria já existe')
    }

    next();

}