import { useState } from 'react';
import {
  X, MapPin, Clock, Users, Calendar, CreditCard,
  CheckCircle, Smartphone, Building2, IndianRupee
} from 'lucide-react';
import { supabase, type Destination } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface BookingModalProps {
  isOpen: boolean;
  destination: Destination | null;
  user: User | null;
  onClose: () => void;
}

type Step = 'details' | 'payment' | 'success';
type PaymentMethod = 'upi' | 'card' | 'netbanking';

export default function BookingModal({ isOpen, destination, user, onClose }: BookingModalProps) {
  const [step, setStep] = useState<Step>('details');
  const [travelers, setTravelers] = useState(1);
  const [travelDate, setTravelDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [bankSelected, setBankSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !destination) return null;

  const totalAmount = destination.package_amount * travelers;
  const gst = Math.round(totalAmount * 0.05);
  const grandTotal = totalAmount + gst;

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 3);
  const minDateStr = minDate.toISOString().split('T')[0];

  function handleClose() {
    setStep('details');
    setTravelers(1);
    setTravelDate('');
    setPaymentMethod('upi');
    setUpiId('');
    setCardNumber('');
    setCardName('');
    setCardExpiry('');
    setCardCvv('');
    setBankSelected('');
    setError('');
    setBookingId('');
    onClose();
  }

  function formatCard(val: string) {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})/g, '$1 ').trim();
  }

  function formatExpiry(val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 2) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  }

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setError('');
    setLoading(true);

    try {
      // Simulate payment processing delay
      await new Promise((r) => setTimeout(r, 2000));

      const paymentRef = `IT${Date.now().toString(36).toUpperCase()}`;

      const { data, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          destination_id: destination.id,
          travel_date: travelDate,
          num_travelers: travelers,
          total_amount: grandTotal,
          status: 'confirmed',
          payment_status: 'paid',
          payment_ref: paymentRef,
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      setBookingId(data.id);
      setStep('success');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const banks = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Bank', 'Yes Bank'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={step !== 'success' ? handleClose : undefined} />

      <div className="relative w-full max-w-2xl bg-gray-950 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden max-h-[calc(100vh-2rem)] flex flex-col">
        <div className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500" />

        {step === 'success' ? (
          <div className="p-10 text-center flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mb-6 animate-bounce">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-3xl font-black text-white mb-2">Booking Confirmed!</h2>
            <p className="text-gray-400 mb-6">Your trip to <span className="text-amber-400 font-semibold">{destination.name}</span> is booked.</p>

            <div className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-5 text-left mb-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Booking ID</span>
                <span className="text-white font-mono text-xs">{bookingId.slice(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Destination</span>
                <span className="text-white">{destination.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Travel Date</span>
                <span className="text-white">{travelDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Travelers</span>
                <span className="text-white">{travelers}</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t border-gray-700 pt-3">
                <span className="text-gray-300">Amount Paid</span>
                <span className="text-amber-400">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-6">A confirmation email has been sent to {user?.email}</p>
            <button
              onClick={handleClose}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-10 py-3 rounded-xl hover:shadow-lg hover:shadow-amber-500/20 transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex-shrink-0 p-6 border-b border-gray-800 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-black text-white">
                  {step === 'details' ? 'Trip Details' : 'Secure Payment'}
                </h2>
                <p className="text-gray-400 text-sm mt-0.5">{destination.name}</p>
              </div>
              <button onClick={handleClose} className="text-gray-400 hover:text-white hover:bg-gray-800 p-2 rounded-xl transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {step === 'details' && (
                <div className="space-y-6">
                  {/* Destination card */}
                  <div className="flex gap-4 p-4 bg-gray-900 rounded-2xl border border-gray-800">
                    <img
                      src={destination.image_url}
                      alt={destination.name}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                    />
                    <div>
                      <h3 className="text-white font-bold">{destination.name}</h3>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-amber-500" />{destination.distance_km.toLocaleString()} km from Bengaluru</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-amber-500" />{destination.duration_days} days</span>
                        <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3 text-amber-500" />₹{destination.package_amount.toLocaleString('en-IN')}/person</span>
                      </div>
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">Travel Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="date"
                        min={minDateStr}
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        required
                        className="w-full bg-gray-900 border border-gray-700 focus:border-amber-500 text-white rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-colors [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  {/* Travelers */}
                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">Number of Travelers</label>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setTravelers(Math.max(1, travelers - 1))}
                        className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-700 text-white hover:border-amber-500 transition-colors flex items-center justify-center text-lg font-bold"
                      >
                        -
                      </button>
                      <div className="flex-1 bg-gray-900 border border-gray-700 rounded-xl py-3 text-center text-white font-bold">
                        <span className="flex items-center justify-center gap-2">
                          <Users className="w-4 h-4 text-amber-400" />
                          {travelers} {travelers === 1 ? 'Traveler' : 'Travelers'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setTravelers(Math.min(20, travelers + 1))}
                        className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-700 text-white hover:border-amber-500 transition-colors flex items-center justify-center text-lg font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Price summary */}
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-2">
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>₹{destination.package_amount.toLocaleString('en-IN')} × {travelers} {travelers === 1 ? 'person' : 'persons'}</span>
                      <span className="text-white">₹{totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>GST (5%)</span>
                      <span className="text-white">₹{gst.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-gray-700 pt-2">
                      <span className="text-gray-300">Grand Total</span>
                      <span className="text-amber-400 text-lg">₹{grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep('payment')}
                    disabled={!travelDate}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/20"
                  >
                    Proceed to Payment — ₹{grandTotal.toLocaleString('en-IN')}
                  </button>
                </div>
              )}

              {step === 'payment' && (
                <form onSubmit={handlePayment} className="space-y-5">
                  {/* Amount reminder */}
                  <div className="flex items-center justify-between p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
                    <span className="text-gray-300 text-sm font-semibold">Amount to Pay</span>
                    <span className="text-amber-400 text-xl font-black">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Payment methods */}
                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-3">Payment Method</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'upi', label: 'UPI', icon: Smartphone },
                        { id: 'card', label: 'Card', icon: CreditCard },
                        { id: 'netbanking', label: 'Net Banking', icon: Building2 },
                      ].map(({ id, label, icon: Icon }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setPaymentMethod(id as PaymentMethod)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 ${
                            paymentMethod === id
                              ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                              : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-500'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-xs font-semibold">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* UPI */}
                  {paymentMethod === 'upi' && (
                    <div>
                      <label className="block text-gray-300 text-sm font-semibold mb-2">UPI ID</label>
                      <input
                        type="text"
                        placeholder="yourname@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        required
                        className="w-full bg-gray-900 border border-gray-700 focus:border-amber-500 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                      />
                      <p className="text-gray-500 text-xs mt-2">Supported: PhonePe, Google Pay, Paytm, BHIM</p>
                    </div>
                  )}

                  {/* Card */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-gray-300 text-sm font-semibold mb-2">Card Number</label>
                        <input
                          type="text"
                          placeholder="4242 4242 4242 4242"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCard(e.target.value))}
                          required
                          maxLength={19}
                          className="w-full bg-gray-900 border border-gray-700 focus:border-amber-500 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm font-semibold mb-2">Cardholder Name</label>
                        <input
                          type="text"
                          placeholder="Name on card"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          required
                          className="w-full bg-gray-900 border border-gray-700 focus:border-amber-500 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-gray-300 text-sm font-semibold mb-2">Expiry</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                            required
                            maxLength={5}
                            className="w-full bg-gray-900 border border-gray-700 focus:border-amber-500 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm font-semibold mb-2">CVV</label>
                          <input
                            type="password"
                            placeholder="***"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            required
                            maxLength={4}
                            className="w-full bg-gray-900 border border-gray-700 focus:border-amber-500 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Net Banking */}
                  {paymentMethod === 'netbanking' && (
                    <div>
                      <label className="block text-gray-300 text-sm font-semibold mb-2">Select Bank</label>
                      <div className="grid grid-cols-2 gap-2">
                        {banks.map((bank) => (
                          <button
                            key={bank}
                            type="button"
                            onClick={() => setBankSelected(bank)}
                            className={`text-sm px-3 py-2.5 rounded-xl border transition-all ${
                              bankSelected === bank
                                ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                                : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-500'
                            }`}
                          >
                            {bank}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep('details')}
                      className="flex-1 border border-gray-700 text-gray-300 hover:border-gray-500 py-3 rounded-xl text-sm font-semibold transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading || (paymentMethod === 'netbanking' && !bankSelected)}
                      className="flex-2 flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/20"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        `Pay ₹${grandTotal.toLocaleString('en-IN')}`
                      )}
                    </button>
                  </div>

                  <p className="text-center text-xs text-gray-600">
                    Secured by 256-bit SSL encryption
                  </p>
                </form>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
