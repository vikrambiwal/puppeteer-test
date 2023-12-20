const express = require("express");
const puppeteer = require("puppeteer");
// import express from "express";

const router = express.Router();

const app = express();

const hostname = "0.0.0.0";
const port = 3333;
let counter = 0;

app.get("/", (req, res) => {
  counter += 1;
  return res.send({});
});

app.post("/test", (req, res) => {
  console.log("WWW post --- ", req.body);
  return res.send("Received a POST HTTP method");
  // return res.status(500).send({ a: 'Received a POST HTTP method' });
  // return res.status(429).send({ a: 'Received a POST HTTP method' });
});
router.get("/iframe2", async (req, res) => {
  // res.render('iframe', { title: 'Hey', message: 'Hello there!' });
  const pdf = await mappedData();
  res.setHeader("Content-Type", "application/pdf");
  res.send(pdf);
  // res.send("<body><h1>iframe" + d + "</h1></body>");
});

//listen for request on port 3000, and as a callback function have the port listened on logged
app.use("/", router);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

const mappedData = async function async(data) {
  const browser = await puppeteer.launch();

  // Create a new page
  const page = await browser.newPage();

  // Website URL to export as pdf
  const website_url =
    "https://www.bannerbear.com/blog/how-to-download-images-from-a-website-using-puppeteer/";

  // Open URL in current page
  await page.goto(website_url, { waitUntil: "networkidle0" });

  //To reflect CSS used for screens instead of print
  await page.emulateMediaType("screen");

  // Downlaod the PDF
  const pdf = await page.pdf({
    path: "result.pdf",
    margin: { top: "100px", right: "50px", bottom: "100px", left: "50px" },
    printBackground: true,
    format: "A4",
  });

  // Close the browser instance
  await browser.close();
  return pdf;
};
