import React from 'react';
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalTitle, 
  ModalDescription,
  ModalFooter,
  ModalClose
} from './ui/modal';
import { Button } from './ui/button';
import { CheckCircle, Copy, Calendar, Clock, Phone } from 'lucide-react';
import { format } from 'date-fns';

const ReferenceNumberModal = ({ isOpen, onClose, referenceNumber, bookingDetails, whatsappNumber = '+447440070177' }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referenceNumber);
    // Could add a toast notification here if needed
  };

  const getWhatsAppLink = () => {
    const base = 'https://wa.me/';
    const lines = [
      `Hello KGG 👋`,
      `I'd like to confirm my booking.`,
      referenceNumber ? `Ref: ${referenceNumber}` : null,
      bookingDetails?.date ? `Date: ${format(bookingDetails.date, 'PPP')}` : null,
      bookingDetails?.time_slot ? `Time: ${bookingDetails.time_slot}` : null,
      bookingDetails?.game_type ? `Game: ${bookingDetails.game_type}` : null,
    ].filter(Boolean);
    const text = encodeURIComponent(lines.join('\n'));
    return `${base}${whatsappNumber.replace(/[^\d]/g, '')}?text=${text}`;
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="sm:max-w-md bg-white border-0 shadow-2xl">
        <ModalHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <ModalTitle className="text-xl font-bold text-gray-900">
            🎮 Booking Confirmed!
          </ModalTitle>
          <ModalDescription className="text-gray-600">
            Your gaming session has been successfully booked
          </ModalDescription>
        </ModalHeader>

        <div className="space-y-4">
          {/* Reference Number - Prominently displayed */}
          <div className="bg-gaming-accent/10 border-2 border-gaming-accent/20 rounded-lg p-4 text-center">
            <p className="text-sm font-medium text-gray-700 mb-2">Your Reference Number:</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-bold text-gaming-accent font-mono tracking-wider">
                {referenceNumber}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="ml-2"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Booking Details */}
          {bookingDetails && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-gray-900">Booking Details:</h4>
              
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gaming-accent" />
                  <span className="text-gray-600">
                    {format(bookingDetails.date, 'PPP')}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gaming-accent" />
                  <span className="text-gray-600">
                    {bookingDetails.time_slot}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">
                    Game: {bookingDetails.game_type}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Important Notice */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Important:</strong> Save this reference number! You can use it to cancel your booking up to 1 hour before your session time.
                </p>
              </div>
            </div>
          </div>
        </div>

        <ModalFooter className="sm:justify-center">
          <ModalClose asChild>
            <Button className="w-full sm:w-auto bg-gaming-accent hover:bg-gaming-accent-hover text-white">
              Got it!
            </Button>
          </ModalClose>
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto mt-2 sm:mt-0 inline-flex items-center justify-center rounded-md border border-transparent bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
          >
            <Phone className="h-4 w-4 mr-2" />
            Send to WhatsApp
          </a>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReferenceNumberModal;