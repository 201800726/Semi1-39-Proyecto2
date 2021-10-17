const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();



//config 

const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({
    extended: true,
    limit: '50mb'
}))

//routes 


app.listen(PORT, () => {
    console.log(`Server on PORT: ${PORT}`)
})

app.get('/', function (req, res) {
    res.send({
        'Proyecto': 'U-Social',
        'Curso': 'Laboratorio de Seminario 1',
        'Integrantes 1': 'Maria Reneé Juaréz Albizures - 201800726',
        'Integrante 2': 'Stefany Samantha Abigail Coromac Huezo - 201801182',
        '# Pareja': '39'
    })
})