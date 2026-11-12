import express from 'express'
import mysql from 'mysql2/promise'
import { Myconfig } from './configDatabase.js'

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


app.get('/', (req, res) => {
    return res.status(404).send('404 Page Not Found')
})

app.get('/api/programs', async (req, res) => {
    try {
        const sql = `
        SELECT
            p.id AS id, 
            p.name AS program_name,
            c.icon AS category_icon,
            c.name AS category_name,
            p.max_participants,
            COUNT(pp.participant_id) AS participants
        FROM programs p
        INNER JOIN categories c ON c.id = p.category_id
        LEFT JOIN program_participants pp ON pp.program_id = p.id
        GROUP BY p.id, p.name, c.icon, c.name, p.max_participants;
        `
        const [rows, fields] = await connection.execute(sql)
        return res.status(200).send(rows)

    } catch (error) {
        console.log(error)
    }
})

app.get('/api/categories', async (req, res) => {
    try {
        const sql = 'SELECT c.id, c.name, c.icon FROM categories c'
        const [rows, fields] = await connection.execute(sql)
        return res.status(200).send(rows)
    } catch (error) {
        console.log(error)
    }
})

app.get('/api/programs/:categId', async (req, res) =>{
    const {categId} = req.params
    try {
        const sql = `
        SELECT
            p.id AS id, 
            p.name AS program_name,
            c.icon AS category_icon,
            c.name AS category_name,
            p.max_participants,
            COUNT(pp.participant_id) AS participants
        FROM programs p
        INNER JOIN categories c ON c.id = p.category_id
        LEFT JOIN program_participants pp ON pp.program_id = p.id
        WHERE c.id = ?
        GROUP BY p.id, p.name, c.icon, c.name, p.max_participants;`
        const [rows, fields] = await connection.execute(sql, [+categId])
        return res.status(200).send(rows)
    } catch (error) {
        
    } 
})

app.post('/api/register', async (req, res) => {
    const {programId, userId} = req.body
    try {
        let sql = `
            SELECT 
                p.date,
                p.max_participants,
                COUNT(pp.participant_id) AS participants,
                COUNT(CASE WHEN pp.participant_id = ? THEN 1 END) AS already_registered
            FROM programs p
            LEFT JOIN program_participants pp ON pp.program_id = p.id
            WHERE p.id = ?
            GROUP BY p.id, p.date, p.max_participants;
        `
        let [result] = await connection.execute(sql, [userId ,programId])
        result = result[0]
        console.log(result)
        if(result.participants == result.max_participants){
            return res.status(400).json({msg: "Már nincs szabad hely!"})
        }
        const today=Date().now
        if(result.date<today){
            return res.status(400).json({msg: "A program határideje lejárt!"})
        }
        if(result.already_registered>0){
            return res.status(400).json({msg: "A programra már regisztráltál!"})
        }
        sql = `INSERT INTO program_participants values (?, ?)`
        await connection.execute(sql, [programId, userId])
        return res.status(201).json({msg: "Sikeresen regisztrátál"})

        //each program shouldn't get duplicated votes
    } catch (error) {
        console.log(error)
    }

})



/*api/available
api/check*/


const PORT = 8000
app.listen(PORT, () => {
    console.log('Server is alive on port: '+ PORT)
})