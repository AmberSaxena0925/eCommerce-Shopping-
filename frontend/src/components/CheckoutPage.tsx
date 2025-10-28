import { useState } from 'react';
import {
  ArrowLeft,
  CreditCard,
  Package,
  Check,
  Smartphone,
} from 'lucide-react';
import { Product } from '../types';
import { useEffect } from 'react';




interface CartItem extends Product {
  quantity: number;
}

interface CheckoutPageProps {
  items: Product[];
  onBack: () => void;
  onOrderComplete: (orderId: string) => void;
}

interface PaymentOption {
  id: string;
  label: string;
  icon: JSX.Element;
}

const paymentOptions: PaymentOption[] = [
  { id: 'card', label: 'Credit / Debit Card', icon: <CreditCard className="w-5 h-5 text-blue-500" /> },
  { id: 'upi', label: 'UPI Payment', icon: <Smartphone className="w-5 h-5 text-green-500" /> },
];

export default function CheckoutPage({
  items,
  onBack,
  onOrderComplete,
}: CheckoutPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>('card');
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    city: '',
    postalCode: '',
    country: 'India',
    upiId: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });

  useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.async = true;
  document.body.appendChild(script);
}, []);

  const cartItems = items.reduce((acc, item) => {
    const existing = acc.find((i) => i.id === item.id);
    if (existing) existing.quantity += 1;
    else acc.push({ ...item, quantity: 1 });
    return acc;
  }, [] as CartItem[]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 50;
  const total = subtotal + shipping;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  const handlePayment = () => {
    switch (selectedPayment) {
      case 'card':
        alert(
          `Processing Card Payment: **** **** **** ${formData.cardNumber.slice(-4)}`
        );
        break;
      case 'upi':
        alert(`Opening UPI Payment for ID: ${formData.upiId}`);
        break;
      default:
        alert('Please select a payment option');
    }
  };
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
const handlePayment = async () => {
  try {
    // 1️⃣ Create order via your backend
    const res = await fetch('http://localhost:5001/api/payment/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: totalAmount }), // amount in rupees
    });

    const order = await res.json();
    console.log('Order created:', order);

    // 2️⃣ Open Razorpay checkout
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // only the public key here
      amount: order.amount,
      currency: order.currency,
      name: 'Your Shop Name',
      description: 'Test Transaction',
      order_id: order.id,
      handler: function (response: any) {
        console.log('Payment successful:', response);
        alert('Payment successful!');
      },
      prefill: {
        name: 'Test User',
        email: 'test@example.com',
        contact: '9999999999'
      },
      theme: { color: '#121212' },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error('Payment error:', err);
    alert('Payment failed');
  }
};


<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (selectedPayment === 'upi' && !/^[\w.-]+@[\w.-]+$/.test(formData.upiId)) {
      alert('Please enter a valid UPI ID (e.g., name@bank)');
      setIsSubmitting(false);
      return;
    }

    if (selectedPayment === 'card' && formData.cardNumber.length < 12) {
      alert('Please enter a valid card number');
      setIsSubmitting(false);
      return;
    }

    try {
      const body = {
        ...formData,
        totalAmount: total,
        paymentMethod: selectedPayment,
        items: cartItems.map((item) => ({
          product_id: item.id,
          product_name: item.name,
          product_price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Failed to create order');

      const json = await res.json();
<<<<<<< Updated upstream
      handlePayment();
=======

      // Simulate payment process after order creation
      handlePayment(total, json.id);

>>>>>>> Stashed changes
      onOrderComplete(json.id);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black px-4 py-12 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="tracking-wider">BACK TO BAG</span>
        </button>

        <h1 className="text-5xl font-light tracking-widest text-white mb-12 text-center">
          CHECKOUT
        </h1>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-zinc-950 border border-zinc-800 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Package className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-light tracking-wider text-white">
                  SHIPPING INFORMATION
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* SHIPPING FORM */}
                {['customerName', 'customerEmail', 'customerPhone', 'shippingAddress', 'city', 'postalCode'].map((field) => (
                  <div key={field}>
                    <label className="block text-zinc-400 text-sm mb-2 tracking-wider">
                      {field.replace('customer', '').replace(/([A-Z])/g, ' $1').toUpperCase()}
                    </label>
                    <input
                      type={field === 'customerEmail' ? 'email' : 'text'}
                      name={field}
                      value={(formData as any)[field]}
                      onChange={handleChange}
                      required
                      className="w-full bg-black border border-zinc-800 px-4 py-3 text-white focus:border-white focus:outline-none transition-colors"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-zinc-400 text-sm mb-2 tracking-wider">COUNTRY</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full bg-black border border-zinc-800 px-4 py-3 text-white focus:border-white focus:outline-none transition-colors"
                  >
                    <option value="India">India</option>
                  </select>
                </div>

                {/* PAYMENT OPTIONS */}
                <div className="pt-8">
                  <h3 className="text-xl text-white mb-4 tracking-wider">
                    SELECT PAYMENT METHOD
                  </h3>
                  <div className="space-y-3">
                    {paymentOptions.map((option) => (
                      <div
                        key={option.id}
                        className={`flex items-center justify-between border p-4 rounded-lg cursor-pointer transition-all ${
                          selectedPayment === option.id
                            ? 'border-blue-600 bg-blue-950/30'
                            : 'border-zinc-800 hover:bg-zinc-900'
                        }`}
                        onClick={() => setSelectedPayment(option.id)}
                      >
                        <div className="flex items-center space-x-3">
                          {option.icon}
                          <span className="text-zinc-200">{option.label}</span>
                        </div>
                        <input
                          type="radio"
                          checked={selectedPayment === option.id}
                          onChange={() => setSelectedPayment(option.id)}
                          className="accent-blue-600"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Dynamic Inputs */}
                  {selectedPayment === 'card' && (
                    <div className="mt-6 space-y-4">
                      <label className="block text-zinc-400 text-sm tracking-wider">
                        CARD DETAILS
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="Card Number"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        required
                        className="w-full bg-black border border-zinc-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="cardExpiry"
                          placeholder="MM/YY"
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          required
                          className="w-full bg-black border border-zinc-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                        />
                        <input
                          type="password"
                          name="cardCvv"
                          placeholder="CVV"
                          value={formData.cardCvv}
                          onChange={handleChange}
                          required
                          className="w-full bg-black border border-zinc-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  {selectedPayment === 'upi' && (
                    <div className="mt-6">
                      <label className="block text-zinc-400 text-sm mb-2 tracking-wider">
                        ENTER YOUR UPI ID
                      </label>
                      <input
                        type="text"
                        name="upiId"
                        placeholder="example@upi"
                        value={formData.upiId}
                        onChange={handleChange}
                        required
                        className="w-full bg-black border border-zinc-800 px-4 py-3 text-white focus:border-green-500 focus:outline-none transition-colors"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-white text-black py-4 tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>
                      {isSubmitting ? 'PROCESSING...' : 'PLACE ORDER'}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="space-y-6">
            <div className="bg-zinc-950 border border-zinc-800 p-8">
              <h2 className="text-2xl font-light tracking-wider text-white mb-6">
                ORDER SUMMARY
              </h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-zinc-800">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-20 h-20 object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-light">{item.name}</h3>
                      <p className="text-zinc-500 text-sm">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-white mt-1">
                        ${(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping}</span>
                </div>
                <div className="flex justify-between text-white text-xl pt-3 border-t border-zinc-800">
                  <span className="tracking-wider">TOTAL</span>
                  <span className="tracking-wider">
                    ${total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 p-6">
              <div className="flex items-start space-x-3 text-sm text-zinc-400">
                <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <p>
                  All pieces are carefully packaged in our signature gift box
                  with authenticity certificate
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
