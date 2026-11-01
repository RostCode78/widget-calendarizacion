// Prueba de las horas del formulario Nueva tarea (task-12). Se corre con `npm test`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { moverHora, normalizarHora } from './horas.js';

test('normalizarHora entiende las formas comunes y siempre da 24 h', () => {
  const casos = { '1930': '19:30', '19:30': '19:30', '9': '09:00', '930': '09:30', '9.30': '09:30', '7:30 pm': '19:30', '7pm': '19:00', '12 am': '00:00', '12pm': '12:00', '': '', '  ': '' };
  for (const [entrada, salida] of Object.entries(casos)) assert.equal(normalizarHora(entrada), salida, entrada);
});

test('normalizarHora rechaza lo que no es una hora', () => {
  for (const malo of ['25:00', '19:75', 'mañana', '13 pm', '1:2', '123456']) assert.equal(normalizarHora(malo), null, malo);
});

test('moverHora sube y baja de 15 en 15 sin salirse del día', () => {
  assert.equal(moverHora('19:30', 15), '19:45');
  assert.equal(moverHora('19:37', 15), '19:45');
  assert.equal(moverHora('19:37', -15), '19:30');
  assert.equal(moverHora('19:30', -15), '19:15');
  assert.equal(moverHora('23:50', 15), '23:59');
  assert.equal(moverHora('00:05', -15), '00:00');
  assert.equal(moverHora('', 15, new Date('2026-11-02T18:10')), '18:30');
});
