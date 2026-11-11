import { readFileSync } from 'node:fs';

const manual = JSON.parse(readFileSync(new URL('./data/manual.json', import.meta.url), 'utf8'));

/**
 * @param {{ vehicleId: string, codes: string[] }} input
 * @returns {{
 *   vehicle: string,
 *   codes: { code: string, description: string }[],
 *   notFound: string[],
 *   causes: {
 *     id: string, title: string, component: string, probability: number,
 *     codes: string[], steps: { text: string, expected: string }[]
 *   }[]
 * }}
 */
export function diagnose({ vehicleId, codes }) {
  const vehicle = manual.vehicles.find((item) => item.id === vehicleId);
  if (!vehicle) {
    throw new Error(`No existe un vehículo con id «${vehicleId}»`);
  }

  const catalog = indexCodes(vehicle.codes);
  const requested = [...new Set(codes.map(normalizeCode).filter(Boolean))];

  const found = [];
  const notFound = [];
  for (const code of requested) {
    const info = catalog.get(code);
    if (info) found.push({ code, ...info });
    else notFound.push(code);
  }

  found.sort((a, b) => a.code.localeCompare(b.code, 'es'));
  notFound.sort((a, b) => a.localeCompare(b, 'es'));

  const grouped = new Map();
  for (const entry of found) {
    for (const link of entry.causes) {
      const current = grouped.get(link.cause);
      if (!current) {
        grouped.set(link.cause, {
          id: link.cause,
          probability: link.probability,
          codes: new Set([entry.code]),
        });
        continue;
      }
      current.codes.add(entry.code);
      if (link.probability > current.probability) current.probability = link.probability;
    }
  }

  const causes = [...grouped.values()].map((cause) => presentCause(vehicle, cause));
  // Más probable primero. Si empatan, la que respaldan más códigos y, si siguen igual, el título.
  causes.sort((a, b) => {
    if (a.probability !== b.probability) return b.probability - a.probability;
    if (a.codes.length !== b.codes.length) return b.codes.length - a.codes.length;
    const byTitle = a.title.localeCompare(b.title, 'es');
    if (byTitle !== 0) return byTitle;
    return a.id.localeCompare(b.id, 'es');
  });

  return {
    vehicle: vehicle.name,
    codes: found.map(({ code, description }) => ({ code, description })),
    notFound,
    causes,
  };
}

function normalizeCode(code) {
  return code.trim().toUpperCase();
}

function indexCodes(codes) {
  const byCode = new Map();
  for (const [raw, info] of Object.entries(codes)) {
    const code = normalizeCode(raw);
    if (!code || byCode.has(code)) continue;
    byCode.set(code, info);
  }
  return byCode;
}

function presentCause(vehicle, cause) {
  const info = vehicle.causes[cause.id];
  const codes = [...cause.codes].sort((a, b) => a.localeCompare(b, 'es'));
  if (!info) {
    return {
      id: cause.id,
      title: cause.id,
      component: cause.id,
      probability: cause.probability,
      codes,
      steps: [{
        text: `Consultar el procedimiento del fabricante para «${cause.id}»: este manual no trae los pasos para comprobar esta causa`,
        expected: 'No hay valor de referencia en el manual',
      }],
    };
  }

  return {
    id: cause.id,
    title: info.title,
    component: info.component,
    probability: cause.probability,
    codes,
    steps: info.steps.map((step) => ({ ...step })),
  };
}
