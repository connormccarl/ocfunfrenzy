'use client'
import { type InputHTMLAttributes } from 'react';
import { getClasses } from '../';

type SearchInputProps = InputHTMLAttributes<HTMLInputElement>;

const classes = [
    'h-12',
    'w-full',
    'rounded',
    'border',
    'border-gray-400',
    'p-3',
    'text-base',
    'placeholder-gray-400'
]

export default function SearchInput(
    { ...props }: SearchInputProps) {
    
    const { className, ...otherProps } = props;

    return (
        <div>
            <input 
                type="search"
                className={`${className} ${getClasses(classes)}`}
                {...otherProps}
            />
        </div>
    );
};

