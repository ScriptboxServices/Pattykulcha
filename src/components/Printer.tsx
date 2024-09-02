import React from 'react';

const PrintReceiptButton = () => {
  const handlePrint = async () => {
    const response = await fetch('/api/print-receipt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerName: 'John Doe',
        items: [
          { name: 'Product 1', price: 50 },
          { name: 'Product 2', price: 30 },
        ],
        totalAmount: 80,
      }),
    });

  };

  return <button onClick={handlePrint}>Print Receipt</button>;
};

export default PrintReceiptButton;
