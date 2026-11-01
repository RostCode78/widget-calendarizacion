// Prueba de la regla de avisos (task-10). Se corre con `npm test`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { avisosPendientes } from './avisos.js';

const hoy = '2026-11-02';
const a = (hora, dia = hoy) => new Date(`${dia}T${hora}:00`);
const tarea = (cambios) => ({ id: 'p1', texto: 'Planear la semana', dia: hoy, inicio: '', fin: '', hecha: false, enCurso: false, ...cambios });
const tipos = (tareas, ahora) => avisosPendientes(tareas, ahora).map((x) => x.tipo);

test('inicio y cierre: aviso de inicio, luego de fin, y nada al terminar', () => {
  const t = tarea({ inicio: '19:30', fin: '20:30' });
  assert.deepEqual(tipos([t], a('19:29')), []);
  assert.deepEqual(avisosPendientes([t], a('19:30')), [
    { clave: 'p1-inicio', id: 'p1', tipo: 'inicio', texto: 'Planear la semana', hora: '19:30', rango: '19:30 – 20:30' },
  ]);
  const enCurso = { ...t, enCurso: true };
  assert.deepEqual(tipos([enCurso], a('19:45')), []);
  assert.deepEqual(tipos([enCurso], a('20:30')), ['fin']);
  assert.deepEqual(tipos([{ ...t, hecha: true }], a('20:45')), []);
});

test('solo inicio: un aviso; al aceptarlo queda en curso y no hay aviso de fin', () => {
  const t = tarea({ inicio: '10:00' });
  assert.deepEqual(tipos([t], a('10:00')), ['inicio']);
  assert.deepEqual(avisosPendientes([t], a('10:00'))[0].rango, '10:00');
  assert.deepEqual(tipos([{ ...t, enCurso: true }], a('23:59')), []);
});

test('sin hora: nunca avisa', () => {
  assert.deepEqual(tipos([tarea({})], a('23:59')), []);
});

test('computadora dormida: al volver solo avisa lo de hoy, y la hora de cierre ya pasada manda', () => {
  const tareas = [
    tarea({ id: 'ayer', dia: '2026-11-01', inicio: '09:00', fin: '10:00' }),
    tarea({ id: 'perdida', inicio: '09:00', fin: '10:00' }),
    tarea({ id: 'empezo', inicio: '11:00', fin: '18:00' }),
    tarea({ id: 'manana', dia: '2026-11-03', inicio: '09:00' }),
  ];
  assert.deepEqual(avisosPendientes(tareas, a('12:00')).map((x) => x.clave), ['perdida-fin', 'empezo-inicio']);
});
