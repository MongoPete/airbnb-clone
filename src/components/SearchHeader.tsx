import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface SearchHeaderProps {
  onSearch: (query: string) => void;
  onFilterToggle: () => void;
  searchQuery: string;
}

export function SearchHeader({ onSearch, onFilterToggle, searchQuery }: SearchHeaderProps) {
  return (
    <div className="sticky top-0 z-50 bg-background border-b border-border px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Where to?"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10 h-12 rounded-full border-border bg-background"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={onFilterToggle}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}