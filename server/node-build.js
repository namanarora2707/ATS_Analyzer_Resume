import { createServer } from "./index.js";
import cors from "cors";
const app = createServer();
const PORT = process.env.PORT || 8080;
app.use(cors({
  origin: "*", // or specify frontend domain like: "http://localhost:5173"
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Visit: http://localhost:${PORT}`);
});
