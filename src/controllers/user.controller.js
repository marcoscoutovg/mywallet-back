import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { db } from "../database/database.connection.js";

export async function postCadastro(req, res) {

    const { name, email, password } = req.body
    const user = await db.collection("users").findOne({ email })
    const hash = bcrypt.hashSync(password, 10);

    try {
        if (user) return res.status(409).send("Usuário já cadastrado")
        await db.collection("users").insertOne({ name, email, password: hash })
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function postLogin(req, res) {
    
    const { email, password } = req.body
    const user = await db.collection("users").findOne({ email })
    const token = uuid();

    try {
        if (!user) return res.status(404).send("E-mail não encontrado")
        if (!bcrypt.compareSync(password, user.password)) return res.status(401).send("Senha incorreta")

        await db.collection("sessions").insertOne({ userId: user._id, token })
        res.status(200).send({name: user.name, token})
    } catch (err) {
        res.status(500).send(err.message);
    }
}