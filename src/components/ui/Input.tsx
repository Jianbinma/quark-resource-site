import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', error, label, ...props }, ref) => {
        // Modern input styles with focus ring and transition
        const baseInputStyles = `
      block w-full rounded-lg border-gray-300 shadow-sm
      border p-2.5 text-gray-900 bg-gray-50
      focus:ring-blue-500 focus:border-blue-500
      disabled:bg-gray-100 disabled:text-gray-500
      transition-all duration-200 ease-in-out
      hover:bg-white hover:shadow-md
      placeholder:text-gray-400
    `;

        const errorStyles = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '';

        return (
            <div className="w-full">
                {label && (
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        ref={ref}
                        className={`${baseInputStyles} ${errorStyles} ${className}`}
                        {...props}
                    />
                </div>
                {error && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
