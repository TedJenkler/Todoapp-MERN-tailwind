import React, { useState } from "react";
import x from "../assets/x.png";

interface Column {
  name: string;
  boardId: string;
}

interface ColumnRepeaterProps {
  value: Column[];
  onChange: (columns: Column[]) => void;
}

const ColumnRepeater: React.FC<ColumnRepeaterProps> = ({ value, onChange }) => {
  const [repeater, setRepeater] = useState<Column[]>(value || []);
  console.log(value);

  const handleRepeat = () => {
    const newColumn: Column = { name: "", boardId: "" };
    const newRepeater = [...repeater, newColumn];
    setRepeater(newRepeater);
    onChange(newRepeater);
  };

  return (
    <div>
      <label className="text-xs font-bold text-white mb-2">Columns</label>
      {repeater.map((column, index) => (
        <div key={index} className="flex items-center justify-between mb-2 w-full">
          <input
            type="text"
            value={column.name}
            onChange={(e) => {
              const newRepeater = [...repeater];
              newRepeater[index].name = e.target.value;
              setRepeater(newRepeater);
              onChange(newRepeater);
            }}
            className="rounded-[0.25rem] w-[16.5rem] h-10 px-4 py-2 border border-mediumgrey/25 bg-darkgrey text-mediumgrey"
          />
          <button
            onClick={() => {
              const newRepeater = repeater.filter((_, i) => i !== index);
              setRepeater(newRepeater);
              onChange(newRepeater);
            }}
            className="text-red-500"
          >
            <img src={x} alt="x" />
          </button>
        </div>
      ))}
      <button
        onClick={handleRepeat}
        className="mt-3 text-mainpurple bg-white w-full py-2 rounded-[1.25rem] text-[0.813rem] font-bold leading-[1.438rem]"
      >
        + Add New Column
      </button>
    </div>
  );
};

export default ColumnRepeater;