import React, { useState } from 'react';
import { Calendar, Users, CreditCard, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Property } from '@/lib/models/Property';

interface BookingModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (bookingDetails: Record<string, unknown>) => void;
}

export function BookingModal({ property, isOpen, onClose, onConfirm }: BookingModalProps) {
  const [checkIn, setCheckIn] = useState('2024-12-15');
  const [checkOut, setCheckOut] = useState('2024-12-20');
  const [guests, setGuests] = useState('2');
  const [paymentMethod, setPaymentMethod] = useState('card');

  if (!isOpen) return null;

  const nights = 5; // Calculate based on dates
  const pricePerNight = parseFloat(property.price.$numberDecimal || '0');
  const subtotal = pricePerNight * nights;
  const serviceFee = Math.round(subtotal * 0.14);
  const taxes = Math.round(subtotal * 0.08);
  const total = subtotal + serviceFee + taxes;

  const handleConfirm = () => {
    const bookingDetails = {
      propertyId: property._id,
      checkIn,
      checkOut,
      guests: parseInt(guests),
      total,
      paymentMethod
    };
    onConfirm(bookingDetails);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
      <div className="bg-background rounded-t-3xl sm:rounded-xl w-full sm:max-w-lg max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2>Confirm and pay</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Trip Details */}
          <div>
            <h3 className="mb-3">Your trip</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p>Dates</p>
                    <p className="text-sm text-muted-foreground">Dec 15 - 20</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p>Guests</p>
                    <p className="text-sm text-muted-foreground">{guests} guests</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Method */}
          <div>
            <h3 className="mb-3">Pay with</h3>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Credit or debit card</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="apple">Apple Pay</SelectItem>
              </SelectContent>
            </Select>
            
            {paymentMethod === 'card' && (
              <div className="mt-4 space-y-3">
                <Input placeholder="Card number" />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="MM/YY" />
                  <Input placeholder="CVV" />
                </div>
                <Input placeholder="Cardholder name" />
              </div>
            )}
          </div>

          <Separator />

          {/* Price Breakdown */}
          <div>
            <h3 className="mb-3">Price details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>${pricePerNight} x {nights} nights</span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Service fee</span>
                <span>${serviceFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>${taxes}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Total (USD)</span>
                <span>${total}</span>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="text-xs text-muted-foreground">
            By selecting the button below, I agree to the Host&apos;s House Rules, Ground rules for guests, Airbnb&apos;s Rebooking and Refund Policy, and that Airbnb can charge my payment method if I&apos;m responsible for damage.
          </div>

          <Button onClick={handleConfirm} className="w-full h-12">
            Confirm and pay ${total}
          </Button>
        </div>
      </div>
    </div>
  );
}