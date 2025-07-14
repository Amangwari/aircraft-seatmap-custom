export const SeatLegend = () => {
  const itemClass = 'flex items-center gap-2 text-sm';

  return (
    <div className="flex gap-4 text-gray-700">
      <div className={itemClass}>
        <div className="w-5 h-5 rounded bg-green-500 border border-green-700" />
        Available
      </div>
      <div className={itemClass}>
        <div className="w-5 h-5 rounded bg-blue-500 border border-blue-700" />
        Selected
      </div>
      <div className={itemClass}>
        <div className="w-5 h-5 rounded bg-gray-300 border border-gray-400" />
        Unavailable
      </div>
    </div>
  );
};
