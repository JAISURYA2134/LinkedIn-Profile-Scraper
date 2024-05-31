const express = require('express');
const bodyParser = require('body-parser');
const { Profile } = require('./models');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.post('/profiles', async (req, res) => {
  try {
    const profile = await Profile.create(req.body);
    res.status(201).json(profile);
  } catch (error) {
    console.error('Error creating profile:', error);  // Log the error for debugging
    res.status(500).json({ error: error.message });
  }
});

app.get('/profiles', async (req, res) => {
  try {
    const profiles = await Profile.findAll();
    res.status(200).json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);  // Log the error for debugging
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
