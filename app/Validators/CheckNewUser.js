class CheckNewUser {
  get rules() {
    return {
      username: "required|min:4|max:80|unique:users",
      email: "required|email|max:255|unique:users",
      password: "required|min:4|max:12",
      fname: "required|min:2|max:35",
      lname: "min:2|max:45",
      phone: "max:25",
      company: "max:150"
    };
  }

  get messages() {
    return {
      required: "{{ field }} is required",
      email: "{{ field }} is in wrong format",
      "username.username": "{{ field }} value already use",
      "email.uniqueEmail": "{{ field }} value already use",
      "username.min": "{{ field }} must be at least 4 characters",
      "username.max": "{{ field }} must be at maximum 80 characters",
      "email.max": "{{ field }} must be at maximum 255 characters",
      "password.min": "{{ field }} must be at least 4 characters",
      "password.max": "{{ field }} must be at maximum 12 characters",
      "fname.min": "{{ field }} must be at least 2 characters",
      "fname.max": "{{ field }} must be at maximum 35 characters",
      "lname.min": "{{ field }} must be at least 2 characters",
      "lname.max": "{{ field }} must be at maximum 45 characters",
      "phone.max": "{{ field }} must be at maximum 25 characters",
      "company.max": "{{ field }} must be at maximum 150 characters"
    };
  }
}

module.exports = CheckNewUser;
