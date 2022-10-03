import connection from '../db/database.js';

export async function postGame(req,res) {
    const {name, image, stockTotal, categoryId, pricePerDay} = req.body;

    if(parseInt(stockTotal) <1 || parseInt(pricePerDay) < 1) {
        return res.status(400).send('O estoque e preço não podem ser nulos')
    }    
    


    try {

        const {rows: findTwins } = await connection.query(`SELECT * FROM games WHERE (name) = $1;`, [name]);

        if (findTwins.length >0) {
            return res.status(409).send('Ops esse jogo já existe');
        }


        await connection.query(
            `INSERT INTO games ("name", "image", "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)`, [name, image, parseInt(stockTotal), categoryId, parseInt(pricePerDay)]
        );

        return res.status(201).send('jogo adicionado com sucesso')
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao postar o jogo')
    }
}

export async function getGames(req,res) {
    
    try {

        const { rows: games } = await connection.query('SELECT * FROM games');

        res.status(200).send(games);
    
    } catch (error) {
        console.log(error);
        resizeBy.status(500).send('Erro no get dos games')
    }
}


