import connection from '../db/database.js';
import rentalSchema from '../schemas/rentalSchema.js';

export async function rentalMiddleware(req,res,next){
    const {customerId, gameId} = req.body

    const {error} = rentalSchema.validate(req.body,{abortEarly: false})

    if(error){
        return res.status(400).send(error.message)
    }

    const {rows: customerFounded} = await connection.query('SELECT * FROM customers WHERE id = $1;', [customerId]);
    const {rows: gameFounded} = await connection.query('SELECT * FROM games WHERE id = $1;', [gameId]);
   
    const {rows: rentals} = await connection.query('SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL ;' , [gameId]);
   

    if(customerFounded.length === 0 || gameFounded.length === 0 ){
       
        return res.status(400).send('O usuário ou jogo inválidos')
    }

    if(gameFounded[0].stockTotal === rentals.length){
        return res.status(400).send('Jogo indisponível para aluguel')
    }

    res.locals.pricePerDay = gameFounded[0].pricePerDay

    next()
}