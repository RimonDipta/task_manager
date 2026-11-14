/**
 * Doora brand mark: the letter D with a checkmark inside.
 * Drop-in replacement for a lucide icon: accepts `size`, `className`,
 * `strokeWidth`, and inherits color from `currentColor`. A `fill-*` class
 * tints the inside of the D, the same as it would on a lucide icon.
 * Keep in sync with scripts/generate-icons.py.
 */
const DooraLogo = ({ size = 24, strokeWidth = 2.4, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M5 4h6a8 8 0 0 1 0 16H5z" />
    <path d="m8.6 12.3 2.3 2.3 4.1-4.7" fill="none" />
  </svg>
);

export default DooraLogo;
