export const toMoney = (number: number) => {
    // Check if the input is a valid number
    if (isNaN(number)) {
        throw new Error("Input must be a valid number");
    }

    // Convert the number to a string with two decimal places
    let price = number.toFixed(0);

    // Add comma as thousands separator
    price = price.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // Add the currency symbol
    return `${price}`;
}