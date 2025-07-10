import { Button, Checkbox, Input } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import { useState, useMemo } from "react";

type FilterOption = { text: string; value: string | number };

export const createTableFilterDropdown = (
  filters: FilterOption[],
  filterSearch?: boolean
) => {
  return function FilterDropdown({
    setSelectedKeys,
    selectedKeys,
    clearFilters,
    confirm,
  }: FilterDropdownProps) {
    const [searchText, setSearchText] = useState("");

    const filteredOptions = useMemo(() => {
      if (!filterSearch || !searchText) return filters;

      return filters.filter((filter) =>
        filter.text.toLowerCase().includes(searchText.toLowerCase())
      );
    }, [searchText]);

    const handleReset = () => {
      setSelectedKeys([]);
      setSearchText("");
      clearFilters?.(); // Optional chaining for compatibility
      confirm({ closeDropdown: false }); // Optional: triggers immediate update
    };

    return (
      <div style={{ padding: 8, width: 120 }}>
        {filterSearch && (
          <Input.Search
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            size="small"
          />
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxHeight: 100,
            marginTop: filterSearch ? 10 : undefined,
            overflowY: "auto",
          }}
        >
          {filteredOptions.map((filter) => (
            <Checkbox
              key={filter.value}
              checked={selectedKeys.includes(filter.value)}
              onChange={(e) => {
                const updated = e.target.checked
                  ? [...selectedKeys, filter.value]
                  : selectedKeys.filter((val) => val !== filter.value);

                setSelectedKeys(updated);
                confirm({ closeDropdown: false }); // Triggers immediately
              }}
            >
              {filter.text}
            </Checkbox>
          ))}
        </div>
        <Button
          onClick={handleReset}
          size="small"
          style={{ marginTop: 10, width: "100%" }}
        >
          Reset Filters
        </Button>
      </div>
    );
  };
};
