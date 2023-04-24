import dayjs from "dayjs";
import { ObjectId } from "mongodb";
import { db } from "../database/database.connection.js";
import { operationSchema } from "../schemas/transactions.schemas.js";

export async function postNovaTransacao(req, res) {

    const { value, description } = req.body
    const tipo = req.params.tipo
    const { authorization } = req.headers
    const validation = operationSchema.validate(req.body, { abortEarly: false });
    const token = authorization?.replace("Bearer ", "")
    const session = await db.collection("sessions").findOne({ token })

    if (!token) return res.sendStatus(401)
    if (!session) return res.sendStatus(401)
    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message);
        return res.status(422).send(errors);
    }

    try {

        const infoUser = await db.collection("users").findOne({ _id: new ObjectId(session.userId) })
        await db.collection("transactions").insertOne({
            userId: session.userId,
            value,
            description,
            tipo,
            date: dayjs().format("DD/MM")
        })

        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getHome(req, res) {

    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")
    const session = await db.collection("sessions").findOne({ token })

    if (!token) return res.sendStatus(401)
    if (!session) return res.sendStatus(401)

    try {
        const transactions = await db.collection("transactions").find({ userId: new ObjectId(session.userId) }).toArray()
        res.status(200).send(transactions)
    } catch (err) {
        res.sendStatus(500)
    }
}