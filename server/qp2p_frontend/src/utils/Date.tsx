
export const DateFormater = (isoTimestamp:string) => {
   

// Convert to a Date object
const date = new Date(isoTimestamp);

// Format the date
const formattedDate = date.toTimeString();
// const formattedDate = date.toLocaleString("en-US", {
//   year: "numeric",
//   month: "long",
//   day: "numeric",
//   hour: "2-digit",
//   minute: "2-digit",
//   second: "2-digit",
//   timeZoneName: "short"
// });


  return formattedDate
  }
