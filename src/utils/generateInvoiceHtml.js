import { formatTimestampToCustomDate } from "./commonFunctions";

const calculateTax = (_order) => {
  const { additional, kulcha } = _order;
  const additionalTotal = additional?.reduce((acc, value) => {
    return (acc =
      acc +
      Number(value?.items?.[0]?.price) * Number(value?.items?.[0]?.quantity));
  }, Number(kulcha?.price) * Number(kulcha.quantity));
  return Number(Number(additionalTotal) * 0.13).toFixed(2);
};

export const generateInvoiceHtml = (order) => {
  let rows = ``;
  for (let item of order.order) {
    const { order } = item;
    rows =
      rows +
      `<tr>
            <td>${order.kulcha.name}</td>
            <td>${order.kulcha.quantity}</td>
            <td>13%</td>
            <td>${calculateTax(order)}</td>
            <td>$${item.total_amount}</td>
          </tr>`;
  }

  let html = `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Invoice</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        height: 100vh;
        background-color: #f7f7f7;
      }

      .invoice-container {
        background-color: white;
        padding: 20px;
        margin-top: 10px;
        width: 900px;
      }

      .header {
        text-align: center;
        margin-bottom: 20px;
      }

      .header h2 {
        margin: 0;
        font-size: 18px;
      }

      .invoice-details {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }

      .invoice-details .left,
      .invoice-details .right {
        font-size: 14px;
        line-height: 1.5;
      }

      .invoice-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }

      .invoice-table th,
      .invoice-table td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
        font-size: 14px;
      }

      .invoice-table th {
        background-color: #f4f4f4;
      }

      .total {
        font-size: 14px;
        margin-bottom: 20px;
        text-align: right;
      }

      .total p {
        margin: 5px 0;
      }

      .total strong {
        font-size: 16px;
      }

      .footer {
        font-size: 12px;
        text-align: center;
        margin-top: 20px;
        color: #555;
      }
    </style>
  </head>
  <body>
    <div class="invoice-container">
      <div class="header">
        <h2>Tax Invoice</h2>
      </div>
      <div class="invoice-details">
        <div class="left">
          <p>Canada</p>
          <p>Invoice number: ${order._id}</p>
       
          <p>Invoice date: ${formatTimestampToCustomDate(order.createdAt)}</p>
        </div>
        <div class="right">
          <p>Invoice issued by Patty Kulcha Limited.</p>
          <p>HST number: 75491142RT0001</p>
          <p>GST number: 75491142RT0001</p>
          <!-- <p>on behalf of:</p>
          <p>OLGA SOSNORA</p>
          <p>Canada</p> -->
        </div>
      </div>
      <table class="invoice-table">
        <thead>
          <tr>
            <th>Order item</th>
            <th>Quantity</th>
            <th>Tax</th>
            <th>Tax Amount</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
      <div class="total">
        <p>Total net amount: $${Number(order.basic_amount).toFixed(2)}</p>
        <p>Total HST 13%: $${Number(order.total_tax).toFixed(2)}</p>
        <p>Total amount payable: $${Number(order.grand_total).toFixed(2)}</p>
      </div>
    </div>
  </body>
</html>`;

  return html;
};
