import { registerAs } from "@nestjs/config";

export default registerAs("appConfig", () => ({
	environment: process.env.NODE_ENV || "production",
	apiVersion: process.env.API_VERSION,
	mailHost: process.env.MAIL_HOST,
	smtpPassword: process.env.SMTP_PASSWORD,
	smtpUsername: process.env.SMTP_USERNAME,
}));
