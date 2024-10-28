// @ts-check

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @type {FunctionRunResult}
 */
const NO_CHANGES = {
  operations: [],
};

const APPLY_DISCOUNT = {
  operations: [],
}

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */

export function run(input) {
  const customer = input.cart.buyerIdentity?.customer;
  const discountPercent = customer.metafield?.value;

  if (customer && discountPercent && discountPercent > 0) {
    input.cart.lines.forEach(line => {
      const discountAmount = line.cost.amountPerQuantity.amount * (discountPercent / 100);
      const discountedPrice = line.cost.amountPerQuantity.amount - discountAmount;

      APPLY_DISCOUNT.operations.push({
        "update": {
          "cartLineId": line.id,
          "price": {
            "compareAtAmountPerQuantity": {
              "amount": line.cost.amountPerQuantity.amount,
            },
            "adjustment": {
              "fixedPricePerUnit": {
                "amount": discountedPrice,
              }
            }
          }
        }
      });
    });

    return APPLY_DISCOUNT;
  }

  return NO_CHANGES;
};