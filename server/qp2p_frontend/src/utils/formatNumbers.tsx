export function addCommasToNumber(value: number | string): string {
  // Convert the input to a string to handle both numbers and numeric strings
  const numStr = value.toString();

  // Use a regular expression to add commas
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Example usage:
// console.log(addCommasToNumber(1234567)); // Output: "1,234,567"
// console.log(addCommasToNumber("9876543210")); // Output: "9,876,543,210"
// console.log(addCommasToNumber(123)); // Output: "123"
