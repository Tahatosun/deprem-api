const express = require('express');
const apiRoutes = require('./routes/api-routes');
const app = express();
const createError = require('http-errors');

const PORT=3000;

app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} nolu portta çalışıyor.`)
});

app.use("/api", apiRoutes);

app.use((req,res)=> res.status(404).send(createError(404)) );


