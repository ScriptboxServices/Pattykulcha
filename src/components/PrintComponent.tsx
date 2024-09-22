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

const PrintComponent = forwardRef<HTMLDivElement,PrintComponentProps>((_props: any, _ref) => {
  return (
    <div ref={_ref} className='receipt'>
      <div className='receipt-header center'>
        {/* <Image
          src='/images/logo.png'
          alt='Logo'
          height={85}
          layout='fixed'
          width={195}
          priority
        /> */}
        <h1>PATTY KULCHA</h1>
      </div>
      <div className='receipt-section'>
        <p>{_props?.address}</p>
        <p>PATTYKULCHA +1 (647)640-0701</p>
      </div>
      <hr />
      <div className='receipt-section'>
        <p>Time : {_props.time}.</p>
        <p>{_props.name}.</p>
        <p>{_props.phone}.</p>
        <p>{_props.address}.</p>
        <p>{_props.distance}.</p>
        <p>{_props.instructions}.</p>
      </div>
      <hr />
      <div className='receipt-section center'>
        <p>
          <strong style={{ fontSize: "18px" }}>Disposable items No.</strong>
        </p>
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
              <p >
                {item?.order?.kulcha?.name} X {item?.order?.kulcha?.quantity}{" "}
                <span className='right bold'>
                  $
                  {Number(item?.order?.kulcha?.price) *
                    Number(item?.order?.kulcha?.quantity)}
                </span>
              </p>
              {additional?.length !== 0 && (
                <p>{addOnName}</p>
              )}
            </div>
          );
        })}
      </div>
      <hr />
      <div className='receipt-section'>
        <p>
          DELIVERY CHARGES{" "}
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
      <div className='receipt-section'>
        <p>P.O.#/Job Name: 0</p>
        <p>7132 62 25171 03/09/2024 3664</p>
        <p>13% HST R135772911</p>
      </div>
      <hr />
      <div className='receipt-section small-text'>
        <p className='center bold'>RETURN POLICY DEFINITIONS</p>
        <div className='return-policy'>
          <span>POLICY ID</span>
          <span>DAYS</span>
          <span>POLICY EXPIRES ON</span>
          <span>A</span>
          <span>1</span>
          <span>0</span>
          <span>03/09/24</span>
        </div>
      </div>
      <hr />
      <div className='receipt-footer center'>
        <p>
          <strong style={{ fontSize: "21px" }}>DID WE NAIL IT?</strong>
        </p>
        <p>Refer a friend and win amazing points!</p>
        <p>Scan Me</p>
      </div>
      <div className='qr-code'>
        <Image
          src='/images/qr.jpg'
          alt='QR Code'
          height={100}
          layout='fixed'
          width={100}
          priority
        />
      </div>
      <div className='receipt-footer center small-text'>
        <p>OR GO TO</p>
        <p>www.pattykulcha.com</p>
        <p>User ID: H89 57763 50693</p>
        <p>Password: 24453 50631</p>
        <p>Entries must be completed within 14 days of purchase.</p>
        <p>See complete rules on website. No purchase necessary.</p>
      </div>
    </div>
  );
});

PrintComponent.displayName = "PrintComponent";

export default PrintComponent;
