const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectDB = require('./config/db');
const app = require('./app');

// Connect to MongoDB Atlas
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[StayScape Server] Running on port ${PORT}`);
});