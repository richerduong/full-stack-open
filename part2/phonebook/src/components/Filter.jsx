const Filter = ({ value, onChange }) => {
  return (
    <div>
      filter: <input value={value} onChange={onChange} />
    </div>
  );
};

export default Filter;