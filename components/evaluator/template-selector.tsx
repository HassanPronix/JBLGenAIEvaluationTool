"use client";

import { useState, useMemo } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { templates } from "@/lib/templates";
import { Loader2 } from "lucide-react";

export default function TemplateSelector({ onSelect, loading }: any) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const allTemplates = useMemo(() => {
    return templates.flatMap((group) =>
      group.items.map((item) => ({
        name: item,
        category: group.category,
      }))
    );
  }, []);

  const filteredTemplates = useMemo(() => {
    if (!search) return allTemplates;

    return allTemplates.filter((t) =>
      t.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, allTemplates]);

  return (
    <div className="border rounded-xl bg-muted/20 shadow-sm">
      <Command className="bg-transparent">
        
        {/* Input */}
        <div className="border-b px-3 py-2">
          <CommandInput
            placeholder="Search templates..."
            value={search}
            onValueChange={setSearch}
            className="text-sm"
          />
        </div>

        {/* List */}
        <CommandList className="max-h-48 overflow-auto p-2">
          <CommandEmpty>No templates found.</CommandEmpty>

          {filteredTemplates.map((item, index) => {
            const isActive = selected === item.name;

            return (
              <CommandItem
                key={index}
                onSelect={() => {
                  setSelected(item.name);
                  onSelect({ name: item.name });
                }}
                className={`rounded-lg px-3 py-2 cursor-pointer transition-all
                  ${isActive ? "bg-primary/10 border border-primary/30" : "hover:bg-muted"}
                `}
              >
                <div className="flex items-center justify-between w-full">
                  
                  {/* Left */}
                  <div className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.category}
                    </span>
                  </div>

                  {/* Right (loader) */}
                  {loading && isActive && (
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </CommandItem>
            );
          })}
        </CommandList>
      </Command>
    </div>
  );
}