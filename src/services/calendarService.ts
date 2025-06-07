
import { BRANCHES } from "@/config/equipmentCategories";
import { getBookingStore, getInventoryStore } from "./mockDataService";

// iCal generation
export const generateICalForItem = (itemId: string) => {
  const bookings = getBookingStore();
  const inventory = getInventoryStore();
  const itemBookings = bookings.filter(booking => booking.assignedItemId === itemId);
  const item = inventory.find(item => item.id === itemId);
  
  if (!item) return null;

  let icalContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Rent2Recover//Equipment Calendar//EN',
    `X-WR-CALNAME:${item.name} (${item.id}) - ${BRANCHES.find(b => b.id === item.branch)?.name}`,
    'X-WR-CALDESC:Booking calendar for medical equipment rental'
  ];

  itemBookings.forEach(booking => {
    const startDate = booking.startDate.toISOString().split('T')[0].replace(/-/g, '');
    const endDate = new Date(booking.endDate);
    endDate.setDate(endDate.getDate() + 1);
    const endDateStr = endDate.toISOString().split('T')[0].replace(/-/g, '');
    
    icalContent.push(
      'BEGIN:VEVENT',
      `UID:${booking.id}@rent2recover.com`,
      `DTSTART:${startDate}`,
      `DTEND:${endDateStr}`,
      `SUMMARY:Rental - ${booking.customer}`,
      `DESCRIPTION:Equipment: ${booking.equipmentName}\\nCustomer: ${booking.customer}\\nBranch: ${BRANCHES.find(b => b.id === booking.branch)?.name}\\nStatus: ${booking.status}`,
      `LOCATION:${BRANCHES.find(b => b.id === booking.branch)?.location}`,
      'END:VEVENT'
    );
  });

  icalContent.push('END:VCALENDAR');
  return icalContent.join('\r\n');
};
