import React, { useState } from 'react';
import { SeatLegend } from './seatLegent';

const SeatMap = ({ seats = [], onBook }) => {
  const [selectedSeat, setSelectedSeat] = useState(null);

  // Filter only seats
  const seatOnlyData = seats.filter(item => item.Type === 'SEAT' && item.SeatNo);

  // Group seats by CraftType -> Deck -> Segment -> Row
  const groupedSeats = {};

  seatOnlyData.forEach(seat => {
    const craft = seat?.AdditionalInfo?.CraftType || 'Unknown';
    const deck = seat?.AdditionalInfo?.Deck || 'Main';
    const segment = seat?.GroupSegmentRef || 'Unknown';
    const row = seat.RowNo;

    if (!groupedSeats[craft]) groupedSeats[craft] = {};
    if (!groupedSeats[craft][deck]) groupedSeats[craft][deck] = {};
    if (!groupedSeats[craft][deck][segment]) groupedSeats[craft][deck][segment] = {};
    if (!groupedSeats[craft][deck][segment][row]) groupedSeats[craft][deck][segment][row] = [];

    groupedSeats[craft][deck][segment][row].push(seat);
  });

  const handleSelect = (seat) => {
    if (seat.SeatStatus === 'Open') {
      setSelectedSeat(seat.Code === selectedSeat ? null : seat.Code);
    }
  };

  const renderSeat = (seat) => {
    const isSelected = selectedSeat === seat.Code;
    const isOccupied = seat.SeatStatus !== 'Open';

    const baseStyle = `w-10 h-10 rounded-md flex items-center justify-center font-semibold text-xs transition cursor-pointer border`;
    const statusStyle = isOccupied
      ? 'bg-gray-300 text-white cursor-not-allowed border-gray-400'
      : isSelected
        ? 'bg-blue-500 text-white border-blue-700'
        : 'bg-green-500 text-white hover:bg-green-600 border-green-700';

    const price = Number(seat?.PricingInfo?.TotalGrossPrice || 0).toFixed(2);

    return (
      <div
        key={seat.Code}
        className={`${baseStyle} ${statusStyle}`}
        title={`Seat: ${seat.Code}\nType: ${seat.SeatType}\nPrice: $${price}`}
        onClick={() => handleSelect(seat)}
      >
        {seat.SeatNo || '-'}
      </div>
    );
  };

  const selectedSeatData = seatOnlyData.find(seat => seat.Code === selectedSeat);

  return (
    <div className="bg-white rounded shadow-md p-4 max-w-5xl mx-auto">
      <h2 className="text-lg font-bold mb-2">Select Your Seat</h2>
      <SeatLegend />

      {Object.entries(groupedSeats).map(([craftType, decks]) => (
        <div key={craftType} className="mt-6">
          <h3 className="text-md font-semibold text-blue-800">Craft Type: {craftType}</h3>
          {Object.entries(decks).map(([deck, segments]) => (
            <div key={deck} className="ml-4 mt-2">
              <h4 className="text-sm font-medium text-purple-700">Deck: {deck}</h4>
              {Object.entries(segments).map(([segmentRef, rows]) => (
                <div key={segmentRef} className="ml-4 mt-2">
                  <h5 className="text-sm font-semibold text-green-700">Segment Ref: {segmentRef}</h5>
                  <div className="space-y-3 mt-2">
                    {Object.entries(rows)
                      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                      .map(([rowNo, rowSeats]) => {
                        const sorted = rowSeats.sort((a, b) => a.SeatNo.localeCompare(b.SeatNo));
                        return (
                          <div key={rowNo} className="flex items-center gap-3">
                            <span className="w-6 text-right text-sm">{rowNo}</span>
                            <div className="grid grid-cols-3 gap-2">
                              {sorted.slice(0, 3).map(renderSeat)}
                            </div>
                            <div className="w-6" />
                            <div className="grid grid-cols-3 gap-2">
                              {sorted.slice(3, 6).map(renderSeat)}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}

      {selectedSeatData && (
        <div className="mt-4 p-3 bg-blue-100 rounded text-sm">
          <strong>Selected Seat:</strong> {selectedSeatData.Code} | Type: {selectedSeatData.SeatType} | Price: ${Number(selectedSeatData.PricingInfo?.TotalGrossPrice || 0).toFixed(2)}
        </div>
      )}

      {selectedSeatData && onBook && (
        <button
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          onClick={() => onBook(selectedSeatData)}
        >
          Book Seat
        </button>
      )}
    </div>
  );
};

export default SeatMap;
