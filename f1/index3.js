import express from 'express';
const app = express();

app.use(express.json());

let students = [
    {id: 1, nev: 'Gyula', kor: 18},
    {id: 2, nev: 'Péter', kor: 20},
    {id: 3, nev: 'Anna', kor: 22},
]

app.get('/', (req, res) => {
    res.json(students);
})

app.get('/:reqId', (req, res) => {
    const reqId = Number(req.params.reqId);
    console.log('ID received:', reqId);
    const student = students.find(({id: studentId}) => studentId === reqId);
    if (!student) {
        return res.status(404).json({error: 'Student not found'});
    }
    res.json(student);
});
app.delete('/:reqId', (req, res) => {
    const reqId = Number(req.params.reqId);
    console.log('ID received:', reqId);
    //const student = students.find(({id: studentId}) => studentId === id);
    const indexOfItem = students.findIndex(({id})=> id === reqId)
    if (indexOfItem==-1) {
        return res.status(404).json({error: 'Student not found'});
    }
    students=students.filter(({id})=> id!==reqId)
    res.json({msg:"Item Deleted Successfuly"});
});

//uj adat bevezetese
app.post('/', (req, res)=> {
    const {nev, kor} =req.body
    const newID=Date.now()
    const newItem={id:newID, nev, kor}
    if(newItem.nev !=null && newItem.kor !=null){
        students = [...students, newItem]
        res.status(201).json({msg: "Item added Successfuly"})
    }
    res.status(400).json({msg: "Missing details!"})
    
});

app.patch('/', (req, res) => {
    const {id, kor} = req.body
    console.log(id, kor)
    const indexOfItem = students.findIndex(({id: studentId})=> studentId === id)
    if(indexOfItem ==-1) res.status(204).json({msg:"Student not found"})
    students[indexOfItem].kor=kor
    res.status(200).json({msg: "Modified Successfuly!"})
});

app.use((req, res) => {
     res.status(404).send('Page not found');
});

app.listen(8000,() => {
    console.log('Server is running on port 8000');
});