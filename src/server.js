const app = require('./app.js');

const PORT=3001

app.listen(PORT, ()=>{
    console.log(`Servidor rodando na porta ${PORT}`);
})
