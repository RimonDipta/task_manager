export const getPasswordStrength = (password) => {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  let label = "Weak";
  let color = "bg-red-500";

  if (score >= 4) {
    label = "Strong";
    color = "bg-green-500";
  } else if (score === 3) {
    label = "Medium";
    color = "bg-yellow-500";
  }

  return { score, label, color };
};
