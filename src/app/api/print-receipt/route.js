import { render, Printer, Text } from "react-thermal-printer";
import { connect } from "node:net";
import { NextResponse } from "next/server";

const data = await render(
  <Printer type="epson">
    <Text>Hello World</Text>
  </Printer>
);

export const POST = async (req) => {
  try {
    const conn = connect(
      {
        host: "192.168.0.99",
        port: 9100,
        timeout: 3000,
      },
      () => {
        conn.write(Buffer.from(data), () => {
          conn.destroy();
        });
      }
    );

    console.log(conn);

    return NextResponse.json(
      { message: "Printed successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Print error:", error);
    return NextResponse.json(
      { message: "Failed to print", error: error.message },
      { status: 500 }
    );
  }
};
