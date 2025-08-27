import React, { memo } from 'react';

const TitleInput = memo(({ title, setTitle }) => {
  return (
    <input
      className="ps-2 w-100 d-block"
      placeholder="標題"
      type="text"
      name="title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />
  );
});

export default TitleInput;