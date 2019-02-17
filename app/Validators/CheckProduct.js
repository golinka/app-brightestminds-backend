class CheckProduct {
  get rules() {
    return {
      title: "required|min:3|max:255",
      description: "required|max:255",
      price: "required|integer",
      interval: "required|in:day,week,month,year",
      currency: "required|in:eur,usd",
      is_private: "boolean"
    };
  }

  get messages() {
    return {
      required: "{{ field }} is required",
      boolean: "{{ field }} must be 'true' or 'false'",
      integer: "{{ field }} must include only digits",
      "title.min": "{{ field }} must be at least 3 characters",
      "title.max": "{{ field }} must be at maximum 255 characters",
      "description.max": "{{ field }} must be at maximum 255 characters",
      "interval.in":
        "{{ field }} must be one with these values: 'day', 'week', 'month', 'year'",
      "currency.in": "{{ field }} must be one with these values: 'eur', 'usd'"
    };
  }
}

module.exports = CheckProduct;
