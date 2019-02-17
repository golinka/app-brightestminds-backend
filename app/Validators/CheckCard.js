class CheckProduct {
  get rules() {
    return {
      number: "required|min:16|max:16|integer",
      exp_month: "required|min:2|max:2|integer|range:0,13",
      exp_year: `required|integer|range:${new Date().getFullYear() - 1},2100`,
      cvc: "required|min:3|max:3|integer"
    };
  }

  get messages() {
    return {
      required: "{{ field }} is required",
      integer: "{{ field }} must include only digits",
      "number.min": "{{ field }} length must be equal to 16 characters",
      "number.max": "{{ field }} length must be equal to 16 characters",
      "exp_month.min": "{{ field }} length must be equal to 2 characters",
      "exp_month.max": "{{ field }} length must be equal to 2 characters",
      "exp_month.range": "{{ field }} must be from 01 to 12",
      "exp_year.range": `{{ field }} must be from ${new Date().getFullYear()}`,
      "cvc.min": "{{ field }} length must be equal to 3 characters",
      "cvc.max": "{{ field }} length must be equal to 3 characters"
    };
  }
}

module.exports = CheckProduct;
