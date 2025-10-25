import React from "react";

export default function Select({
  label,
  options = [],
  value,
  onChange,
  multiple = false,
  name,
  required = false,
}) {
  const handleChange = (e) => {
    if (multiple) {
      // Collect selected values as an array
      const selectedOptions = Array.from(e.target.selectedOptions).map(
        (opt) => opt.value
      );
      onChange(selectedOptions);
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <div className="flex flex-col">
      {label && (
        <label className="mb-1 font-medium" htmlFor={name}>
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        multiple={multiple}
        required={required}
        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {!multiple && <option value="">Select {label}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
