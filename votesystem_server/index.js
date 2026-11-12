import express from 'express'
import mysql from 'mysql2/promise'
import { Myconfig } from './configDatebase.js'

const app = express()
app.use(express.json())

let connection

try {
    connection = mysql.createPool(Myconfig)
    await connection.execute('SELECT 1')
    console.log('Database is Successfuly Connected')
} catch (error) {
    console.log('HIBA!', error);
}


app.get('/api/categories', async (req, res) => {
    try {
        const sql = 'SELECT id, name FROM categories ORDER BY name'
        const [rows] = await connection.execute(sql)
        return res.status(200).json(rows)
    } catch (error) {
        console.log(error)
    }
})

app.get('/api/options/:categId', async (req, res) => {
    const { categId } = req.params
    try {
        const sql = 'SELECT o.id, o.name as option, o.descr, o.image, c.name as category FROM options o, categories c WHERE o.categ_id = c.id AND c.id = ? ORDER BY o.name'
        const [rows] = await connection.execute(sql, [categId])
        return res.status(200).json(rows)
    } catch (error) {
        console.log(error)
    }
})

app.get('/api/result/:categId', async (req, res) => {
    const { categId } = req.params
    try {
        const sql = `SELECT c.name AS category, o.name AS option, COUNT(v.user_id) votes_count FROM categories c, options o, votes v
                    WHERE c.id = o.categ_id AND o.id = v.option_id AND c.id=?
                    GROUP BY v.option_id
                    ORDER BY votes_count DESC`
        const [rows] = await connection.execute(sql, [categId])
        return res.status(200).json(rows)
    } catch (error) {
        console.log(error)
    }
})

app.get('/api/check/:categId/:userId', async (req, res) => {
    const { categId, userId } = req.params
    try {
        const sql = `SELECT c.name AS categname, v.id, v.user_id FROM categories c, votes v, options o, users u
        WHERE c.id = o.categ_id AND v.option_id = o.id AND u.id = v.user_id AND v.user_id = ? AND c.id = ?`
        const [rows] = await connection.execute(sql, [userId, categId])
        const hasVoted = rows.length == 0 ? true : false
        return res.status(200).json({hasvoted: hasVoted})
    } catch (error) {
        console.log(error)
    }
})


app.post('/api/votes', async (req, res)=>{
    const {userId, optionId} = req.body
    try {
        const sql= 'INSERT INTO votes (user_id, option_id) VALUES (?,?)'
        await connection.execute(sql, [userId, optionId])
        return res.status(200).json({msg: "sikeres hozzáadás"})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Hiba történt"})
    }
})


app.use((req, res) => {
    res.send("Oldal nem elerhető")
})

const PORT = 8000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
