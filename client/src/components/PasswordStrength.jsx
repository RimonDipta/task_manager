import { getPasswordStrength } from "../utils/passwordStrength";

const PasswordStrength = ({ password }) => {
  if (!password) return null;

  const { score, label, color } = getPasswordStrength(password);

  return (
    <div className="mt-2">
      <div className="h-2 w-full bg-gray-200 rounded">
        <div
          className={`h-2 rounded ${color}`}
          style={{ width: `${(score / 5) * 100}%` }}
        />
      </div>
      <p className="text-sm mt-1">
        Strength: <span className="font-semibold">{label}</span>
      </p>
    </div>
  );
};

export default PasswordStrength;
