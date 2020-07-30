const fetch = require('node-fetch');

const area = 'Asia';
const location = 'Kolkata';

async function getCurrentTime() {
  const time = await fetch(`http://worldtimeapi.org/api/timezone/${area}/${location}`)
  .then(response => response.json())
  .then((data) => {
    return data.datetime;
  })
  .catch((error) => {
    console.log(error);
  });

  return time;
};

module.exports = {
  getCurrentTime
}