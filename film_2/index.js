import express from 'express'
import { movies } from './data.js'

const app = (express())

app.use(express.json())

app.get('/movies', (req, res) => {
    res.status(200).json(movies)
})

app.get('/movies/:id', (req, res) => {
    const { id } = req.params
    if (movies.find((obj) => obj.id == id) != null) {
        return res.status(200).json(movies.find((obj) => obj.id == id))
    }
    return res.status(404).json({ "Error": "Not Found Id" })
})
app.post('/movies', (req, res) => {
    const { cim, rendezo, ev, megnezve } = req.body
    const newid = Date.now()
    if (cim != null && rendezo != null && ev != null && megnezve != null) {
        movies.push({
            id: newid,
            cim,
            rendezo,
            ev,
            megnezve
        })
        return res.status(201).json({ "msg": "Item added successfully" })
    }
    return res.status(400).json({ "Error": "Missing details" })

})

app.delete('/movies/:id', (req, res) => {
    const { id } = req.params
    const movieIndex = movies.findIndex((obj) => obj.id == id)

    if (movieIndex !== -1) {
        movies.splice(movieIndex, 1)
        return res.status(200).json({ "msg": `Item Of ${id} has been successfully deleted!` })
    }
    return res.status(404).json({ "Error": "Not Found Id" })

})
app.patch('/movies/:id', (req, res) => {
    const { id } = req.params
    const { megnezve } = req.body
    if (movies.find((obj) => obj.id == id) != null) {
        movies.find((obj) => obj.id == id).megnezve = megnezve
        return res.status(200).json({ "msg": `Item Of ${id} has been successfully modified` })
    }
    return res.status(404).json({ "Error": "Not Found Id" })
})

/*app.get('/movies/status/:status', (req, res) => {
    const { status } = req.params
    if (status === 'true' || status === 'false') {
        const statusbool = status == "true" ? true : false
        const searchresult = movies.filter((obj) => obj.megnezve == statusbool)
        console.log(statusbool)
        return res.status(200).json(searchresult)
    }
    return res.status(400).json({ 'Error': "Syntax Error" })
})*/

/*app.get('/movies/year/:year', (req, res) => {
    const { year } = req.params
    console.log(year)
    if (year != null && year.length == 4) {
        const searchresult = movies.filter(({ ev }) => ev == year)
        if (searchresult.length != 0) {
            return res.status(200).json(searchresult)
        }
        return res.status(404).json({ 'msg': "Invalid ID" })
    }
    return res.status(400).json({ 'Error': "Syntax Error" })
})*/

app.get('/movies/filter/:filter', (req, res) => {
    const { filter } = req.params
    console.log(filter)
    if (Number.isFinite(Number(filter))) {
        if (filter != null && filter.length == 4) {
            const searchresult = movies.filter(({ ev }) => ev == filter)
            if (searchresult.length != 0) {
                return res.status(200).json(searchresult)
            }
            return res.status(404).json({ 'msg': "Invalid Year" })
        }
        return res.status(400).json({ 'Error': "Syntax Error" })
    }
    if (filter === 'true' || filter === 'false') {
        const statusbool = filter == "true" ? true : false
        const searchresult = movies.filter((obj) => obj.megnezve == statusbool)
        console.log(statusbool)
        return res.status(200).json(searchresult)
    }
    return res.status(400).json({ 'Error': "Syntax Error" })
})


app.listen(8000, () => {
    console.log('server is listening on port 8000')
})