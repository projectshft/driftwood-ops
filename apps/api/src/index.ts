import express from "express";
import { config } from "./config";
import healthRoutes from "./routes/health";
import customerRoutes from "./routes/customers";
import inventoryRoutes from "./routes/inventory";
import orderRoutes from "./routes/orders";
import shipmentRoutes from "./routes/shipments";
import portalRoutes from "./routes/portal";

const app = express();
app.use(express.json());

app.use(healthRoutes);
app.use(customerRoutes);
app.use(inventoryRoutes);
app.use(orderRoutes);
app.use(shipmentRoutes);
app.use(portalRoutes);

app.listen(config.port, () => {
  console.log(`driftwood-api listening on ${config.port}`);
});
