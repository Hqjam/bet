import validator from 'validator';

function validateUserInput(req, res) {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).send("All fields are required");
  }

  if (!validator.isEmail(email)) {
    return res.status(400).send("Invalid email format");
  }

  if (!validator.isLength(password, { min: 6 })) {
    return res.status(400).send("Password must be at least 6 characters long");
  }

  if (!validator.isStrongPassword(password, {
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0
  })) {
    return res.status(400).send("Password must contain at least one lowercase letter, one uppercase letter, and one number");
  }

  return null; 
}

function validateProfileUpdateInput(req, res) {
  const { firstName, lastName, age, about, profilePicture } = req.body;

  if (!firstName || !lastName || !age) {
    return res.status(400).send("First name, last name, and age are required");
  }

  if (!Number.isInteger(age) || age < 18) {
    return res.status(400).send("Age must be a number and at least 18");
  }

  if (about && about.length > 300) {
    return res.status(400).send("About section is too long (max 300 characters)");
  }

  if (profilePicture && !validator.isURL(profilePicture)) {
    return res.status(400).send("Invalid profile picture URL");
  }

  return null;
}

export { validateUserInput, validateProfileUpdateInput };
