import React, { memo } from 'react';

const CategorySelect = memo(({ selectedCategory, setSelectedCategory, categoryOptions }) => {
  return (
    <select
      className="form-select my-3"
      value={selectedCategory}
      style={{ width: '200px' }}
      onChange={(e) => setSelectedCategory(Number(e.target.value))}
    >
      <option value="">請選擇主題</option>
      {categoryOptions.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  );
});

export default CategorySelect;