'use client'
import { type InputHTMLAttributes } from 'react'
import { getClasses } from '../';

type SelectOptionProps = {
    id: string,
    name: string
}

type SearchSelectProps = InputHTMLAttributes<HTMLSelectElement> & {
    placeholder: string,
    options: SelectOptionProps[]
};


const classes = [
    'h-12',
    'w-full',
    'rounded',
    'border',
    'border-gray-400',
    'p-3',
    'text-base',
]

export default function SearchSelect(
    { placeholder, options, ...props }: SearchSelectProps) {

    const { className, ...otherProps } = props;

    return (
        <div>
            <select 
                {...otherProps}
                className={`${className} ${getClasses(classes)}`}
                style={{
                    color: '#9ca3af'
                }}
            >
                <option 
                    value=""
                >
                    {placeholder}
                </option>
                {options.length === 0 ? (
                    <option value="" disabled>
                        Loading...
                    </option>
                ) : (
                    options.map((option) => (
                    <option
                        key={option.id}
                        value={option.id}
                    >
                        {option.name}
                    </option>
                )))}    
            </select>
        </div>
    )
}