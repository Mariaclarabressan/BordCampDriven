import connection from '../db/database.js'
import customerSchema from '../schemas/customerSchema.js'

export async function customerMiddleware(req,res,next) {
    const {cpf} = req.body
    const {customerId} = req.params

    const {rows: customerExist} = await connection.query('SELECT * FROM customers WHERE id = $1;', [customerId])

    if(customerExist.lenght === 0 && customerId){
        return res.status(404).send('esse usuário não existe')
    }    

    const{error} = customerSchema.validate(req.body, {abortEarly: false})    

    if(error){
        return res.status(400).send(error.message)
    }   

    const {rows: customerFunded} = await connection.query('SELECT * FROM customers WHERE cpf = $1;', [cpf])
    
    if(customerFunded.length>0 && customerFunded[0].id !== Number(customerId)){
        console.log(customerFunded)
        return res.status(409).send('esse CPF já foi cadastrado')
    }
    
    next()
}
