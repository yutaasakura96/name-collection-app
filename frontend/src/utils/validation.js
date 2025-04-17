export const validateName = (name, field) => {
  if (!name) {
    return `${field} is required.`;
  }
  if (name.length < 2) {
    return `${field} must be at least 2 characters long.`;
  }
  if (!/^[a-zA-Z\s-]+$/.test(name)) {
    return `${field} can only contain letters, spaces, and hyphens.`;
  }
  return "";
};

export const validateNameForm = (firstName, lastName) => {
  const firstNameError = validateName(firstName, "First name");
  const lastNameError = validateName(lastName, "Last name");

  return {
    firstName: firstNameError,
    lastName: lastNameError,
    isValid: !firstNameError && !lastNameError,
  };
};
