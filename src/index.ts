// Configura variáveis de ambiente o mais cedo possível
import { config } from "dotenv";
config();

// Configura estampa de tempo dos logs
import consoleStamp from "console-stamp";
consoleStamp(console, { pattern: "yyyy-mm-dd HH:MM:ss.l" });

import cors from "cors";
import express from "express";
import fileUpload from "express-fileupload";
import { resolve } from "path";

import routes from "./routes/routes";

const port = process.env.PORT || 3200;
const app = express();

app.use("/uploads", express.static(resolve(__dirname, "./uploads")));

app.use(fileUpload());
app.use(express.json());
app.use(cors({
	origin: "*",
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	preflightContinue: true
}));

app.use("/api", routes);

app.listen(port, () => {
	console.log(`Server is listening on ${port}`);
});
