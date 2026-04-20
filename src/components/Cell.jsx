function Cell({ row, col, value, maxVal, isGiven, isError, isComplete, isHint, disabled, onChange }) {
  const handleChange = (e) => {
    if (disabled) return;
    const input = e.target.value;
    if (input === '') {
      onChange(row, col, 0);
      return;
    }
    const num = parseInt(input, 10);
    if (num >= 1 && num <= maxVal) {
      onChange(row, col, num);
    }
  };

  if (isGiven) {
    return <div className="cell cell-given">{value}</div>;
  }

  if ((isComplete || disabled) && value !== 0) {
    return (
      <div className={`cell cell-player ${isError ? 'cell-error' : ''}`}>{value}</div>
    );
  }

  const cls = `cell cell-empty ${isError ? 'cell-error' : ''} ${isHint ? 'cell-hint' : ''}`;
  return (
    <div className={cls}>
      <input
        type="number"
        min="1"
        max={maxVal}
        className="cell-input"
        value={value === 0 ? '' : value}
        onChange={handleChange}
        disabled={disabled || isComplete}
      />
    </div>
  );
}

export default Cell;
