const express = require('express');
const fetch = require('node-fetch');
const app = express();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('ready for work'));
app.use(express.static('public'));

app.get('/beanies', async (req, res) => {
  const api_url = 'https://bad-api-assignment.reaktor.com/v2/products/beanies';
  const response = await fetch(api_url);
  const data = await response.json();
  res.json(data);
});

app.get('/facemasks', async (req, res) => {
  const api_url =
    'https://bad-api-assignment.reaktor.com/v2/products/facemasks';
  const response = await fetch(api_url);
  const data = await response.json();
  res.json(data);
});

app.get('/gloves', async (req, res) => {
  const api_url = 'https://bad-api-assignment.reaktor.com/v2/products/gloves';
  const response = await fetch(api_url);
  const data = await response.json();
  res.json(data);
});

app.get('/availability/:manufacturer', async (req, res) => {
  const request = req.params;
  const manufacturer = request.manufacturer;
  const api_url = `https://bad-api-assignment.reaktor.com/v2/availability/${manufacturer}`;
  const response = await fetch(api_url);
  const data = await response.json();
  res.json(data);
});
