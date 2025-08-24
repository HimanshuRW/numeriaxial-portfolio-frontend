const fs = require('fs'); // Built-in module

const data = JSON.parse(fs.readFileSync('rough.json', 'utf8'));
const newData = [];

const secondaryData = data.map(item => ({
  date: item.date,
  value: item.close // You can change to open/high/low if desired
}));

console.log("secondaryData : ",JSON.stringify(secondaryData));