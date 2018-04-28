const express = require('express');

const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('./public'));

app.get('/', (req, res) => res.send('./public/index.html'));

app.listen(2000, () => console.log('Server started: 2000'));