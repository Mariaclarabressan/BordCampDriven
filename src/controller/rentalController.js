import connection from '../db/database.js';
import dayjs from 'dayjs';

export async function getRentals(req, res) {
    const { customerId, gameId } = req.query;
    try {

        const {rows: rentals} = await connection.query(`
        SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName", games."categoryId", categories.name AS "categoryName"

        FROM rentals
        JOIN customers ON rentals."customerId" = customers.id 
        JOIN games ON rentals."gameId" = games.id  
        JOIN categories ON games."categoryId" = categories.id
        ${customerId ? `WHERE customers.id = ${parseInt(customerId)}` : ""}
        ${gameId ? `WHERE games.id = ${parseInt(gameId)}` : ""};  
        `);        

        const listRentals = rentals.map((rental) => {
            const rentalObject = {
                id: rental.id,
                customerId: rental.customerId,
                gameId: rental.gameId,
                rentDate: rental.rentDate,
                daysRented: rental.daysRented,
                returnDate: rental.returnDate,
                originalPrice: rental.originalPrice,
                delayFee: rental.delayFee,
                customer: {
                    id: rental.customerId,
                    name: rental.customerNane
                },
                game: {
                    id: rental.gameId,
                    name: rental.gameName,
                    categoryId: rental.categoryId,
                    categoryName: rental.categoryName
                },
            };
            return rentalObject;
        });

        res.send(listRentals);

    } catch (error) {
        res.status(500).send(error.message)
    }
}

export async function postRent(req, res) {

    const { customerId, gameId, daysRented } = req.body;

    const rentDate = dayjs().format("YYYY-MM-DD");

    const returnDate = null;

    const delayFee = null;

    try {

        const { rows: pricePerDay } = await connection.query(
            `
            SELECT games."pricePerDay" FROM games WHERE id = $1
            `, [gameId]
        );

        const originalPrice = pricePerDay[0].pricePerDay * daysRented;

        await connection.query(`
        INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)
        ` [
            customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee
        ]);

        res.status(201).send('Aluguel cadastrado com sucesso')

    } catch (error) {
        res.sendStatus(500)
    }
}

export async function returnRental(req, res) {
    const { id } = req.params;

    const returnDate = dayjs().format("YYYY-MM-DD");

    try {

        const { rows: checkRental } = await connection.query(
            `
            SELECT * FROM rentals WHERE id = $1
            `, [id]
        );

        if (checkRental.length === 0) {
            return res.sendStatus(404);
        }

        if (checkRental[0].returnDate !== null) {
            return res.sendStatus(400)
        }

        const pricePerDay =
            parseInt(checkRental[0].originalPrice) /
            parseInt(checkRental[0].daysRented);


        const rentDate = dayjs(checkRental[0].rentDate);

        const daysDelayed = dayjs().diff(rentDate, "dayjs");
        const delayFee = daysDelayed * pricePerDay;

        await connection.query(
            `UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3`, [returnDate, delayFee, id]
        );

        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500)
    }
}

export async function deleteRent(req, res) {
    const { id } = req.params;

    try {

        const { rows: checkRental } = await connection.query(
            `
            SELECT * FROM rentals WHERE id = $1
            `, [id]
        );

        if (checkRental.length === 0) {
            return res.sendStatus(404);
        }
        if (checkRental[0].returnDate !== null) {
            return res.sendStatus(400);
        }

        await connection.query(
            `
            DELETE FROM rentals WHERE id = $1
            `, [id]
        );

        res.sendStatus(200)

    } catch (error) {
        res.sendStatus(500);
    }
}

