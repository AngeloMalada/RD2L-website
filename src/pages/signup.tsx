import React from "react";

const signup = () => {
  return (
    <div className="flex flex-col items-center ">
      <h1 className="text-2xl font-bold uppercase">Sign up</h1>
      <form action="" className="flex flex-col">
        <input
          type="text"
          placeholder="Dotabuff"
          className="my-2 rounded-md border-2 border-black p-2 text-center"
        />
        <input
          type="text"
          placeholder="MMR"
          className="my-2 rounded-md border-2 border-black p-2 text-center"
        />
        <label htmlFor="">Interested in captaining</label>
        <select
          name="Captain"
          id=""
          className="rounded-lg text-center shadow-lg"
        >
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </form>
    </div>
  );
};

export default signup;
