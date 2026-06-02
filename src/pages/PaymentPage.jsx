import React, { useState } from "react";
import axios from "axios";

function PaymentPage() {

    const amount = 1200;

    const products = [
        {
            name: "Denim Jacket",
            price: 800
        },
        {
            name: "Black T-Shirt",
            price: 400
        }
    ];

    const addresses = [
        "Kolkata, West Bengal",
        "Delhi, India"
    ];

    const [selectedAddress, setSelectedAddress] = useState(addresses[0]);

    const handlePayment = async () => {

        try {

            const { data } = await axios.post(
                "http://localhost:8000/api/payment/create-order",
                {
                    amount,
                    address: selectedAddress,
                    userId: "683dummydemouserid123"
                }
            );

            const options = {

                key: "rzp_test_Ss8IowTZWA1S8P",

                amount: data.order.amount,

                currency: data.order.currency,

                name: "Charkha",

                description: "Clothing Purchase",

                order_id: data.order.id,

                handler: async function (response) {

                    await axios.post(
                        "http://localhost:8000/api/payment/verify-payment",
                        {
                            razorpay_payment_id:
                                response.razorpay_payment_id,

                            razorpay_order_id:
                                response.razorpay_order_id
                        }
                    );

                    alert("Payment Successful");
                },

                prefill: {
                    name: "Customer",
                    email: "customer@example.com",
                    contact: "9999999999"
                },

                theme: {
                    color: "#000000"
                }
            };

            const razor = new window.Razorpay(options);

            razor.open();

        } catch (error) {

            console.log(error);

            alert("Payment Failed");

        }

    };

    return (

        <div className="min-h-screen bg-gray-100 p-8">

            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">

                <h1 className="text-3xl font-bold mb-8">
                    Checkout
                </h1>

                <div className="mb-8">

                    <h2 className="text-xl font-semibold mb-4">
                        Delivery Address
                    </h2>

                    {
                        addresses.map((address, index) => (

                            <label
                                key={index}
                                className="flex items-center border rounded-lg p-4 mb-3 cursor-pointer"
                            >

                                <input
                                    type="radio"
                                    name="address"
                                    checked={selectedAddress === address}
                                    onChange={() =>
                                        setSelectedAddress(address)
                                    }
                                />

                                <span className="ml-3">
                                    {address}
                                </span>

                            </label>

                        ))
                    }

                </div>

                <div className="mb-8">

                    <h2 className="text-xl font-semibold mb-4">
                        Order Summary
                    </h2>

                    {
                        products.map((product, index) => (

                            <div
                                key={index}
                                className="flex justify-between py-3 border-b"
                            >

                                <span>
                                    {product.name}
                                </span>

                                <span>
                                    ₹{product.price}
                                </span>

                            </div>

                        ))
                    }

                </div>

                <div className="flex justify-between text-2xl font-bold mb-8">

                    <span>Total Amount</span>

                    <span>₹{amount}</span>

                </div>

                <button
                    onClick={handlePayment}
                    className="w-full bg-black text-white py-4 rounded-xl text-lg font-semibold hover:opacity-90"
                >
                    Pay ₹{amount}
                </button>

            </div>

        </div>

    );
}

export default PaymentPage;