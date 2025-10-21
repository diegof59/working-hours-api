import express, { Application } from 'express';
import workingHoursRoutes from './routes/workingHours.routes';

// App def
const app: Application = express();
const PORT: string = process.env.PORT || "5900";

// Middlewares
app.use(express.json());

app.use("/api/v1/working-hours", workingHoursRoutes);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

export default app;