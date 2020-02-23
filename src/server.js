const app = require('./app.js');

//Variável de ambiente PORT
const PORT=process.env.PORT || 3001

app.listen(PORT, ()=>{
    console.log(`Servidor rodando na porta ${PORT}`);
})
