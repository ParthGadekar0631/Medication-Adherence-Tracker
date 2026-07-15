const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    res.status(503).json({ message: 'Database service is unavailable' });
  }
});

const providerRoutes = require('./routes/provider');
const chatRoutes = require('./routes/chatRoutes');
const adherencePredictionRoutes = require('./routes/adherencePrediction');

app.use('/api/auth', require('./routes/auth'));
app.use('/api/provider', providerRoutes);
app.use('/api/medications', require('./routes/medications'));
app.use('/api/patient', require('./routes/patient'));
app.use('/api/adherence', require('./routes/adherence'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/reminders', require('./routes/reminders'));

app.use('/api/adherence-prediction', adherencePredictionRoutes); 
app.use('/api/adherence/predict', adherencePredictionRoutes);

app.use('/api/chat', chatRoutes);

app.use('/', (req, res) => {
  res.json({ message: 'Medication Tracker API is running' });
});

const port = process.env.PORT || 3000;

if (require.main === module) {
  connectDB()
    .then(() => {
      app.listen(port, '0.0.0.0', () => {
        console.log(`Medication Tracker API listening on port ${port}`);
      });

      require('./utils/reminderScheduler');
    })
    .catch((error) => {
      console.error('MongoDB Connection Error:', error.message);
      process.exitCode = 1;
    });
}

module.exports = app;
