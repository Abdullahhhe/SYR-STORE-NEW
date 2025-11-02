'use client';
import { createContext, useContext, useState } from 'react';

type FilterContextType = {
    category: string;
    setCategory: (value: string) => void;
};

const FilterContext = createContext<FilterContextType | null>(null);

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
    const [category, setCategory] = useState('all');

    return (
        <FilterContext.Provider value={{ category, setCategory }}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilter = () => {
    const context = useContext(FilterContext);
    if (!context) throw new Error('useFilter must be used within FilterProvider');
    return context;
};