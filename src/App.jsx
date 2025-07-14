import React from 'react';
import seatResponse from '../seatData.json';
import SeatMap from './components/seatmap';

const App = () => {
   const allServices = seatResponse.Service;
  const onlySeats = allServices.filter(service => service?.Type === 'SEAT');
  console.log(onlySeats, "only")

 const handleBooking = (seat) => {
    alert(`Seat ${seat.Code} booked for $${Number(seat.PricingInfo.TotalGrossPrice).toFixed(2)}`);
  };

  return (
  <div className="min-h-screen bg-gray-100 py-8">
      <SeatMap seats={onlySeats} onBook={handleBooking} />
    </div>
  );
};

export default App;
