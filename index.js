const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

// Helper functions
const isPrime = (num) => {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

const isPerfect = (num) => {
  if (num < 2) return false;
  let sum = 1;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      sum += i;
      if (i !== num / i) sum += num / i;
    }
  }
  return sum === num;
};

const isArmstrong = (num) => {
  const digits = String(num).split('');
  const sum = digits.reduce((acc, digit) => acc + Math.pow(Number(digit), digits.length), 0);
  return sum === num;
};

const getDigitSum = (num) => {
  return String(num).split('').reduce((acc, digit) => acc + Number(digit), 0);
};

const getParity = (num) => (num % 2 === 0 ? 'even' : 'odd');

// API Endpoint
app.get('/api/classify-number', async (req, res) => {
  const { number } = req.query;

  // Input validation
  if (!number || isNaN(Number(number))) {
    return res.status(400).json({ number: number || 'undefined', error: true });
  }

  const num = parseInt(number, 10);

  // Fetch fun fact from Numbers API
  let funFact = '';
  try {
    const response = await axios.get(`http://numbersapi.com/${num}/math`);
    funFact = response.data;
  } catch (error) {
    funFact = 'No fun fact available for this number.';
  }

  // Prepare response
  const response = {
    number: num,
    is_prime: isPrime(num),
    is_perfect: isPerfect(num),
    properties: [],
    digit_sum: getDigitSum(num),
    fun_fact: funFact,
  };

  // Add properties
  if (isArmstrong(num)) response.properties.push('armstrong');
  response.properties.push(getParity(num));

  res.status(200).json(response);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
