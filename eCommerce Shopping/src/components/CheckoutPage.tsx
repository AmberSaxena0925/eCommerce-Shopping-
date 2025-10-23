import { useState } from 'react';
import { ArrowLeft, CreditCard, Package, Check } from 'lucide-react';
import { Product, supabase } from '../lib/supabase';

interface CartItem extends Product {
  quantity: number;
}

interface CheckoutPageProps {
  items: Product[];
  onBack: () => void;
  onOrderComplete: (orderId: string) => void;
}

export default function CheckoutPage({
  items,
  onBack,
  onOrderComplete,
}: CheckoutPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    city: '',
    postalCode: '',
    country: 'United States',
  });

  const cartItems = items.reduce((acc, item) => {
    const existing = acc.find((i) => i.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      acc.push({ ...item, quantity: 1 });
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: formData.customerName,
          customer_email: formData.customerEmail,
          customer_phone: formData.customerPhone,
          shipping_address: formData.shippingAddress,
          city: formData.city,
          postal_code: formData.postalCode,
          country: formData.country,
          total_amount: total,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      onOrderComplete(order.id);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-12">
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
                <div>
                  <label className="block text-zinc-400 text-sm mb-2 tracking-wider">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                    className="w-full bg-black border border-zinc-800 px-4 py-3 text-white focus:border-white focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 text-sm mb-2 tracking-wider">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    required
                    className="w-full bg-black border border-zinc-800 px-4 py-3 text-white focus:border-white focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 text-sm mb-2 tracking-wider">
                    PHONE
                  </label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    className="w-full bg-black border border-zinc-800 px-4 py-3 text-white focus:border-white focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 text-sm mb-2 tracking-wider">
                    ADDRESS
                  </label>
                  <input
                    type="text"
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    required
                    className="w-full bg-black border border-zinc-800 px-4 py-3 text-white focus:border-white focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 text-sm mb-2 tracking-wider">
                      CITY
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full bg-black border border-zinc-800 px-4 py-3 text-white focus:border-white focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 text-sm mb-2 tracking-wider">
                      POSTAL CODE
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      required
                      className="w-full bg-black border border-zinc-800 px-4 py-3 text-white focus:border-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 text-sm mb-2 tracking-wider">
                    COUNTRY
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full bg-black border border-zinc-800 px-4 py-3 text-white focus:border-white focus:outline-none transition-colors"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-white text-black py-4 tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>{isSubmitting ? 'PROCESSING...' : 'PLACE ORDER'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

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
                  <span className="tracking-wider">${total.toLocaleString()}</span>
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
