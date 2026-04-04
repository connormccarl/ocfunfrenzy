import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import postgres from 'postgres';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// mysql connection details
export const db = postgres(process.env.POSGRES_URL!, { ssl: 'require' });
