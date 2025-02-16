import React from "react";
import Parent from "./Parent";
import Children from "./Children";

const Categories = () => {
  return (
    <div>
      <div className="px-2">
            <Parent/>
            <Children/>
      </div>
    </div>
  );
};

export default Categories;
