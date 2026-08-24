'use client';

import React, { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Order, Script } from '@/lib/types';
import {
  CheckCircle2,
  Download,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
  Zap,
  Copy,
  Check,
  ArrowLeft,
  CreditCard,
  Send,
  Smartphone,
  Wallet,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const directScriptSlug = searchParams.get('script');

  const {
    cart,
    cartTotal,
    getScriptBySlug,
    currentUser,
    registerUser,
    loginUser,
    completePurchase,
    downloadScriptPackage,
    settings,
    isMounted,
  } = useApp();

  // If a single script slug was passed in URL, checkout that script directly; otherwise use cart
  const directScript = React.useMemo(() => {
    if (!directScriptSlug) return null;
    return getScriptBySlug(directScriptSlug) || null;
  }, [directScriptSlug, getScriptBySlug]);

  const itemsToCheckout: Script[] = directScript ? [directScript] : cart;

  // Form states
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'instant' | 'bkash' | 'card' | 'crypto' | 'telegram'>('instant');
  const [trxId, setTrxId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // Sync with currentUser if logged in dynamically
  const activeName = currentUser?.name || customerName;
  const activeEmail = currentUser?.email || customerEmail;

  const totalAmount = itemsToCheckout.reduce((acc, item) => {
    const effective =
      item.discountPrice !== null && item.discountPrice !== undefined && item.discountPrice < item.regularPrice
        ? item.discountPrice
        : item.regularPrice;
    return acc + (Number(effective) || 0);
  }, 0);

  const currency = settings.currencySymbol || '$';

  const handleCopyPassword = (pass: string) => {
    navigator.clipboard.writeText(pass);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const finalName = (currentUser?.name || customerName).trim() || 'Customer';
    const finalEmail = (currentUser?.email || customerEmail).trim() || 'customer@example.com';

    // If user is guest and entered a password, auto create account
    if (!currentUser && customerEmail && password) {
      registerUser(finalName, finalEmail, password);
    }

    setTimeout(() => {
      const order = completePurchase({
        paymentMethod:
          paymentMethod === 'instant'
            ? 'Instant Direct Access'
            : paymentMethod === 'bkash'
            ? 'bKash / Mobile Wallet'
            : paymentMethod === 'card'
            ? 'Credit / Debit Card'
            : paymentMethod === 'crypto'
            ? 'USDT / Crypto Escrow'
            : 'Telegram Direct Verification',
        customerName: finalName,
        customerEmail: finalEmail,
        items: itemsToCheckout,
      });

      setCompletedOrder(order);
      setIsProcessing(false);
    }, 600);
  };

  if (!isMounted) {
    return (
      <div className="py-20 text-center text-slate-500 text-sm">
        Initializing checkout...
      </div>
    );
  }

  // If order was just completed, show immediate fulfillment & instant download access
  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto my-8 sm:my-12 px-4">
        <div className="bg-white rounded-3xl border border-emerald-200/80 shadow-2xl p-6 sm:p-10 space-y-8 animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
              <Zap className="w-3.5 h-3.5 fill-emerald-600" />
              Order Completed • Access Granted
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Your Scripts Are Ready for Download!
            </h1>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              Order <strong className="text-slate-800">{completedOrder.orderNumber}</strong> has been confirmed. You now have permanent access to download and unzip these source code packages.
            </p>
          </div>

          {/* Download Cards for each item */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Instant Download Files & License Keys
            </h2>

            {completedOrder.items.map((item, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-4 hover:border-blue-300 transition-all shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md">
                        {item.version || 'v2.0.0'}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {item.fileSize || '45.0 MB'}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                      {item.title}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      downloadScriptPackage({
                        id: item.scriptId,
                        title: item.title,
                        slug: item.slug,
                        downloadUrl: item.downloadUrl,
                        downloadPassword: item.downloadPassword,
                        version: item.version,
                        framework: item.framework,
                      })
                    }
                    className="shrink-0 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Package (.ZIP)</span>
                  </button>
                </div>

                {/* Password / License Key Reveal Box */}
                {item.downloadPassword && (
                  <div className="p-3.5 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-500 shrink-0" />
                      <span className="text-xs font-semibold text-slate-600">
                        Archive Unzip Password / License:
                      </span>
                      <code className="text-xs font-mono font-bold bg-amber-50 text-amber-900 px-2 py-1 rounded border border-amber-200">
                        {item.downloadPassword}
                      </code>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyPassword(item.downloadPassword!)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-all self-start sm:self-auto cursor-pointer"
                    >
                      {copiedKey ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Key</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/account/downloads"
              className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-600/20 text-center flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Go to My Downloads Area</span>
            </Link>

            <Link
              href="/scripts"
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl text-center"
            >
              Explore More Scripts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If no items in checkout
  if (itemsToCheckout.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Your Cart is Empty</h2>
          <p className="text-sm text-slate-500 mt-1">
            Choose a script from our catalog to proceed with instant checkout and download.
          </p>
        </div>
        <Link
          href="/scripts"
          className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition-all"
        >
          Browse All Scripts
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto my-8 sm:my-12 px-4 sm:px-6">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/scripts"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Checkout Details & Payment */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-8 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Secure Checkout & Instant Delivery
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Enter your details to create an account and immediately unlock source code downloads.
              </p>
            </div>

            <form id="checkout-form" onSubmit={handleCompleteOrder} className="space-y-5">
              {/* Customer Account Info */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Account & License Recipient
                  </h2>
                  {!currentUser && (
                    <Link
                      href="/login?redirect=/checkout"
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      Already have an account? Log In
                    </Link>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Download links and license receipt will be tied to this email.
                  </p>
                </div>

                {/* Password field for guest users to register effortlessly */}
                {!currentUser && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Create Password (to access downloads anytime)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="password"
                        required
                        minLength={5}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create account password"
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select Payment Option
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Instant Sandbox Direct Access */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'instant'
                        ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/10'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="instant"
                      checked={paymentMethod === 'instant'}
                      onChange={() => setPaymentMethod('instant')}
                      className="mt-0.5 text-blue-600"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold text-slate-900">Instant Sandbox Access</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Immediate 1-click verification & instant file download.
                      </p>
                    </div>
                  </label>

                  {/* bKash / Mobile Banking */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'bkash'
                        ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/10'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bkash"
                      checked={paymentMethod === 'bkash'}
                      onChange={() => setPaymentMethod('bkash')}
                      className="mt-0.5 text-blue-600"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-pink-600" />
                        <span className="text-xs font-bold text-slate-900">bKash / Nagad Wallet</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Send Money & enter TrxID for automated approval.
                      </p>
                    </div>
                  </label>

                  {/* Card Gateway */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/10'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="mt-0.5 text-blue-600"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold text-slate-900">Credit / Debit Card</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Visa, Mastercard, Amex digital processing.
                      </p>
                    </div>
                  </label>

                  {/* Crypto */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'crypto'
                        ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/10'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="crypto"
                      checked={paymentMethod === 'crypto'}
                      onChange={() => setPaymentMethod('crypto')}
                      className="mt-0.5 text-blue-600"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Wallet className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-900">Crypto / USDT</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        USDT (TRC20), BTC, or ETH transfer.
                      </p>
                    </div>
                  </label>
                </div>

                {/* bKash Details Helper */}
                {paymentMethod === 'bkash' && (
                  <div className="p-4 bg-pink-50/60 border border-pink-200 rounded-2xl space-y-2">
                    <p className="text-xs font-bold text-pink-900">
                      bKash / Nagad Personal Number: <code className="bg-white px-2 py-0.5 rounded border border-pink-200 font-mono text-pink-700 font-bold">+880 1800-000000</code>
                    </p>
                    <p className="text-[11px] text-pink-800">
                      1. Send total amount ({currency}{totalAmount}) to the number above.
                      <br />
                      2. Enter your Transaction ID (TrxID) below:
                    </p>
                    <input
                      type="text"
                      placeholder="e.g. 9J8A7K21X"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-pink-300 rounded-xl focus:outline-none text-slate-900"
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl text-sm sm:text-base shadow-lg shadow-blue-600/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-5 h-5" />
                  <span>
                    {isProcessing ? 'Processing Order...' : `Complete Order & Get Instant Access (${currency}${totalAmount})`}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 space-y-5">
            <h2 className="text-lg font-bold text-slate-900 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-semibold text-slate-500">
                {itemsToCheckout.length} {itemsToCheckout.length === 1 ? 'item' : 'items'}
              </span>
            </h2>

            {/* List of items */}
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {itemsToCheckout.map((item) => {
                const effective =
                  item.discountPrice !== null && item.discountPrice !== undefined && item.discountPrice < item.regularPrice
                    ? item.discountPrice
                    : item.regularPrice;
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100"
                  >
                    <img
                      src={item.mainImage}
                      alt={item.title}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                      <p className="text-[11px] text-slate-500">{item.framework || 'Full Stack Script'}</p>
                      <span className="text-xs font-bold text-blue-600">
                        {currency}
                        {effective}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Price Calculations */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span>Subtotal</span>
                <span>
                  {currency}
                  {totalAmount}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Instant Digital Delivery</span>
                <span className="text-emerald-600 font-bold">FREE (0s)</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Lifetime Updates & Keys</span>
                <span className="text-emerald-600 font-bold">Included</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-base font-black text-slate-900">
                <span>Total Due</span>
                <span className="text-blue-600">
                  {currency}
                  {totalAmount}
                </span>
              </div>
            </div>

            {/* Telegram Alternative Support */}
            {settings.telegramSupportUrl && (
              <div className="pt-3 border-t border-slate-100">
                <a
                  href={settings.telegramSupportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold rounded-xl border border-sky-200/80 transition-all"
                >
                  <Send className="w-3.5 h-3.5 text-sky-600" />
                  <span>Prefer Manual Telegram Order? Contact Support</span>
                </a>
              </div>
            )}

            {/* Security Guarantee */}
            <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Buyer Protection & Guarantee</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Full source code, uncompiled assets, documentation, and unzip keys delivered immediately upon confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-4">
      <Suspense fallback={<div className="p-8 text-center text-slate-500 text-sm">Loading checkout...</div>}>
        <CheckoutContent />
      </Suspense>
    </div>
  );
}
