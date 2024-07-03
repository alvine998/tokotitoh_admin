import { ParsedUrlQuery } from "querystring";

export const toMoney = (number: number) => {
    // Check if the input is a valid number
    if (isNaN(number)) {
        throw new Error("Input must be a valid number");
    }

    // Convert the number to a string with two decimal places
    let price = number?.toFixed(0);

    // Add comma as thousands separator
    price = price?.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // Add the currency symbol
    return `${price}`;
}

export const queryToUrlSearchParams = (query: ParsedUrlQuery): URLSearchParams => {
    const params = new URLSearchParams();

    Object.keys(query).forEach(key => {
        const value = query[key];
        if (Array.isArray(value)) {
            value.forEach(val => {
                if (val !== undefined) {
                    params.append(key, val);
                }
            });
        } else if (value !== undefined) {
            params.append(key, value);
        }
    });

    return params;
}