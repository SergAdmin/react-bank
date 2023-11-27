// const getDate = (date: Date) => {
//   const date = new Date(date);

//   const currentDate = new Date().getTime();

//   const timeDifference = currentDate - date.getTime();

//   const oneHourInMillis = 60 * 60 * 1000;

//   const oneDayInMillis = 24 * oneHourInMillis;

//   if (timeDifference <= 3600000) {
//     const minutes = Math.floor(timeDifference / (60 * 1000));
//     return `${minutes} min. ago`;
//   } else if (timeDifference <= oneDayInMillis) {
//     const hours = Math.floor(timeDifference / oneHourInMillis);
//     return `${hours} hours ago`;
//   }
// };

const getDate = (date: Date) => {
  const newDate = new Date(date);
  const day = newDate.getDate();
  const month = newDate.toLocaleString("en-US", { month: "long" });
  const hour = newDate.getHours();
  const minutes = newDate.getMinutes();
  let minutesString;
  if (minutes < 10) {
    minutesString = "0" + String(minutes);
  } else {
    minutesString = String(minutes);
  }
  return `${day} ${month}, ${hour}:${minutesString}`;
};

export default getDate;
