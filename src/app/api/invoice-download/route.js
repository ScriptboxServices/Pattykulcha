import { NextResponse } from "next/server";
import { admin } from "@/firebaseAdmin/config";
import { generateInvoiceHtml } from "../../../utils/generateInvoiceHtml";
const chromium = require("@sparticuz/chromium");

const db = admin.firestore();

export const POST = async (req) => {
  try{
    const {  userId,orderId } = await req.json();
  
    const orderDoc = await db.collection('orders').doc(orderId).get();
    let order;
  if (orderDoc.exists && orderDoc.data().userId === userId) {
    order = {
      _id : orderDoc.id,
      ...orderDoc.data()
    }
    const html = generateInvoiceHtml(order)
    let puppeteer;
    let browser;
    if(process.env.NEXT_PUBLIC_ENVIRONMENT === 'Production'){
      puppeteer = require("puppeteer-core");
      browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
      });
    }else{
      puppeteer = require("puppeteer");
      browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox','--font-render-hinting=none'],
        headless : 'new',
        ignoreHTTPSErrors: true,
      })
    }
  
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle2" });
    await page.emulateMediaType("screen");
    await page.setViewport({
      width: 1200,
      height: 800,
    });
  
    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: { top: "50px", right: "50px", bottom: "50px", left: "50px" },
      printBackground: true,
      preferCSSPageSize: true,
    });
  
    await browser.close();
    console.log(pdfBuffer);
    return NextResponse.json(
      {
        code: 1,
        message: "Invoice generated successfully.",
      },
      {
        status: 200,
      }
    );
  }else{
    return NextResponse.json(
      {
        code: 0,
        message: "Order not fount",
      },
      {
        status: 404,
      }
    );
  }

  }catch(err) {
    return NextResponse.json(
      {
        code: 0,
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
};
