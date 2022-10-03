import connection from '../db/database.js'

export async function getAllCustomers(req,res){
    const {cpf} = req.query;

    try {
        
        if(cpf !== undefined){
            const {rows: filteredCustomers} = await connection.query(
                `SELECT * FROM customers WHERE cpf LIKE $1`, [`${cpf}%`]
            );

            console.log('entrou na getAllCustomers')

            res.send(filteredCustomers);
        }else{
            const {rows: customers} = await connection.query(
                `SELECT * FROM customers`
            );

            res.send(customers)
        }

    } catch (error) {
        res.status(500).send('Erro ao buscar a lista de clientes')        
    }
}

export async function getOneCustomer(req,res){
    const {id} = req.params;

    try {
       const {rows: selectedCustomer} = await connection.query(
        `SELECT * FROM customers WHERE id =$1`, [id]
       );

       console.log('entrou na getOneCustomer')
       
       selectedCustomer.length === 0 ? res.sendStatus(404) : res.sendStatus(selectedCustomer);

    } catch (error) {
        res.status(500).send('Erro ao achar um cliente específico')
    }
}

export async function postCustomer(req, res){
    const {name, phone, cpf, birthday} = req.body;

    try {        
        const {rows: findTwins} = await connection.query(
            `SELECT * FROM customers WHERE cpf = $1;`, [cpf]
        );
        
        if (findTwins.length >0) {
            return res.status(409).send('Ops esse cpf já existe');
        }

        console.log('entrou na postCustomer')

        await connection.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`, [name, phone, cpf, birthday]);

        res.status(201).send('Cliente cadastrado com sucesso!')


    } catch (error) {
        res.status(500).send('Erro ao cadastrar novo cliente')
    }
}

export async function upDateCustomer(req,res) {
    const {id} = req.params;
    const {name, phone, cpf, birthday} = req.body;

    const {rows: findTwins} = await connection.query(
        `SELECT * FROM customers WHERE (cpf) = $1;`, [cpf]
    );
    
    if (findTwins.length >0) {
        return res.status(409).send('Ops esse cpf já existe');
    }
    try {

        console.log('entrou na udDateCustomer')
        
        await connection.query(
            `UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5`, [name, phone, cpf, birthday, id]
        );
    } catch (error) {
        res.status(500).send('Erro ao atulizar dados do cliente')        
    }
}

