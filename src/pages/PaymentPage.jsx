import React from 'react';
import axios from 'axios';

function PaymentPage() {

  const handlePayment = async () => {

    try {

      // Call backend API
      const { data } = await axios.post(
        "http://localhost:8000/create-order"
      );

      console.log("Order Data:", data);

      // Razorpay configuration
      const options = {

        key: "rzp_test_Ss8IowTZWA1S8P",

        amount: data.amount,

        currency: data.currency,

        name: "Charkha",

        description: "Clothing Purchase",

        order_id: data.id,

        handler: function (response) {

          console.log("Payment Success:", response);

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

      // Open Razorpay popup
      const rzp = new window.Razorpay(options);

      rzp.open();

    } catch (error) {

      console.log(error);

      alert("Payment Failed");

    }
  };

  return (

    <div style={{ padding: "40px" }}>

      <h1>Payment Page</h1>

      <button
        onClick={handlePayment}
        style={{
          padding: "12px 24px",
          fontSize: "18px",
          cursor: "pointer"
        }}
      >
        Pay Now
      </button>

    </div>
  );
}

export default PaymentPage;