import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { db } from "../database/database.connection.js";
import { signInSchema, signUpSchema } from "../schemas/users.schemas.js";

export async function postCadastro(req, res) {

    const { name, email, password } = req.body
    const user = await db.collection("users").findOne({ email })
    const validation = signUpSchema.validate(req.body, { abortEarly: false });
    const hash = bcrypt.hashSync(password, 10);

    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message);
        return res.status(422).send(errors);
    }

    try {
        if (user) return res.sendStatus(409)
        await db.collection("users").insertOne({ name, email, password: hash })
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function postLogin(req, res) {
    
    const { email, password } = req.body
    const user = await db.collection("users").findOne({ email })
    const validation = signInSchema.validate(req.body, { abortEarly: false });
    const token = uuid();

    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message);
        return res.status(422).send(errors);
    }

    try {
        if (!user) return res.status(404).send("E-mail não encontrado")
        if (!bcrypt.compareSync(password, user.password)) return res.status(401).send("Senha incorreta")

        await db.collection("sessions").insertOne({ userId: user._id, token })
        res.status(200).send({name: user.name, token})
    } catch (err) {
        res.status(500).send(err.message);
    }
}