import { render, Printer, Text } from "react-thermal-printer";
import { connect } from "node:net";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    // Render the receipt content
    const data = await render(
      <Printer type="epson">
        <Text>Hello World</Text>
      </Printer>
    );

    // Ensure the data is in the correct buffer format
    const printData = Buffer.from(data);

    // Connect to the printer via network (TCP)
    const conn = connect(
      {
        host: "192.168.1.87",  // Printer IP address
        port: 9100,            // Printer port (commonly 9100 for network printers)
        timeout: 3000,         // Timeout of 3 seconds
      },
      () => {
        console.log("Connection to printer established.");

        // Send the data to the printer
        conn.write(printData, (err) => {
          if (err) {
            console.error("Error writing to printer:", err);
            conn.destroy();
            return NextResponse.json({ message: "Failed to print", error: err.message }, { status: 500 });
          }
          console.log("Data sent to printer successfully.");
          conn.destroy();
        });
      }
    );

    console.log(conn,"PPPPPPPPPPPPPPPPPPPPPPPPP");

    // Handle connection errors
    conn.on('error', (err) => {
      console.error("Connection error:", err);
      return NextResponse.json({ message: "Connection failed", error: err.message }, { status: 500 });
    });

    return NextResponse.json({ message: "Printed successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Print error:", error);
    return NextResponse.json({ message: "Failed to print", error: error.message }, { status: 500 });
  }
};
