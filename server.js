const express = require("express");
const path = require("path");
const app = express();

// Раздаём всё из папки public (index.html откроется на "/")
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/geo", async (req, res) => {
  const ip = req.query.ip || "";
  const query = ip ? `&ipAddress=${encodeURIComponent(ip)}` : "";
  const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.GEO_API}${query}`;

  const response = await fetch(url);
  const data = await response.json();
  res.json(data);
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

app.listen(process.env.PORT || 3000);
