import { Given, When, Then } from "@cucumber/cucumber";
import request from "supertest";
import assert from "assert";

import { QueryWorkingHours } from "#types/types.js";

import app from "#index.js";

let response: request.Response;

let queryParams: QueryWorkingHours = {};

const API_URL = '/api/v1/working-hours';

/**
 * Background
 */

Given('Working Hours API está ejecutandose', async () => {
  assert.ok(app, 'Working Hours API no está ejecutandose');
});

Given('Capta Holidays API está disponible y accesible', async () => {
  return true;
  // assert.ok(ToDo mock Holidays API, 'Capta Holidays API no disponible o accesible');
});
 

When(
  'Dale suma {string} de días',
  (daysStr: string) => {
    queryParams.days = daysStr;
  }
);

When(
  'Dale suma {string} de horas',
  (hoursStr: string) => {
     queryParams.hours = hoursStr;
  }
);

Then(
  'Dale recibe como respuesta {string} en UTC',
  async (resultDateTime: string) => {
    response = await request(app)
      .get(API_URL)
      .query(queryParams)
      .expect(200);

    assert.equal(response.status, 200);
    assert.strictEqual(response.body.date, resultDateTime);
  }
);

Then(
  'Dale recibe como respuesta el error {error} con message {message}',
  async (error: string, message: string) => {
    response = await request(app)
      .get(API_URL)
      .query(queryParams)
      .expect(400);

      assert.equal(response.status, 400);
      assert.strictEqual(response.body.error, error);
      assert.strictEqual(response.body.message, message);
    }
)