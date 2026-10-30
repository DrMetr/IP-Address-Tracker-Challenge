const express = require("express");
const app = express();

app.get("/api/geo", async (req, res) => {
  const ip = req.query.ip || "";
  const query = ip ? `&ipAddress=${encodeURIComponent(ip)}` : "";
  const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.GEO_API}${query}`;

  const response = await fetch(url);
  const data = await response.json();
  res.json(data);
});

app.listen(process.env.PORT || 3000);
