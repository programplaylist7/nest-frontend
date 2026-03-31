import { useState, useEffect } from "react";
import axios from "axios";

const MasterPanel = ({ role }) => {
  const [type, setType] = useState("qualification"); // comment: selected type
  const [name, setName] = useState(""); // comment: input
  const [data, setData] = useState([]); // comment: list

  // comment: fetch data
  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/master/get?type=${type}`,
      );
      setData(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [type]);

  // comment: add item
  const handleAdd = async () => {
    if (!name) return alert("Enter name");

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/master/add`,
        { type, name },
        { withCredentials: true },
      );

      setName(""); // comment: clear input
      fetchData(); // comment: refresh list
    } catch (err) {
      console.log(err);
    }
  };

  // comment: delete item
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/master/delete?type=${type}&id=${id}`,
        { withCredentials: true },
      );

      fetchData(); // comment: refresh list
    } catch (err) {
      console.log(err);
    }
  };

  // comment: restrict to admin only
  if (role !== "admin") return null;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Master Panel</h2>

      {/* comment: select type */}
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full border p-2 mb-3"
      >
        <option value="qualification">Qualification</option>
        <option value="designation">Designation</option>
        <option value="country">Country</option>
      </select>

      {/* comment: input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 border p-2"
        />
        <button onClick={handleAdd} className="bg-blue-500 text-white px-4">
          Add
        </button>
      </div>

      {/* comment: list */}
      <div>
        {data.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border p-2 mb-2 rounded"
          >
            <p>{item.name}</p>

            <button
              onClick={() => handleDelete(item.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MasterPanel;
