import React, { FC, useState } from "react";

const NamePage: FC<{ setName: (arg0: string) => void }> = ({ setName }) => {
  const [value, setValue] = useState("");
  return (
    <div>
      <div>
        <input
          placeholder="display name"
          value={value}
          onChange={({ target }) => setValue(target.value)}
        ></input>
      </div>
      <button onClick={() => setName(value)}>confirm name</button>
    </div>
  );
};

export default NamePage;
