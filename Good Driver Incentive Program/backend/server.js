require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json()); // built-in body parser

const PORT = process.env.PORT || 5000;


app.get('/', (req, res) => {
  res.send('API Running');
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);
