import express from "express";
import { filmek } from "./data.js";

const app = express();
const PORT = 8000;

app.use(express.json());

app.get("/filmek", (req, res) => {
    res.json(filmek)
})

app.get("/filmek/:reqId", (req, res) =>{
    const {reqId} = req.params;
    const reqfilm = filmek.find(({id}) => id == reqId)
    res.json(reqfilm)
})

app.post("/", (req, res)=>{
    const newId = Date.now()
    const {cim, rendezo, ev, megnezve} = req.body
    const newFilm = {newId,cim,rendezo,ev,megnezve}
    if (newFilm.cim != null && newFilm.rendezo != null && newFilm.ev != null && newFilm.megnezve != null){

    }
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});