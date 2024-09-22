import React, { forwardRef } from "react";
import "../styles/main.css";
import Image from "next/image";

type PrintComponentProps = {
  address: string;
  time: string;
  total: string;
  totalTax: string;
  deliverCharges: string;
  order: any;
  phone: string;
  distance: string;
  instructions: string;
  name: string;
  ref: (el: HTMLDivElement | null) => void;
};

const PrintComponent = forwardRef<HTMLDivElement, PrintComponentProps>(
  (_props: any, _ref) => {
    return (
      <div ref={_ref} className='receipt'>
        Abhishek Poddar
        {/* <div
          className='receipt-header'
          style={{ display: "flex", justifyContent: "center" }}>
          <Image
            src='/images/logo.png'
            alt='Logo'
            height={85}
            layout='fixed'
            width={195}
            priority
          />
        </div>

        <div className='receipt-section'>
          <p className='bold'>
            #Order ID (#{_props.order.orderNumber.forKitchen}):{" "}
            {_props.order.orderNumber.forCustomer}
          </p>
          <p>Placed on {_props.time}</p>
          <p>Due at {_props.time}</p>
          <p>
            Delivery Address: <span>{_props.address}</span>
          </p>
          <p>
            Distance: <span>{_props.distance}</span>
          </p>
          <p>
            Delivery Instructions: <span>{_props.instructions}</span>
          </p>
        </div>
        <hr />
        <div className='receipt-section'>
          <p>
            Name: <span>{_props.name}</span>
          </p>
          <p>
            Phone Number: <span>{_props.phone}</span>
          </p>
        </div>
        <hr />
        <div className='receipt-section center'>
          <p className='bold'>DELIVERY</p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Image
              src='/images/qr.png'
              alt='QR Code'
              height={100}
              layout='fixed'
              width={100}
              priority
            />
          </div>
        </div>

        <hr />

        <div className='receipt-section'>
          {_props?.order?.order?.map((item: any, idx: number) => {
            let { additional } = item?.order;
            let addOnName = "";
            for (let i = 0; i < additional.length; i++) {
              addOnName += additional[i].items[0].name;

              if (i < additional.length - 1) {
                addOnName += " | ";
              }
            }
            return (
              <div key={idx}>
                <p>
                  {item?.order?.kulcha?.name} X {item?.order?.kulcha?.quantity}{" "}
                  <span className='right bold'>
                    $
                    {Number(item?.order?.kulcha?.price) *
                      Number(item?.order?.kulcha?.quantity)}
                  </span>
                </p>
                {additional?.length !== 0 && <p>{addOnName}</p>}
              </div>
            );
          })}
        </div>

        <hr />

        <div className='receipt-section'>
          <p>
            DELIVERY CHARGES
            <span className='right bold'>${_props?.deliverCharges}</span>
          </p>
          <p>
            TAX <span className='right bold'>${_props?.totalTax}</span>
          </p>
          <p>
            TOTAL <span className='right bold'>${_props?.total}</span>
          </p>
        </div>

        <hr />

        <div className='receipt-footer center'>
          <p>
            <strong style={{ fontSize: "16px" }}>
              Thank you for ordering from PattyKulcha!
            </strong>
          </p>
          <p>We hope to serve you again soon!</p>
        </div> */}
      </div>
    );
  }
);

PrintComponent.displayName = "PrintComponent";

export default PrintComponent;
