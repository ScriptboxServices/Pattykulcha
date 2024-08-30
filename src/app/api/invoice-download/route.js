import puppeteer from "puppeteer";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  const {  html } = await req.json();
  const url="";

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    if (url) {
      await page.goto(url, { waitUntil: "networkidle2" });
    } else if (html) {
      await page.setContent(html, { waitUntil: "networkidle2" });
    }

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=generated.pdf",
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({
        code: 0,
        message: "Internal Server Error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
