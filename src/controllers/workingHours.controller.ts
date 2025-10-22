import { Request, Response } from "express";
import { DateTime } from "luxon";

import { QueryWorkingHours, OkResponse, ErrorResponse } from "#types/types.js";
import { addWorkingTime } from "#services/workingHours.service.js";

const TZ = "America/Bogota";

function badRequest(res: Response, message: string): void {
	res.status(400).json({ error: "InvalidParameters", message });
}

export async function getWorkingHours(req: Request, res: Response): Promise<void> {
	try {
		const { date, days, hours } = (req.query as unknown) as QueryWorkingHours;

		const hasDays = days !== undefined && days !== "";
		const hasHours = hours !== undefined && hours !== "";

			if (!hasDays && !hasHours) {
				badRequest(res, "No se enviaron horas ni días a adicionar");
				return;
			}

		const daysNum = hasDays ? Number(days) : 0;
		const hoursNum = hasHours ? Number(hours) : 0;

			if ((hasDays && (!Number.isInteger(daysNum) || daysNum < 0)) || (hasHours && (!Number.isInteger(hoursNum) || hoursNum < 0))) {
				badRequest(res, "Parámetros inválidos: days/hours deben ser enteros no negativos");
				return;
			}

		let initLocal: DateTime;

		if (date && date !== "") {
			const parsed = DateTime.fromISO(String(date), { zone: "utc" });
					if (!parsed.isValid) {
						badRequest(res, "Parámetro inválido: date debe ser ISO 8601 UTC con sufijo Z");
						return;
					}
			initLocal = parsed.setZone(TZ);
		} else {
			// Current time in Colombia timezone
			initLocal = DateTime.now().setZone(TZ);
		}

		const resultUtc = await addWorkingTime(initLocal, { days: daysNum, hours: hoursNum });

			const body: OkResponse = { date: resultUtc.toUTC().toISO({ suppressMilliseconds: true }) as string };
			res.status(200).json(body);
	} catch (err) {
			const message = err instanceof Error ? err.message : "System error";
			res.status(503).json({ error: "SystemError", message });
	}
}

export default { getWorkingHours };
