import type { ToolConfig } from './types'

export const converterTools: ToolConfig[] = [
  {
    slug: 'length-converter',
    title: 'Length Converter',
    desc: 'Convert between meters, feet, inches, centimeters, kilometers, miles, and yards instantly.',
    cat: 'converter',
    icon: '📏',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Value', type: 'number', placeholder: '1' },
      {
        k: 'from',
        l: 'From',
        type: 'select',
        options: [
          { value: 'm', label: 'Meters (m)' },
          { value: 'km', label: 'Kilometers (km)' },
          { value: 'cm', label: 'Centimeters (cm)' },
          { value: 'mm', label: 'Millimeters (mm)' },
          { value: 'ft', label: 'Feet (ft)' },
          { value: 'in', label: 'Inches (in)' },
          { value: 'mi', label: 'Miles (mi)' },
          { value: 'yd', label: 'Yards (yd)' },
        ],
      },
    ],
    fn: (inputs) => {
      const v = parseFloat(inputs.value)
      if (isNaN(v)) return [{ type: 'text', label: 'Error', content: 'Enter a valid number.' }]
      const toM: Record<string, number> = { m: 1, km: 1000, cm: 0.01, mm: 0.001, ft: 0.3048, in: 0.0254, mi: 1609.344, yd: 0.9144 }
      const base = v * (toM[inputs.from] ?? 1)
      const rows = Object.entries(toM).map(([unit, factor]) => ({
        label: unit === 'm' ? 'Meters (m)' : unit === 'km' ? 'Kilometers (km)' : unit === 'cm' ? 'Centimeters (cm)' : unit === 'mm' ? 'Millimeters (mm)' : unit === 'ft' ? 'Feet (ft)' : unit === 'in' ? 'Inches (in)' : unit === 'mi' ? 'Miles (mi)' : 'Yards (yd)',
        value: (base / factor).toPrecision(8).replace(/\.?0+$/, ''),
      }))
      return [{ type: 'table', label: 'Length Conversions', content: rows }]
    },
    about: 'The meter is the SI base unit of length, defined since 1983 as the distance light travels in 1/299,792,458 of a second. The US still uses the customary system — feet, inches, miles — in everyday life. One foot equals exactly 0.3048 meters.',
    related: ['weight-converter', 'area-converter', 'volume-converter'],
  },
  {
    slug: 'weight-converter',
    title: 'Weight Converter',
    desc: 'Convert between kilograms, pounds, ounces, grams, and metric tons.',
    cat: 'converter',
    icon: '⚖️',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Value', type: 'number', placeholder: '1' },
      {
        k: 'from',
        l: 'From',
        type: 'select',
        options: [
          { value: 'kg', label: 'Kilograms (kg)' },
          { value: 'lb', label: 'Pounds (lb)' },
          { value: 'oz', label: 'Ounces (oz)' },
          { value: 'g', label: 'Grams (g)' },
          { value: 't', label: 'Metric Tons (t)' },
          { value: 'st', label: 'Stone (st)' },
        ],
      },
    ],
    fn: (inputs) => {
      const v = parseFloat(inputs.value)
      if (isNaN(v)) return [{ type: 'text', label: 'Error', content: 'Enter a valid number.' }]
      const toKg: Record<string, number> = { kg: 1, lb: 0.45359237, oz: 0.028349523125, g: 0.001, t: 1000, st: 6.35029318 }
      const base = v * (toKg[inputs.from] ?? 1)
      const labels: Record<string, string> = { kg: 'Kilograms (kg)', lb: 'Pounds (lb)', oz: 'Ounces (oz)', g: 'Grams (g)', t: 'Metric Tons (t)', st: 'Stone (st)' }
      const rows = Object.entries(toKg).map(([unit, factor]) => ({ label: labels[unit], value: (base / factor).toPrecision(8).replace(/\.?0+$/, '') }))
      return [{ type: 'table', label: 'Weight Conversions', content: rows }]
    },
    about: 'The kilogram is the SI base unit of mass, defined since 2019 by the Planck constant. The pound (lb) derives from the Roman libra — 16 ounces or exactly 0.45359237 kg. The stone (14 lb) is still used for body weight in the UK and Ireland.',
    related: ['length-converter', 'bmi-unit-converter', 'cooking-measurement-converter'],
  },
  {
    slug: 'temperature-converter',
    title: 'Temperature Converter',
    desc: 'Convert between Celsius, Fahrenheit, and Kelvin with real-time results.',
    cat: 'converter',
    icon: '🌡️',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Temperature', type: 'number', placeholder: '100' },
      {
        k: 'from',
        l: 'From',
        type: 'select',
        options: [
          { value: 'c', label: 'Celsius (°C)' },
          { value: 'f', label: 'Fahrenheit (°F)' },
          { value: 'k', label: 'Kelvin (K)' },
        ],
      },
    ],
    fn: (inputs) => {
      const v = parseFloat(inputs.value)
      if (isNaN(v)) return [{ type: 'text', label: 'Error', content: 'Enter a valid number.' }]
      let celsius: number
      if (inputs.from === 'c') celsius = v
      else if (inputs.from === 'f') celsius = (v - 32) * 5 / 9
      else celsius = v - 273.15
      const f = celsius * 9 / 5 + 32
      const k = celsius + 273.15
      return [{
        type: 'table', label: 'Temperature Conversions', content: [
          { label: 'Celsius (°C)', value: celsius.toFixed(4).replace(/\.?0+$/, '') },
          { label: 'Fahrenheit (°F)', value: f.toFixed(4).replace(/\.?0+$/, '') },
          { label: 'Kelvin (K)', value: k.toFixed(4).replace(/\.?0+$/, '') },
        ]
      }]
    },
    about: 'Celsius is the standard in most of the world, based on water freezing at 0° and boiling at 100°. The US uses Fahrenheit, where water freezes at 32° and boils at 212°. Kelvin starts at absolute zero (−273.15°C) and is used in science.',
    related: ['oven-temperature-converter', 'length-converter', 'weight-converter'],
  },
  {
    slug: 'speed-converter',
    title: 'Speed Converter',
    desc: 'Convert miles per hour, kilometers per hour, meters per second, knots, and more.',
    cat: 'converter',
    icon: '🚀',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Value', type: 'number', placeholder: '60' },
      {
        k: 'from',
        l: 'From',
        type: 'select',
        options: [
          { value: 'mph', label: 'Miles per hour (mph)' },
          { value: 'kph', label: 'Kilometers per hour (km/h)' },
          { value: 'ms', label: 'Meters per second (m/s)' },
          { value: 'knots', label: 'Knots (kt)' },
          { value: 'fps', label: 'Feet per second (fps)' },
          { value: 'mach', label: 'Mach (at sea level)' },
        ],
      },
    ],
    fn: (inputs) => {
      const v = parseFloat(inputs.value)
      if (isNaN(v)) return [{ type: 'text', label: 'Error', content: 'Enter a valid number.' }]
      const toMs: Record<string, number> = { mph: 0.44704, kph: 1 / 3.6, ms: 1, knots: 0.514444, fps: 0.3048, mach: 340.29 }
      const base = v * (toMs[inputs.from] ?? 1)
      const labels: Record<string, string> = { mph: 'Miles per hour (mph)', kph: 'Kilometers per hour (km/h)', ms: 'Meters per second (m/s)', knots: 'Knots (kt)', fps: 'Feet per second (fps)', mach: 'Mach' }
      const rows = Object.entries(toMs).map(([unit, factor]) => ({ label: labels[unit], value: (base / factor).toPrecision(6).replace(/\.?0+$/, '') }))
      return [{ type: 'table', label: 'Speed Conversions', content: rows }]
    },
    about: 'Speed is distance per unit of time. Knots are nautical miles per hour — used in aviation and maritime navigation. Mach 1 is roughly 767 mph (1,235 km/h) at sea level at 59°F; it varies with altitude and temperature.',
    related: ['length-converter', 'fuel-efficiency-converter', 'commute-cost-calculator'],
  },
  {
    slug: 'area-converter',
    title: 'Area Converter',
    desc: 'Convert square meters, square feet, acres, hectares, and more.',
    cat: 'converter',
    icon: '🗺️',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Value', type: 'number', placeholder: '1' },
      {
        k: 'from',
        l: 'From',
        type: 'select',
        options: [
          { value: 'sqm', label: 'Square Meters (m²)' },
          { value: 'sqft', label: 'Square Feet (ft²)' },
          { value: 'sqkm', label: 'Square Kilometers (km²)' },
          { value: 'sqmi', label: 'Square Miles (mi²)' },
          { value: 'acre', label: 'Acres' },
          { value: 'ha', label: 'Hectares (ha)' },
          { value: 'sqyd', label: 'Square Yards (yd²)' },
          { value: 'sqin', label: 'Square Inches (in²)' },
        ],
      },
    ],
    fn: (inputs) => {
      const v = parseFloat(inputs.value)
      if (isNaN(v)) return [{ type: 'text', label: 'Error', content: 'Enter a valid number.' }]
      const toSqm: Record<string, number> = { sqm: 1, sqft: 0.09290304, sqkm: 1e6, sqmi: 2589988.110336, acre: 4046.8564224, ha: 10000, sqyd: 0.83612736, sqin: 0.00064516 }
      const base = v * (toSqm[inputs.from] ?? 1)
      const labels: Record<string, string> = { sqm: 'Square Meters (m²)', sqft: 'Square Feet (ft²)', sqkm: 'Square Kilometers (km²)', sqmi: 'Square Miles (mi²)', acre: 'Acres', ha: 'Hectares (ha)', sqyd: 'Square Yards (yd²)', sqin: 'Square Inches (in²)' }
      const rows = Object.entries(toSqm).map(([u, f]) => ({ label: labels[u], value: (base / f).toPrecision(7).replace(/\.?0+$/, '') }))
      return [{ type: 'table', label: 'Area Conversions', content: rows }]
    },
    about: 'One acre equals 43,560 square feet — a unit dating to medieval England as the area a yoke of oxen could plow in a day. A hectare (10,000 m²) is the metric equivalent used in agriculture and real estate outside the US.',
    related: ['length-converter', 'property-tax-rate-by-state', 'home-affordability-quick-check'],
  },
  {
    slug: 'volume-converter',
    title: 'Volume Converter',
    desc: 'Convert liters, gallons, fluid ounces, cups, milliliters, and cubic units.',
    cat: 'converter',
    icon: '🧴',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Value', type: 'number', placeholder: '1' },
      {
        k: 'from',
        l: 'From',
        type: 'select',
        options: [
          { value: 'l', label: 'Liters (L)' },
          { value: 'ml', label: 'Milliliters (mL)' },
          { value: 'gal', label: 'US Gallons (gal)' },
          { value: 'qt', label: 'US Quarts (qt)' },
          { value: 'pt', label: 'US Pints (pt)' },
          { value: 'cup', label: 'US Cups' },
          { value: 'floz', label: 'Fluid Ounces (fl oz)' },
          { value: 'tbsp', label: 'Tablespoons (tbsp)' },
          { value: 'tsp', label: 'Teaspoons (tsp)' },
          { value: 'm3', label: 'Cubic Meters (m³)' },
          { value: 'ft3', label: 'Cubic Feet (ft³)' },
        ],
      },
    ],
    fn: (inputs) => {
      const v = parseFloat(inputs.value)
      if (isNaN(v)) return [{ type: 'text', label: 'Error', content: 'Enter a valid number.' }]
      const toL: Record<string, number> = { l: 1, ml: 0.001, gal: 3.785411784, qt: 0.946352946, pt: 0.473176473, cup: 0.2365882365, floz: 0.0295735295625, tbsp: 0.01478676478125, tsp: 0.00492892159375, m3: 1000, ft3: 28.316846592 }
      const base = v * (toL[inputs.from] ?? 1)
      const labels: Record<string, string> = { l: 'Liters (L)', ml: 'Milliliters (mL)', gal: 'US Gallons', qt: 'US Quarts', pt: 'US Pints', cup: 'US Cups', floz: 'Fluid Ounces', tbsp: 'Tablespoons', tsp: 'Teaspoons', m3: 'Cubic Meters (m³)', ft3: 'Cubic Feet (ft³)' }
      const rows = Object.entries(toL).map(([u, f]) => ({ label: labels[u], value: (base / f).toPrecision(6).replace(/\.?0+$/, '') }))
      return [{ type: 'table', label: 'Volume Conversions', content: rows }]
    },
    about: 'The US gallon (3.785 L) differs from the imperial gallon (4.546 L) used in the UK and Canada. A US cup is 8 fluid ounces or about 236.6 mL. These differences cause significant confusion in recipes across countries.',
    related: ['cooking-measurement-converter', 'wine-bottle-size-converter', 'water-usage-calculator'],
  },
  {
    slug: 'pressure-converter',
    title: 'Pressure Converter',
    desc: 'Convert PSI, bar, atmospheres, pascals, mmHg, and other pressure units.',
    cat: 'converter',
    icon: '💨',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Value', type: 'number', placeholder: '14.696' },
      {
        k: 'from',
        l: 'From',
        type: 'select',
        options: [
          { value: 'psi', label: 'PSI (psi)' },
          { value: 'pa', label: 'Pascals (Pa)' },
          { value: 'kpa', label: 'Kilopascals (kPa)' },
          { value: 'bar', label: 'Bar' },
          { value: 'atm', label: 'Atmospheres (atm)' },
          { value: 'mmhg', label: 'mmHg (Torr)' },
          { value: 'inhg', label: 'Inches of Mercury (inHg)' },
        ],
      },
    ],
    fn: (inputs) => {
      const v = parseFloat(inputs.value)
      if (isNaN(v)) return [{ type: 'text', label: 'Error', content: 'Enter a valid number.' }]
      const toPa: Record<string, number> = { psi: 6894.757293168, pa: 1, kpa: 1000, bar: 100000, atm: 101325, mmhg: 133.322387415, inhg: 3386.389 }
      const base = v * (toPa[inputs.from] ?? 1)
      const labels: Record<string, string> = { psi: 'PSI', pa: 'Pascals (Pa)', kpa: 'Kilopascals (kPa)', bar: 'Bar', atm: 'Atmospheres (atm)', mmhg: 'mmHg (Torr)', inhg: 'Inches of Mercury (inHg)' }
      const rows = Object.entries(toPa).map(([u, f]) => ({ label: labels[u], value: (base / f).toPrecision(6).replace(/\.?0+$/, '') }))
      return [{ type: 'table', label: 'Pressure Conversions', content: rows }]
    },
    about: 'Standard atmospheric pressure is 101,325 Pa (1 atm), equal to 14.696 PSI or 29.92 inHg. Tire pressure is measured in PSI in the US, bar in Europe. Blood pressure is measured in mmHg worldwide.',
    related: ['temperature-converter', 'energy-converter'],
  },
  {
    slug: 'energy-converter',
    title: 'Energy Converter',
    desc: 'Convert joules, calories, kilowatt-hours, BTUs, and electron volts.',
    cat: 'converter',
    icon: '⚡',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Value', type: 'number', placeholder: '1' },
      {
        k: 'from',
        l: 'From',
        type: 'select',
        options: [
          { value: 'j', label: 'Joules (J)' },
          { value: 'kj', label: 'Kilojoules (kJ)' },
          { value: 'cal', label: 'Calories (cal)' },
          { value: 'kcal', label: 'Kilocalories (kcal)' },
          { value: 'kwh', label: 'Kilowatt-hours (kWh)' },
          { value: 'wh', label: 'Watt-hours (Wh)' },
          { value: 'btu', label: 'BTU' },
          { value: 'ev', label: 'Electron Volts (eV)' },
        ],
      },
    ],
    fn: (inputs) => {
      const v = parseFloat(inputs.value)
      if (isNaN(v)) return [{ type: 'text', label: 'Error', content: 'Enter a valid number.' }]
      const toJ: Record<string, number> = { j: 1, kj: 1000, cal: 4.184, kcal: 4184, kwh: 3600000, wh: 3600, btu: 1055.05585262, ev: 1.602176634e-19 }
      const base = v * (toJ[inputs.from] ?? 1)
      const labels: Record<string, string> = { j: 'Joules (J)', kj: 'Kilojoules (kJ)', cal: 'Calories (cal)', kcal: 'Kilocalories (kcal)', kwh: 'Kilowatt-hours (kWh)', wh: 'Watt-hours (Wh)', btu: 'BTU', ev: 'Electron Volts (eV)' }
      const rows = Object.entries(toJ).map(([u, f]) => ({ label: labels[u], value: (base / f).toExponential(4) }))
      return [{ type: 'table', label: 'Energy Conversions', content: rows }]
    },
    about: 'A food calorie is actually a kilocalorie (kcal) — 4,184 joules. One kWh equals 3.6 megajoules, the energy used by a 1,000-watt device for one hour. The BTU (British Thermal Unit) is still used in HVAC ratings in the US.',
    related: ['power-converter', 'energy-usage-estimator', 'electric-vehicle-savings-calculator'],
  },
  {
    slug: 'power-converter',
    title: 'Power Converter',
    desc: 'Convert watts, kilowatts, horsepower, BTU/hr, and other power units.',
    cat: 'converter',
    icon: '🔌',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Value', type: 'number', placeholder: '1' },
      {
        k: 'from',
        l: 'From',
        type: 'select',
        options: [
          { value: 'w', label: 'Watts (W)' },
          { value: 'kw', label: 'Kilowatts (kW)' },
          { value: 'mw', label: 'Megawatts (MW)' },
          { value: 'hp', label: 'Horsepower (hp)' },
          { value: 'btuhr', label: 'BTU/hour' },
          { value: 'ftlbs', label: 'ft·lbf/s' },
        ],
      },
    ],
    fn: (inputs) => {
      const v = parseFloat(inputs.value)
      if (isNaN(v)) return [{ type: 'text', label: 'Error', content: 'Enter a valid number.' }]
      const toW: Record<string, number> = { w: 1, kw: 1000, mw: 1e6, hp: 745.69987158227, btuhr: 0.29307107017222, ftlbs: 1.3558179483314 }
      const base = v * (toW[inputs.from] ?? 1)
      const labels: Record<string, string> = { w: 'Watts (W)', kw: 'Kilowatts (kW)', mw: 'Megawatts (MW)', hp: 'Horsepower (hp)', btuhr: 'BTU/hour', ftlbs: 'ft·lbf/s' }
      const rows = Object.entries(toW).map(([u, f]) => ({ label: labels[u], value: (base / f).toPrecision(6).replace(/\.?0+$/, '') }))
      return [{ type: 'table', label: 'Power Conversions', content: rows }]
    },
    about: 'The watt (W) is the SI unit for power, named after James Watt. One mechanical horsepower equals exactly 745.7 watts. Air conditioners in the US are rated in BTUs per hour; 12,000 BTU/hr equals 1 ton of cooling capacity.',
    related: ['energy-converter', 'energy-usage-estimator', 'solar-panel-savings-estimator'],
  },
  {
    slug: 'time-converter',
    title: 'Time Converter',
    desc: 'Convert seconds, minutes, hours, days, weeks, months, and years.',
    cat: 'converter',
    icon: '⏱️',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Value', type: 'number', placeholder: '1' },
      {
        k: 'from',
        l: 'From',
        type: 'select',
        options: [
          { value: 'ms', label: 'Milliseconds' },
          { value: 's', label: 'Seconds' },
          { value: 'min', label: 'Minutes' },
          { value: 'hr', label: 'Hours' },
          { value: 'day', label: 'Days' },
          { value: 'wk', label: 'Weeks' },
          { value: 'mo', label: 'Months (avg)' },
          { value: 'yr', label: 'Years (365)' },
        ],
      },
    ],
    fn: (inputs) => {
      const v = parseFloat(inputs.value)
      if (isNaN(v)) return [{ type: 'text', label: 'Error', content: 'Enter a valid number.' }]
      const toS: Record<string, number> = { ms: 0.001, s: 1, min: 60, hr: 3600, day: 86400, wk: 604800, mo: 2629800, yr: 31536000 }
      const base = v * (toS[inputs.from] ?? 1)
      const labels: Record<string, string> = { ms: 'Milliseconds', s: 'Seconds', min: 'Minutes', hr: 'Hours', day: 'Days', wk: 'Weeks', mo: 'Months', yr: 'Years' }
      const rows = Object.entries(toS).map(([u, f]) => ({ label: labels[u], value: (base / f).toPrecision(6).replace(/\.?0+$/, '') }))
      return [{ type: 'table', label: 'Time Conversions', content: rows }]
    },
    about: 'A year averages 365.25 days accounting for leap years; a month averages 30.4375 days. Milliseconds matter in computing — network round-trip times are typically 1–100 ms. A nanosecond is one billionth of a second.',
    related: ['unix-timestamp-converter', 'days-between-dates-calculator', 'work-days-calculator'],
  },
  {
    slug: 'data-storage-converter',
    title: 'Data Storage Converter',
    desc: 'Convert bytes, kilobytes, megabytes, gigabytes, terabytes, and bits.',
    cat: 'converter',
    icon: '💾',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Value', type: 'number', placeholder: '1' },
      {
        k: 'from',
        l: 'From',
        type: 'select',
        options: [
          { value: 'b', label: 'Bits (b)' },
          { value: 'B', label: 'Bytes (B)' },
          { value: 'KB', label: 'Kilobytes (KB)' },
          { value: 'MB', label: 'Megabytes (MB)' },
          { value: 'GB', label: 'Gigabytes (GB)' },
          { value: 'TB', label: 'Terabytes (TB)' },
          { value: 'PB', label: 'Petabytes (PB)' },
          { value: 'Kib', label: 'Kibibytes (KiB)' },
          { value: 'Mib', label: 'Mebibytes (MiB)' },
          { value: 'Gib', label: 'Gibibytes (GiB)' },
        ],
      },
    ],
    fn: (inputs) => {
      const v = parseFloat(inputs.value)
      if (isNaN(v)) return [{ type: 'text', label: 'Error', content: 'Enter a valid number.' }]
      const toB: Record<string, number> = { b: 0.125, B: 1, KB: 1000, MB: 1e6, GB: 1e9, TB: 1e12, PB: 1e15, Kib: 1024, Mib: 1048576, Gib: 1073741824 }
      const base = v * (toB[inputs.from] ?? 1)
      const labels: Record<string, string> = { b: 'Bits', B: 'Bytes', KB: 'Kilobytes (KB)', MB: 'Megabytes (MB)', GB: 'Gigabytes (GB)', TB: 'Terabytes (TB)', PB: 'Petabytes (PB)', Kib: 'Kibibytes (KiB)', Mib: 'Mebibytes (MiB)', Gib: 'Gibibytes (GiB)' }
      const rows = Object.entries(toB).map(([u, f]) => ({ label: labels[u], value: (base / f).toPrecision(6).replace(/\.?0+$/, '') }))
      return [{ type: 'table', label: 'Data Storage Conversions', content: rows }]
    },
    about: 'Storage makers use SI prefixes (1 KB = 1,000 B), while operating systems often use binary prefixes (1 KiB = 1,024 B). A 500 GB hard drive holds about 465 GiB. One terabyte can store roughly 250,000 photos or 500 hours of HD video.',
    related: ['bandwidth-calculator', 'bitrate-converter', 'cloud-cost-estimator-aws'],
  },
  {
    slug: 'number-base-converter',
    title: 'Number Base Converter',
    desc: 'Convert decimal, binary, hexadecimal, and octal numbers instantly.',
    cat: 'converter',
    icon: '🔢',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Number', type: 'text', placeholder: '255' },
      {
        k: 'from',
        l: 'From Base',
        type: 'select',
        options: [
          { value: '10', label: 'Decimal (Base 10)' },
          { value: '2', label: 'Binary (Base 2)' },
          { value: '16', label: 'Hexadecimal (Base 16)' },
          { value: '8', label: 'Octal (Base 8)' },
        ],
      },
    ],
    fn: (inputs) => {
      const n = parseInt(inputs.value, parseInt(inputs.from))
      if (isNaN(n)) return [{ type: 'text', label: 'Error', content: 'Enter a valid number for the selected base.' }]
      return [{
        type: 'table', label: 'Number Base Conversions', content: [
          { label: 'Decimal (Base 10)', value: n.toString(10) },
          { label: 'Binary (Base 2)', value: n.toString(2) },
          { label: 'Hexadecimal (Base 16)', value: n.toString(16).toUpperCase() },
          { label: 'Octal (Base 8)', value: n.toString(8) },
        ]
      }]
    },
    about: 'Binary (base 2) uses only 0 and 1 — the foundation of all computing. Hexadecimal (base 16, digits 0–9 and A–F) compactly represents binary data; each hex digit equals exactly 4 bits. Octal (base 8) was used in early computing systems.',
    related: ['ascii-converter', 'binary-text-converter', 'hex-color-converter'],
  },
  {
    slug: 'roman-numeral-converter',
    title: 'Roman Numeral Converter',
    desc: 'Convert between Arabic numbers and Roman numerals, up to 3,999.',
    cat: 'converter',
    icon: '🏛️',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Number or Roman Numeral', type: 'text', placeholder: '2025' },
    ],
    fn: (inputs) => {
      const raw = inputs.value.trim().toUpperCase()
      const isRoman = /^[IVXLCDM]+$/.test(raw)
      const vals: [string, number][] = [['M', 1000], ['CM', 900], ['D', 500], ['CD', 400], ['C', 100], ['XC', 90], ['L', 50], ['XL', 40], ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]]
      if (isRoman) {
        let i = 0; let n = 0
        for (const [sym, val] of vals) { while (raw.slice(i).startsWith(sym)) { n += val; i += sym.length } }
        return [{ type: 'table', label: 'Conversion Result', content: [{ label: 'Roman Numeral', value: raw }, { label: 'Arabic Number', value: n.toString() }] }]
      } else {
        let num = parseInt(raw)
        if (isNaN(num) || num < 1 || num > 3999) return [{ type: 'text', label: 'Error', content: 'Enter a number between 1 and 3,999.' }]
        let result = ''
        for (const [sym, val] of vals) { while (num >= val) { result += sym; num -= val } }
        return [{ type: 'table', label: 'Conversion Result', content: [{ label: 'Arabic Number', value: inputs.value }, { label: 'Roman Numeral', value: result }] }]
      }
    },
    about: 'Roman numerals were the standard notation in ancient Rome and medieval Europe. They remain in use today for clock faces, copyright years, Super Bowl numbering, and formal page numbering. The system has no symbol for zero.',
    related: ['number-base-converter', 'ascii-converter'],
  },
  {
    slug: 'ascii-converter',
    title: 'ASCII / Character Code Converter',
    desc: 'Convert between characters and their ASCII or Unicode code points.',
    cat: 'converter',
    icon: '🔤',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Character or ASCII Code', type: 'text', placeholder: 'A or 65' },
    ],
    fn: (inputs) => {
      const raw = inputs.value.trim()
      const num = parseInt(raw)
      if (!isNaN(num) && num >= 0 && num <= 1114111) {
        const char = String.fromCodePoint(num)
        return [{
          type: 'table', label: 'Character Info', content: [
            { label: 'Character', value: char },
            { label: 'Decimal', value: num.toString() },
            { label: 'Hex', value: '0x' + num.toString(16).toUpperCase() },
            { label: 'Binary', value: num.toString(2) },
            { label: 'HTML Entity', value: `&#${num};` },
          ]
        }]
      } else if (raw.length >= 1) {
        const cp = raw.codePointAt(0) ?? 0
        return [{
          type: 'table', label: 'Character Info', content: [
            { label: 'Character', value: raw[0] },
            { label: 'Decimal', value: cp.toString() },
            { label: 'Hex', value: '0x' + cp.toString(16).toUpperCase() },
            { label: 'Binary', value: cp.toString(2) },
            { label: 'HTML Entity', value: `&#${cp};` },
          ]
        }]
      }
      return [{ type: 'text', label: 'Error', content: 'Enter a character or numeric code point.' }]
    },
    about: 'ASCII (American Standard Code for Information Interchange) assigns numbers 0–127 to characters. Unicode extends this to over 1.1 million code points, covering virtually every writing system in the world.',
    related: ['number-base-converter', 'binary-text-converter', 'hex-color-converter'],
  },
  {
    slug: 'binary-text-converter',
    title: 'Binary to Text Converter',
    desc: 'Convert text to binary code and binary back to readable text.',
    cat: 'converter',
    icon: '01️⃣',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Text or Binary', type: 'textarea', placeholder: 'Hello or 01001000 01100101 01101100' },
      {
        k: 'mode',
        l: 'Direction',
        type: 'select',
        options: [
          { value: 'to', label: 'Text → Binary' },
          { value: 'from', label: 'Binary → Text' },
        ],
      },
    ],
    fn: (inputs) => {
      const raw = inputs.value.trim()
      if (inputs.mode === 'to') {
        const bin = raw.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ')
        return [{ type: 'value', label: 'Binary Output', content: bin }]
      } else {
        const bytes = raw.replace(/\s+/g, ' ').trim().split(' ')
        const text = bytes.map(b => String.fromCharCode(parseInt(b, 2))).join('')
        return [{ type: 'value', label: 'Text Output', content: text }]
      }
    },
    about: 'Every character on your screen is stored as a sequence of bits. ASCII characters fit in 8 bits (one byte). Modern text uses UTF-8 encoding, which uses 1–4 bytes per character to cover all Unicode characters.',
    related: ['ascii-converter', 'number-base-converter', 'base64-encoder-decoder'],
  },
  {
    slug: 'hex-color-converter',
    title: 'Hex Color Converter',
    desc: 'Convert between hex color codes, RGB, HSL, and color names.',
    cat: 'converter',
    icon: '🎨',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Color Value', type: 'text', placeholder: '#3b82f6 or rgb(59,130,246)' },
    ],
    fn: (inputs) => {
      const raw = inputs.value.trim()
      let r = 0, g = 0, b = 0
      const hexMatch = raw.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i)
      const rgbMatch = raw.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/i)
      if (hexMatch) {
        let h = hexMatch[1]
        if (h.length === 3) h = h.split('').map(x => x + x).join('')
        r = parseInt(h.slice(0, 2), 16); g = parseInt(h.slice(2, 4), 16); b = parseInt(h.slice(4, 6), 16)
      } else if (rgbMatch) {
        r = parseInt(rgbMatch[1]); g = parseInt(rgbMatch[2]); b = parseInt(rgbMatch[3])
      } else {
        return [{ type: 'text', label: 'Error', content: 'Enter hex (#rrggbb) or rgb(r,g,b) format.' }]
      }
      const rn = r / 255, gn = g / 255, bn = b / 255
      const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
      const l = (max + min) / 2
      let h2 = 0, s2 = 0
      if (max !== min) {
        const d = max - min; s2 = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        if (max === rn) h2 = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6
        else if (max === gn) h2 = ((bn - rn) / d + 2) / 6
        else h2 = ((rn - gn) / d + 4) / 6
      }
      const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase()
      return [{
        type: 'table', label: 'Color Formats', content: [
          { label: 'Hex', value: hex },
          { label: 'RGB', value: `rgb(${r}, ${g}, ${b})` },
          { label: 'HSL', value: `hsl(${Math.round(h2 * 360)}, ${Math.round(s2 * 100)}%, ${Math.round(l * 100)}%)` },
          { label: 'R', value: r.toString() }, { label: 'G', value: g.toString() }, { label: 'B', value: b.toString() },
        ]
      }]
    },
    about: 'Hex colors are six-digit codes in base 16, representing red, green, and blue intensities (00–FF each). RGB uses decimal 0–255. HSL (hue, saturation, lightness) is more intuitive for adjusting colors.',
    related: ['rgb-to-hex-converter', 'hsl-to-rgb-converter', 'css-px-to-rem-converter'],
  },
  {
    slug: 'rgb-to-hex-converter',
    title: 'RGB to Hex Converter',
    desc: 'Enter RGB values (0–255) and get the hex color code instantly.',
    cat: 'converter',
    icon: '🖌️',
    toolType: 'converter',
    fields: [
      { k: 'r', l: 'Red (R)', type: 'number', placeholder: '59' },
      { k: 'g', l: 'Green (G)', type: 'number', placeholder: '130' },
      { k: 'b', l: 'Blue (B)', type: 'number', placeholder: '246' },
    ],
    fn: (inputs) => {
      const r = Math.round(Math.min(255, Math.max(0, parseFloat(inputs.r) || 0)))
      const g = Math.round(Math.min(255, Math.max(0, parseFloat(inputs.g) || 0)))
      const b = Math.round(Math.min(255, Math.max(0, parseFloat(inputs.b) || 0)))
      const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase()
      return [{
        type: 'table', label: 'Color Output', content: [
          { label: 'Hex Code', value: hex },
          { label: 'RGB', value: `rgb(${r}, ${g}, ${b})` },
          { label: 'CSS Value', value: hex },
        ]
      }]
    },
    about: 'CSS supports both hex and rgb() color notation. Hex is shorter for most colors; rgb() is easier to read and supports rgba() for transparency. Both produce identical colors in browsers.',
    related: ['hex-color-converter', 'hsl-to-rgb-converter', 'css-px-to-rem-converter'],
  },
  {
    slug: 'hsl-to-rgb-converter',
    title: 'HSL to RGB Converter',
    desc: 'Convert HSL (hue, saturation, lightness) color values to RGB and hex.',
    cat: 'converter',
    icon: '🌈',
    toolType: 'converter',
    fields: [
      { k: 'h', l: 'Hue (0–360)', type: 'number', placeholder: '217' },
      { k: 's', l: 'Saturation (0–100%)', type: 'number', placeholder: '91' },
      { k: 'l', l: 'Lightness (0–100%)', type: 'number', placeholder: '60' },
    ],
    fn: (inputs) => {
      const h = (parseFloat(inputs.h) || 0) / 360
      const s = (parseFloat(inputs.s) || 0) / 100
      const l = (parseFloat(inputs.l) || 0) / 100
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1; if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }
      let r: number, g: number, b: number
      if (s === 0) { r = g = b = l } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s
        const p = 2 * l - q
        r = hue2rgb(p, q, h + 1 / 3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1 / 3)
      }
      const ri = Math.round(r * 255), gi = Math.round(g * 255), bi = Math.round(b * 255)
      const hex = '#' + [ri, gi, bi].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase()
      return [{
        type: 'table', label: 'Color Output', content: [
          { label: 'Hex', value: hex }, { label: 'RGB', value: `rgb(${ri}, ${gi}, ${bi})` },
          { label: 'HSL', value: `hsl(${Math.round(parseFloat(inputs.h))}, ${Math.round(parseFloat(inputs.s))}%, ${Math.round(parseFloat(inputs.l))}%)` },
        ]
      }]
    },
    about: 'HSL separates hue (the actual color, 0–360°), saturation (color intensity, 0–100%), and lightness (brightness, 0–100%). Designers prefer HSL for creating color palettes because adjusting lightness alone produces consistent tints and shades.',
    related: ['hex-color-converter', 'rgb-to-hex-converter', 'css-px-to-rem-converter'],
  },
  {
    slug: 'css-px-to-rem-converter',
    title: 'CSS px to rem Converter',
    desc: 'Convert pixel values to rem units based on a root font size.',
    cat: 'converter',
    icon: '💻',
    toolType: 'converter',
    fields: [
      { k: 'px', l: 'Pixels (px)', type: 'number', placeholder: '16' },
      { k: 'base', l: 'Root Font Size (px)', type: 'number', placeholder: '16' },
    ],
    fn: (inputs) => {
      const px = parseFloat(inputs.px) || 0
      const base = parseFloat(inputs.base) || 16
      const rem = px / base
      const em = rem
      return [{
        type: 'table', label: 'CSS Unit Conversions', content: [
          { label: 'rem', value: `${rem.toFixed(4).replace(/\.?0+$/, '')}rem` },
          { label: 'em', value: `${em.toFixed(4).replace(/\.?0+$/, '')}em` },
          { label: 'px', value: `${px}px` },
          { label: 'pt', value: `${(px * 0.75).toFixed(2)}pt` },
          { label: 'vw (at 1440px)', value: `${(px / 14.4).toFixed(4)}vw` },
        ]
      }]
    },
    about: 'Rem units are relative to the root element\'s font size (typically 16px). Using rem instead of px improves accessibility — users who set their browser font size larger will see proportionally larger text. Most design systems use a 16px root.',
    related: ['hex-color-converter', 'font-size-converter', 'aspect-ratio-converter'],
  },
  {
    slug: 'unix-timestamp-converter',
    title: 'Unix Timestamp Converter',
    desc: 'Convert Unix timestamps to readable dates and vice versa.',
    cat: 'converter',
    icon: '📅',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Unix Timestamp or Date', type: 'text', placeholder: '1700000000 or 2024-01-15' },
    ],
    fn: (inputs) => {
      const raw = inputs.value.trim()
      const num = parseInt(raw)
      if (!isNaN(num) && /^\d+$/.test(raw)) {
        const ms = num < 1e10 ? num * 1000 : num
        const d = new Date(ms)
        return [{
          type: 'table', label: 'Date/Time', content: [
            { label: 'UTC', value: d.toUTCString() },
            { label: 'ISO 8601', value: d.toISOString() },
            { label: 'Unix (seconds)', value: Math.floor(ms / 1000).toString() },
            { label: 'Unix (ms)', value: ms.toString() },
            { label: 'Relative', value: `${Math.round((Date.now() - ms) / 86400000)} days ago` },
          ]
        }]
      } else {
        const d = new Date(raw)
        if (isNaN(d.getTime())) return [{ type: 'text', label: 'Error', content: 'Enter a Unix timestamp or date like 2024-01-15.' }]
        return [{
          type: 'table', label: 'Timestamp', content: [
            { label: 'Unix (seconds)', value: Math.floor(d.getTime() / 1000).toString() },
            { label: 'Unix (ms)', value: d.getTime().toString() },
            { label: 'UTC', value: d.toUTCString() },
            { label: 'ISO 8601', value: d.toISOString() },
          ]
        }]
      }
    },
    about: 'Unix time counts seconds since January 1, 1970, 00:00:00 UTC. It is the universal timestamp format in databases and APIs. JavaScript uses milliseconds; most other systems use seconds. Year 2038 will overflow 32-bit Unix timestamps.',
    related: ['date-format-converter', 'timezone-converter', 'days-between-dates-calculator'],
  },
  {
    slug: 'date-format-converter',
    title: 'Date Format Converter',
    desc: 'Convert dates between US, European, ISO 8601, and other common formats.',
    cat: 'converter',
    icon: '📆',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Date', type: 'text', placeholder: '01/15/2025 or 2025-01-15' },
    ],
    fn: (inputs) => {
      const d = new Date(inputs.value.trim())
      if (isNaN(d.getTime())) return [{ type: 'text', label: 'Error', content: 'Enter a valid date (YYYY-MM-DD, MM/DD/YYYY, etc.).' }]
      const pad = (n: number) => n.toString().padStart(2, '0')
      const y = d.getFullYear(), mo = d.getMonth() + 1, da = d.getDate()
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      return [{
        type: 'table', label: 'Date Formats', content: [
          { label: 'ISO 8601', value: `${y}-${pad(mo)}-${pad(da)}` },
          { label: 'US (MM/DD/YYYY)', value: `${pad(mo)}/${pad(da)}/${y}` },
          { label: 'European (DD/MM/YYYY)', value: `${pad(da)}/${pad(mo)}/${y}` },
          { label: 'Long Form', value: `${days[d.getDay()]}, ${months[mo - 1]} ${da}, ${y}` },
          { label: 'Short Month', value: `${months[mo - 1].slice(0, 3)} ${da}, ${y}` },
          { label: 'Day of Week', value: days[d.getDay()] },
          { label: 'Day of Year', value: Math.floor((d.getTime() - new Date(y, 0, 0).getTime()) / 86400000).toString() },
        ]
      }]
    },
    about: 'Date formats differ dramatically by country. The US uses MM/DD/YYYY; most of Europe uses DD/MM/YYYY; ISO 8601 uses YYYY-MM-DD. ISO 8601 sorts correctly alphabetically and is the global standard for APIs and databases.',
    related: ['unix-timestamp-converter', 'days-between-dates-calculator', 'timezone-converter'],
  },
  {
    slug: 'timezone-converter',
    title: 'Time Zone Converter',
    desc: 'Convert times between major world time zones including US, Europe, and Asia.',
    cat: 'converter',
    icon: '🌍',
    toolType: 'converter',
    fields: [
      { k: 'time', l: 'Time (HH:MM)', type: 'text', placeholder: '09:00' },
      {
        k: 'from',
        l: 'From Time Zone',
        type: 'select',
        options: [
          { value: 'America/New_York', label: 'Eastern (ET)' },
          { value: 'America/Chicago', label: 'Central (CT)' },
          { value: 'America/Denver', label: 'Mountain (MT)' },
          { value: 'America/Los_Angeles', label: 'Pacific (PT)' },
          { value: 'America/Anchorage', label: 'Alaska (AKT)' },
          { value: 'Pacific/Honolulu', label: 'Hawaii (HT)' },
          { value: 'Europe/London', label: 'London (GMT/BST)' },
          { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
          { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
          { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
          { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
          { value: 'UTC', label: 'UTC' },
        ],
      },
    ],
    fn: (inputs) => {
      const [hStr, mStr] = inputs.time.split(':')
      const h = parseInt(hStr), m = parseInt(mStr || '0')
      if (isNaN(h) || isNaN(m)) return [{ type: 'text', label: 'Error', content: 'Enter time as HH:MM (e.g., 14:30).' }]
      const today = new Date()
      today.setHours(h, m, 0, 0)
      const zones = [
        { tz: 'America/New_York', label: 'Eastern (ET)' },
        { tz: 'America/Chicago', label: 'Central (CT)' },
        { tz: 'America/Denver', label: 'Mountain (MT)' },
        { tz: 'America/Los_Angeles', label: 'Pacific (PT)' },
        { tz: 'Europe/London', label: 'London' },
        { tz: 'Europe/Paris', label: 'Paris (CET)' },
        { tz: 'Asia/Tokyo', label: 'Tokyo (JST)' },
        { tz: 'Asia/Shanghai', label: 'Shanghai (CST)' },
        { tz: 'Australia/Sydney', label: 'Sydney (AEST)' },
        { tz: 'UTC', label: 'UTC' },
      ]
      const rows = zones.map(({ tz, label }) => ({
        label,
        value: today.toLocaleTimeString('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: true }),
      }))
      return [{ type: 'table', label: 'Time Zone Conversions', content: rows }]
    },
    about: 'The US spans 6 time zones: Eastern, Central, Mountain, Pacific, Alaska, and Hawaii. Daylight saving time shifts most states 1 hour forward in March and back in November. Arizona (except Navajo Nation) does not observe DST.',
    related: ['unix-timestamp-converter', 'date-format-converter', 'work-days-calculator'],
  },
  {
    slug: 'fuel-efficiency-converter',
    title: 'Fuel Efficiency Converter',
    desc: 'Convert MPG, L/100km, km/L, and miles per liter for vehicles.',
    cat: 'converter',
    icon: '⛽',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Value', type: 'number', placeholder: '30' },
      {
        k: 'from',
        l: 'From',
        type: 'select',
        options: [
          { value: 'mpg', label: 'MPG (US)' },
          { value: 'mpg_uk', label: 'MPG (Imperial)' },
          { value: 'l100', label: 'L/100km' },
          { value: 'kpl', label: 'km/L' },
          { value: 'mpl', label: 'Miles per Liter' },
        ],
      },
    ],
    fn: (inputs) => {
      const v = parseFloat(inputs.value)
      if (isNaN(v) || v <= 0) return [{ type: 'text', label: 'Error', content: 'Enter a positive number.' }]
      let mpg: number
      if (inputs.from === 'mpg') mpg = v
      else if (inputs.from === 'mpg_uk') mpg = v * 0.832674
      else if (inputs.from === 'l100') mpg = 235.214583 / v
      else if (inputs.from === 'kpl') mpg = v * 2.35215
      else mpg = v * 3.78541
      return [{
        type: 'table', label: 'Fuel Efficiency', content: [
          { label: 'MPG (US)', value: mpg.toFixed(2) },
          { label: 'MPG (Imperial)', value: (mpg / 0.832674).toFixed(2) },
          { label: 'L/100km', value: (235.214583 / mpg).toFixed(2) },
          { label: 'km/L', value: (mpg / 2.35215).toFixed(2) },
          { label: 'Miles per Liter', value: (mpg / 3.78541).toFixed(2) },
        ]
      }]
    },
    about: 'The US gallon is 3.785 L; the imperial gallon is 4.546 L. This means a UK car rated at 40 MPG gets roughly 33 US MPG. The EPA uses MPG for US vehicles; Europe uses L/100km, where lower numbers mean better efficiency.',
    related: ['gas-vs-electric-car-calculator', 'electric-vehicle-savings-calculator', 'speed-converter'],
  },
  {
    slug: 'cooking-measurement-converter',
    title: 'Cooking Measurement Converter',
    desc: 'Convert cups, tablespoons, teaspoons, fluid ounces, and milliliters for recipes.',
    cat: 'converter',
    icon: '🥄',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Amount', type: 'number', placeholder: '1' },
      {
        k: 'from',
        l: 'From',
        type: 'select',
        options: [
          { value: 'cup', label: 'US Cup' },
          { value: 'tbsp', label: 'Tablespoon (tbsp)' },
          { value: 'tsp', label: 'Teaspoon (tsp)' },
          { value: 'floz', label: 'Fluid Ounce (fl oz)' },
          { value: 'ml', label: 'Milliliter (mL)' },
          { value: 'l', label: 'Liter (L)' },
          { value: 'pt', label: 'Pint (pt)' },
          { value: 'qt', label: 'Quart (qt)' },
        ],
      },
    ],
    fn: (inputs) => {
      const v = parseFloat(inputs.value)
      if (isNaN(v)) return [{ type: 'text', label: 'Error', content: 'Enter a valid amount.' }]
      const toMl: Record<string, number> = { cup: 236.588, tbsp: 14.7868, tsp: 4.92892, floz: 29.5735, ml: 1, l: 1000, pt: 473.176, qt: 946.353 }
      const base = v * (toMl[inputs.from] ?? 1)
      const labels: Record<string, string> = { cup: 'US Cups', tbsp: 'Tablespoons', tsp: 'Teaspoons', floz: 'Fluid Ounces', ml: 'Milliliters', l: 'Liters', pt: 'Pints', qt: 'Quarts' }
      const rows = Object.entries(toMl).map(([u, f]) => ({ label: labels[u], value: (base / f).toFixed(3).replace(/\.?0+$/, '') }))
      return [{ type: 'table', label: 'Cooking Measurements', content: rows }]
    },
    about: '1 US cup = 16 tablespoons = 48 teaspoons = 8 fluid ounces ≈ 237 mL. UK cups are 250 mL; Australian tablespoons are 20 mL vs the US 15 mL. Always check which system a recipe uses when cooking across regions.',
    related: ['recipe-scaler', 'butter-converter', 'flour-weight-converter'],
  },
  {
    slug: 'flour-weight-converter',
    title: 'Flour Weight Converter',
    desc: 'Convert cups of flour to grams, ounces, and pounds for baking accuracy.',
    cat: 'converter',
    icon: '🌾',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Amount', type: 'number', placeholder: '2' },
      {
        k: 'from',
        l: 'From',
        type: 'select',
        options: [
          { value: 'cup', label: 'Cups (all-purpose flour)' },
          { value: 'g', label: 'Grams' },
          { value: 'oz', label: 'Ounces' },
          { value: 'lb', label: 'Pounds' },
          { value: 'tbsp', label: 'Tablespoons' },
        ],
      },
    ],
    fn: (inputs) => {
      const v = parseFloat(inputs.value)
      if (isNaN(v)) return [{ type: 'text', label: 'Error', content: 'Enter a valid amount.' }]
      // 1 cup all-purpose flour = 120g (spooned and leveled)
      const toG: Record<string, number> = { cup: 120, g: 1, oz: 28.3495, lb: 453.592, tbsp: 7.5 }
      const base = v * (toG[inputs.from] ?? 1)
      const labels: Record<string, string> = { cup: 'Cups (AP flour)', g: 'Grams', oz: 'Ounces', lb: 'Pounds', tbsp: 'Tablespoons' }
      const rows = Object.entries(toG).map(([u, f]) => ({ label: labels[u], value: (base / f).toFixed(3).replace(/\.?0+$/, '') }))
      return [{ type: 'table', label: 'Flour Measurements', content: rows }]
    },
    about: 'A scooped cup of flour weighs 140–160g; a properly spooned-and-leveled cup is 120g. This 33% difference is why weighing flour produces more consistent baking results. Professional recipes use grams for precision.',
    related: ['butter-converter', 'cooking-measurement-converter', 'recipe-scaler'],
  },
  {
    slug: 'butter-converter',
    title: 'Butter Converter',
    desc: 'Convert sticks of butter to cups, tablespoons, grams, and ounces.',
    cat: 'converter',
    icon: '🧈',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Amount', type: 'number', placeholder: '1' },
      {
        k: 'from',
        l: 'From',
        type: 'select',
        options: [
          { value: 'stick', label: 'Sticks (US)' },
          { value: 'cup', label: 'Cups' },
          { value: 'tbsp', label: 'Tablespoons' },
          { value: 'g', label: 'Grams' },
          { value: 'oz', label: 'Ounces' },
        ],
      },
    ],
    fn: (inputs) => {
      const v = parseFloat(inputs.value)
      if (isNaN(v)) return [{ type: 'text', label: 'Error', content: 'Enter a valid amount.' }]
      // 1 US stick = 113.4g = 4 oz = 8 tbsp = 1/2 cup
      const toG: Record<string, number> = { stick: 113.4, cup: 226.8, tbsp: 14.175, g: 1, oz: 28.3495 }
      const base = v * (toG[inputs.from] ?? 1)
      const labels: Record<string, string> = { stick: 'Sticks', cup: 'Cups', tbsp: 'Tablespoons', g: 'Grams', oz: 'Ounces' }
      const rows = Object.entries(toG).map(([u, f]) => ({ label: labels[u], value: (base / f).toFixed(3).replace(/\.?0+$/, '') }))
      return [{ type: 'table', label: 'Butter Measurements', content: rows }]
    },
    about: 'One US stick of butter is 1/2 cup, 8 tablespoons, or exactly 113.4 grams (4 oz). European butter is sold in 250g blocks without the stick format. Tablespoon markings on the wrapper are in increments of 1 tablespoon.',
    related: ['flour-weight-converter', 'cooking-measurement-converter', 'recipe-scaler'],
  },
  {
    slug: 'oven-temperature-converter',
    title: 'Oven Temperature Converter',
    desc: 'Convert oven temperatures between Fahrenheit, Celsius, and Gas Mark.',
    cat: 'converter',
    icon: '🔥',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Temperature', type: 'number', placeholder: '350' },
      {
        k: 'from',
        l: 'From',
        type: 'select',
        options: [
          { value: 'f', label: 'Fahrenheit (°F)' },
          { value: 'c', label: 'Celsius (°C)' },
          { value: 'gas', label: 'Gas Mark' },
        ],
      },
    ],
    fn: (inputs) => {
      const v = parseFloat(inputs.value)
      if (isNaN(v)) return [{ type: 'text', label: 'Error', content: 'Enter a valid temperature.' }]
      let f: number
      if (inputs.from === 'f') f = v
      else if (inputs.from === 'c') f = v * 9 / 5 + 32
      else f = v * 25 + 250 // approximate Gas Mark to F
      const c = (f - 32) * 5 / 9
      const gas = Math.round((f - 250) / 25)
      const desc = f < 300 ? 'Very Low' : f < 350 ? 'Low' : f < 400 ? 'Moderate' : f < 450 ? 'Hot' : 'Very Hot'
      return [{
        type: 'table', label: 'Oven Temperatures', content: [
          { label: 'Fahrenheit', value: `${Math.round(f)}°F` },
          { label: 'Celsius', value: `${Math.round(c)}°C` },
          { label: 'Gas Mark', value: Math.max(1, gas).toString() },
          { label: 'Description', value: desc },
        ]
      }]
    },
    about: 'Gas Mark is a UK/Irish oven rating system where Gas Mark 1 ≈ 275°F (140°C) and each mark increases by about 25°F. Most US recipes use Fahrenheit; European recipes use Celsius. Convection/fan ovens run 25°F (15°C) hotter.',
    related: ['temperature-converter', 'cooking-measurement-converter', 'recipe-scaler'],
  },
  {
    slug: 'bmi-unit-converter',
    title: 'BMI Unit Converter',
    desc: 'Convert height and weight between metric and imperial for BMI calculations.',
    cat: 'converter',
    icon: '📐',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Value', type: 'number', placeholder: '5.9' },
      {
        k: 'from',
        l: 'From',
        type: 'select',
        options: [
          { value: 'ft', label: 'Feet (height)' },
          { value: 'in', label: 'Inches (height)' },
          { value: 'cm', label: 'Centimeters (height)' },
          { value: 'm', label: 'Meters (height)' },
          { value: 'lb', label: 'Pounds (weight)' },
          { value: 'kg', label: 'Kilograms (weight)' },
          { value: 'st', label: 'Stone (weight)' },
        ],
      },
    ],
    fn: (inputs) => {
      const v = parseFloat(inputs.value)
      if (isNaN(v)) return [{ type: 'text', label: 'Error', content: 'Enter a valid value.' }]
      if (['ft', 'in', 'cm', 'm'].includes(inputs.from)) {
        const toM: Record<string, number> = { ft: 0.3048, in: 0.0254, cm: 0.01, m: 1 }
        const m = v * toM[inputs.from]
        return [{
          type: 'table', label: 'Height Conversions', content: [
            { label: 'Meters', value: m.toFixed(3) },
            { label: 'Centimeters', value: (m * 100).toFixed(1) },
            { label: 'Feet', value: (m / 0.3048).toFixed(2) },
            { label: 'Inches', value: (m / 0.0254).toFixed(1) },
            { label: 'Feet + Inches', value: `${Math.floor(m / 0.3048)}' ${Math.round((m / 0.3048 % 1) * 12)}"` },
          ]
        }]
      } else {
        const toKg: Record<string, number> = { lb: 0.45359237, kg: 1, st: 6.35029 }
        const kg = v * toKg[inputs.from]
        return [{
          type: 'table', label: 'Weight Conversions', content: [
            { label: 'Kilograms', value: kg.toFixed(2) },
            { label: 'Pounds', value: (kg / 0.45359237).toFixed(1) },
            { label: 'Stone', value: (kg / 6.35029).toFixed(2) },
            { label: 'Stone + Pounds', value: `${Math.floor(kg / 6.35029)} st ${Math.round((kg / 6.35029 % 1) * 14)} lb` },
          ]
        }]
      }
    },
    about: 'BMI requires height in meters and weight in kilograms for the metric formula (kg/m²), or height in inches and weight in pounds for the imperial formula (lb × 703 ÷ in²). The results are identical.',
    related: ['weight-converter', 'length-converter'],
  },
  {
    slug: 'angle-converter',
    title: 'Angle Converter',
    desc: 'Convert between degrees, radians, gradians, and turns.',
    cat: 'converter',
    icon: '📐',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Value', type: 'number', placeholder: '90' },
      {
        k: 'from',
        l: 'From',
        type: 'select',
        options: [
          { value: 'deg', label: 'Degrees (°)' },
          { value: 'rad', label: 'Radians (rad)' },
          { value: 'grad', label: 'Gradians (grad)' },
          { value: 'turn', label: 'Turns' },
          { value: 'arcmin', label: 'Arcminutes (\')' },
          { value: 'arcsec', label: 'Arcseconds (\'\')' },
        ],
      },
    ],
    fn: (inputs) => {
      const v = parseFloat(inputs.value)
      if (isNaN(v)) return [{ type: 'text', label: 'Error', content: 'Enter a valid number.' }]
      const toDeg: Record<string, number> = { deg: 1, rad: 180 / Math.PI, grad: 0.9, turn: 360, arcmin: 1 / 60, arcsec: 1 / 3600 }
      const deg = v * (toDeg[inputs.from] ?? 1)
      return [{
        type: 'table', label: 'Angle Conversions', content: [
          { label: 'Degrees', value: deg.toFixed(6).replace(/\.?0+$/, '') },
          { label: 'Radians', value: (deg / (180 / Math.PI)).toFixed(8).replace(/\.?0+$/, '') },
          { label: 'Gradians', value: (deg / 0.9).toFixed(4).replace(/\.?0+$/, '') },
          { label: 'Turns', value: (deg / 360).toFixed(6).replace(/\.?0+$/, '') },
          { label: 'Arcminutes', value: (deg * 60).toFixed(2) },
          { label: 'Arcseconds', value: (deg * 3600).toFixed(0) },
        ]
      }]
    },
    about: 'A full circle is 360°, 2π radians (~6.283), or 400 gradians. Radians are the natural unit in mathematics and physics; degrees are more intuitive in everyday use. GPS coordinates use degrees, minutes, and seconds.',
    related: ['length-converter', 'area-converter'],
  },
  {
    slug: 'frequency-converter',
    title: 'Frequency Converter',
    desc: 'Convert Hz, kHz, MHz, GHz, and RPM.',
    cat: 'converter',
    icon: '📡',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Value', type: 'number', placeholder: '1000' },
      {
        k: 'from',
        l: 'From',
        type: 'select',
        options: [
          { value: 'hz', label: 'Hertz (Hz)' },
          { value: 'khz', label: 'Kilohertz (kHz)' },
          { value: 'mhz', label: 'Megahertz (MHz)' },
          { value: 'ghz', label: 'Gigahertz (GHz)' },
          { value: 'rpm', label: 'RPM' },
          { value: 'rps', label: 'Revolutions/sec (rps)' },
        ],
      },
    ],
    fn: (inputs) => {
      const v = parseFloat(inputs.value)
      if (isNaN(v)) return [{ type: 'text', label: 'Error', content: 'Enter a valid number.' }]
      const toHz: Record<string, number> = { hz: 1, khz: 1e3, mhz: 1e6, ghz: 1e9, rpm: 1 / 60, rps: 1 }
      const base = v * (toHz[inputs.from] ?? 1)
      const labels: Record<string, string> = { hz: 'Hertz (Hz)', khz: 'Kilohertz (kHz)', mhz: 'Megahertz (MHz)', ghz: 'Gigahertz (GHz)', rpm: 'RPM', rps: 'Rev/sec' }
      const rows = Object.entries(toHz).map(([u, f]) => ({ label: labels[u], value: (base / f).toPrecision(6).replace(/\.?0+$/, '') }))
      return [{ type: 'table', label: 'Frequency Conversions', content: rows }]
    },
    about: 'Hertz (Hz) measures cycles per second. Human hearing spans roughly 20 Hz to 20,000 Hz. AM radio uses kilohertz; FM uses megahertz; Wi-Fi and CPUs operate in gigahertz ranges.',
    related: ['bitrate-converter', 'bandwidth-calculator'],
  },
  {
    slug: 'torque-converter',
    title: 'Torque Converter',
    desc: 'Convert Newton-meters, pound-feet, pound-inches, and kilogram-force meters.',
    cat: 'converter',
    icon: '🔩',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Value', type: 'number', placeholder: '100' },
      {
        k: 'from',
        l: 'From',
        type: 'select',
        options: [
          { value: 'nm', label: 'Newton-meters (N·m)' },
          { value: 'lbft', label: 'Pound-feet (lb·ft)' },
          { value: 'lbin', label: 'Pound-inches (lb·in)' },
          { value: 'kgm', label: 'Kilogram-force meters (kgf·m)' },
          { value: 'ozin', label: 'Ounce-inches (oz·in)' },
        ],
      },
    ],
    fn: (inputs) => {
      const v = parseFloat(inputs.value)
      if (isNaN(v)) return [{ type: 'text', label: 'Error', content: 'Enter a valid number.' }]
      const toNm: Record<string, number> = { nm: 1, lbft: 1.3558179483314, lbin: 0.1129848290276, kgm: 9.80665, ozin: 0.0070615518594 }
      const base = v * (toNm[inputs.from] ?? 1)
      const labels: Record<string, string> = { nm: 'Newton-meters (N·m)', lbft: 'Pound-feet (lb·ft)', lbin: 'Pound-inches (lb·in)', kgm: 'kgf·m', ozin: 'Ounce-inches (oz·in)' }
      const rows = Object.entries(toNm).map(([u, f]) => ({ label: labels[u], value: (base / f).toPrecision(6).replace(/\.?0+$/, '') }))
      return [{ type: 'table', label: 'Torque Conversions', content: rows }]
    },
    about: 'Torque is the rotational equivalent of force — the turning force applied at a distance. Engine torque is specified in lb·ft in the US and N·m in metric countries. Lug nuts typically require 80–100 lb·ft of torque.',
    related: ['force-converter', 'power-converter', 'energy-converter'],
  },
  {
    slug: 'force-converter',
    title: 'Force Converter',
    desc: 'Convert Newtons, pound-force, kilogram-force, and dynes.',
    cat: 'converter',
    icon: '💪',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Value', type: 'number', placeholder: '100' },
      {
        k: 'from',
        l: 'From',
        type: 'select',
        options: [
          { value: 'n', label: 'Newtons (N)' },
          { value: 'lbf', label: 'Pound-force (lbf)' },
          { value: 'kgf', label: 'Kilogram-force (kgf)' },
          { value: 'dyn', label: 'Dynes (dyn)' },
          { value: 'kn', label: 'Kilonewtons (kN)' },
        ],
      },
    ],
    fn: (inputs) => {
      const v = parseFloat(inputs.value)
      if (isNaN(v)) return [{ type: 'text', label: 'Error', content: 'Enter a valid number.' }]
      const toN: Record<string, number> = { n: 1, lbf: 4.4482216152605, kgf: 9.80665, dyn: 0.00001, kn: 1000 }
      const base = v * (toN[inputs.from] ?? 1)
      const labels: Record<string, string> = { n: 'Newtons (N)', lbf: 'Pound-force (lbf)', kgf: 'Kilogram-force (kgf)', dyn: 'Dynes', kn: 'Kilonewtons (kN)' }
      const rows = Object.entries(toN).map(([u, f]) => ({ label: labels[u], value: (base / f).toPrecision(6).replace(/\.?0+$/, '') }))
      return [{ type: 'table', label: 'Force Conversions', content: rows }]
    },
    about: 'One Newton is the force needed to accelerate 1 kg by 1 m/s². One pound-force is the gravitational force on a 1 lb mass at Earth\'s surface. Kilograms are often used colloquially as force units outside physics.',
    related: ['torque-converter', 'pressure-converter', 'energy-converter'],
  },
  {
    slug: 'density-converter',
    title: 'Density Converter',
    desc: 'Convert kg/m³, g/cm³, lb/ft³, and other density units.',
    cat: 'converter',
    icon: '🧱',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Value', type: 'number', placeholder: '1000' },
      {
        k: 'from',
        l: 'From',
        type: 'select',
        options: [
          { value: 'kgm3', label: 'kg/m³' },
          { value: 'gcm3', label: 'g/cm³ (g/mL)' },
          { value: 'lbft3', label: 'lb/ft³' },
          { value: 'lbin3', label: 'lb/in³' },
          { value: 'kgl', label: 'kg/L' },
        ],
      },
    ],
    fn: (inputs) => {
      const v = parseFloat(inputs.value)
      if (isNaN(v)) return [{ type: 'text', label: 'Error', content: 'Enter a valid number.' }]
      const toKgm3: Record<string, number> = { kgm3: 1, gcm3: 1000, lbft3: 16.01846337396, lbin3: 27679.904710191, kgl: 1000 }
      const base = v * (toKgm3[inputs.from] ?? 1)
      const labels: Record<string, string> = { kgm3: 'kg/m³', gcm3: 'g/cm³', lbft3: 'lb/ft³', lbin3: 'lb/in³', kgl: 'kg/L' }
      const rows = Object.entries(toKgm3).map(([u, f]) => ({ label: labels[u], value: (base / f).toPrecision(6).replace(/\.?0+$/, '') }))
      return [{ type: 'table', label: 'Density Conversions', content: rows }]
    },
    about: 'Water at 4°C has a density of exactly 1,000 kg/m³ (1 g/cm³ or 1 kg/L). Steel is ~7,800 kg/m³; aluminum ~2,700 kg/m³; gold ~19,300 kg/m³. Density determines whether an object floats or sinks in water.',
    related: ['weight-converter', 'volume-converter', 'pressure-converter'],
  },
  {
    slug: 'words-to-pages-converter',
    title: 'Words to Pages Converter',
    desc: 'Estimate how many pages a word count fills at various font sizes and spacing.',
    cat: 'converter',
    icon: '📄',
    toolType: 'converter',
    fields: [
      { k: 'words', l: 'Word Count', type: 'number', placeholder: '1000' },
      {
        k: 'size',
        l: 'Font Size',
        type: 'select',
        options: [
          { value: '10', label: '10pt' },
          { value: '11', label: '11pt' },
          { value: '12', label: '12pt (standard)' },
          { value: '14', label: '14pt' },
        ],
      },
      {
        k: 'spacing',
        l: 'Line Spacing',
        type: 'select',
        options: [
          { value: 'single', label: 'Single spaced' },
          { value: 'double', label: 'Double spaced' },
          { value: '1.5', label: '1.5 spaced' },
        ],
      },
    ],
    fn: (inputs) => {
      const words = parseFloat(inputs.words) || 0
      // Words per page estimates
      const wppBase: Record<string, number> = { '10': 600, '11': 520, '12': 450, '14': 360 }
      const wpp = (wppBase[inputs.size] ?? 450) / (inputs.spacing === 'double' ? 2 : inputs.spacing === '1.5' ? 1.5 : 1)
      const pages = words / wpp
      return [{
        type: 'table', label: 'Page Estimate', content: [
          { label: 'Pages', value: pages.toFixed(1) },
          { label: 'Words per Page', value: Math.round(wpp).toString() },
          { label: 'Reading Time', value: `${Math.ceil(words / 238)} min` },
          { label: '500-word pages', value: (words / 500).toFixed(1) },
        ]
      }]
    },
    about: 'A double-spaced, 12pt Times New Roman page holds approximately 250 words. Single-spaced holds about 500. Academic papers typically require 12pt, double-spaced. An 80,000-word novel is roughly 300 pages in standard book format.',
    related: ['reading-time-estimator', 'words-counter', 'reading-speed-converter'],
  },
  {
    slug: 'reading-speed-converter',
    title: 'Reading Speed Converter',
    desc: 'Convert between words per minute and pages, books, or articles per hour.',
    cat: 'converter',
    icon: '📖',
    toolType: 'converter',
    fields: [
      { k: 'wpm', l: 'Reading Speed (WPM)', type: 'number', placeholder: '250' },
    ],
    fn: (inputs) => {
      const wpm = parseFloat(inputs.wpm) || 250
      const pagesHr = (wpm * 60) / 250
      const booksYear = (wpm * 60 * 8 * 365) / 80000
      const newsHr = (wpm * 60) / 800
      const desc = wpm < 150 ? 'Slow (learning)' : wpm < 250 ? 'Average' : wpm < 400 ? 'Above average' : wpm < 700 ? 'Fast' : 'Speed reader'
      return [{
        type: 'table', label: 'Reading Speed Analysis', content: [
          { label: 'Words per Minute', value: wpm.toString() },
          { label: 'Category', value: desc },
          { label: 'Pages/Hour (250 wds/page)', value: pagesHr.toFixed(0) },
          { label: 'News articles/Hour (~800 wds)', value: newsHr.toFixed(1) },
          { label: 'Books/Year (8 hr/day, 80k wds)', value: booksYear.toFixed(0) },
        ]
      }]
    },
    about: 'The average adult reads 200–250 words per minute. College students average about 300 WPM. Speed readers claim 600–1,000 WPM but typically with reduced comprehension. Silent reading is 25–30% faster than reading aloud.',
    related: ['words-to-pages-converter', 'reading-time-estimator', 'words-counter'],
  },
  {
    slug: 'font-size-converter',
    title: 'Font Size Converter',
    desc: 'Convert font sizes between pt, px, em, rem, and percent.',
    cat: 'converter',
    icon: '🔡',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Size', type: 'number', placeholder: '12' },
      {
        k: 'from',
        l: 'From',
        type: 'select',
        options: [
          { value: 'pt', label: 'Points (pt)' },
          { value: 'px', label: 'Pixels (px)' },
          { value: 'em', label: 'em (base 16px)' },
          { value: 'rem', label: 'rem (base 16px)' },
          { value: 'pct', label: 'Percent (%)' },
        ],
      },
    ],
    fn: (inputs) => {
      const v = parseFloat(inputs.value)
      if (isNaN(v)) return [{ type: 'text', label: 'Error', content: 'Enter a valid number.' }]
      const toPx: Record<string, number> = { pt: 4 / 3, px: 1, em: 16, rem: 16, pct: 16 / 100 }
      const px = v * (toPx[inputs.from] ?? 1)
      return [{
        type: 'table', label: 'Font Size Conversions', content: [
          { label: 'Pixels (px)', value: `${px.toFixed(2).replace(/\.?0+$/, '')}px` },
          { label: 'Points (pt)', value: `${(px * 0.75).toFixed(2).replace(/\.?0+$/, '')}pt` },
          { label: 'em (16px base)', value: `${(px / 16).toFixed(4).replace(/\.?0+$/, '')}em` },
          { label: 'rem (16px base)', value: `${(px / 16).toFixed(4).replace(/\.?0+$/, '')}rem` },
          { label: 'Percent', value: `${(px / 16 * 100).toFixed(1)}%` },
        ]
      }]
    },
    about: '1pt = 1/72 inch = ~1.333px at 96 DPI. The browser default font size is typically 16px. Typographic convention for print is 10–12pt body text; web body text is typically 15–18px.',
    related: ['css-px-to-rem-converter', 'screen-resolution-converter'],
  },
  {
    slug: 'screen-resolution-converter',
    title: 'Screen Resolution Converter',
    desc: 'Convert screen resolutions between different scales and calculate pixel density (PPI).',
    cat: 'converter',
    icon: '🖥️',
    toolType: 'converter',
    fields: [
      { k: 'w', l: 'Width (pixels)', type: 'number', placeholder: '1920' },
      { k: 'h', l: 'Height (pixels)', type: 'number', placeholder: '1080' },
      { k: 'diag', l: 'Screen Size (inches, diagonal)', type: 'number', placeholder: '27' },
    ],
    fn: (inputs) => {
      const w = parseFloat(inputs.w) || 1920, h = parseFloat(inputs.h) || 1080, diag = parseFloat(inputs.diag) || 27
      const ppi = Math.sqrt(w * w + h * h) / diag
      const mp = (w * h / 1e6).toFixed(2)
      const ratio = (() => {
        const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a
        const g = gcd(w, h); return `${w / g}:${h / g}`
      })()
      return [{
        type: 'table', label: 'Screen Info', content: [
          { label: 'Resolution', value: `${w} × ${h}` },
          { label: 'Megapixels', value: mp },
          { label: 'Aspect Ratio', value: ratio },
          { label: 'Pixels per Inch (PPI)', value: ppi.toFixed(1) },
          { label: 'Density class', value: ppi > 220 ? 'Retina' : ppi > 150 ? 'HiDPI' : ppi > 100 ? 'Standard HD' : 'Low density' },
        ]
      }]
    },
    about: 'Apple\'s Retina displays target 220+ PPI, where individual pixels are indistinguishable at normal viewing distance. A 4K display (3840×2160) at 27" runs ~163 PPI. Smartphone screens typically reach 400–500 PPI.',
    related: ['aspect-ratio-converter', 'image-dpi-converter', 'font-size-converter'],
  },
  {
    slug: 'aspect-ratio-converter',
    title: 'Aspect Ratio Converter',
    desc: 'Calculate missing dimensions from an aspect ratio or find the nearest standard ratio.',
    cat: 'converter',
    icon: '📺',
    toolType: 'converter',
    fields: [
      { k: 'w', l: 'Width', type: 'number', placeholder: '1920' },
      { k: 'h', l: 'Height', type: 'number', placeholder: '1080' },
    ],
    fn: (inputs) => {
      const w = parseFloat(inputs.w), h = parseFloat(inputs.h)
      if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return [{ type: 'text', label: 'Error', content: 'Enter valid width and height.' }]
      const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a
      const g = gcd(Math.round(w), Math.round(h))
      const ratio = `${Math.round(w) / g}:${Math.round(h) / g}`
      const decimal = (w / h).toFixed(4)
      const common: Record<string, string> = { '16:9': '1.7778', '4:3': '1.3333', '21:9': '2.3333', '1:1': '1.0000', '3:2': '1.5000', '9:16': '0.5625' }
      const nearest = Object.entries(common).reduce((best, [name, val]) => {
        return Math.abs(parseFloat(val) - w / h) < Math.abs(parseFloat(best[1]) - w / h) ? [name, val] : best
      }, ['unknown', '0'])
      return [{
        type: 'table', label: 'Aspect Ratio', content: [
          { label: 'Exact Ratio', value: ratio },
          { label: 'Decimal', value: decimal },
          { label: 'Nearest Standard', value: nearest[0] },
          { label: 'At 1920 wide', value: `1920 × ${Math.round(1920 / (w / h))}` },
          { label: 'At 1280 wide', value: `1280 × ${Math.round(1280 / (w / h))}` },
        ]
      }]
    },
    about: '16:9 is the standard widescreen aspect ratio for HD and 4K video. 4:3 was the standard for analog TV and early computer monitors. Smartphones use 9:16 for portrait video. Anamorphic cinema uses 2.39:1.',
    related: ['screen-resolution-converter', 'image-dpi-converter'],
  },
  {
    slug: 'image-dpi-converter',
    title: 'Image DPI / PPI Converter',
    desc: 'Convert image resolution between DPI/PPI and calculate print size from pixels.',
    cat: 'converter',
    icon: '🖼️',
    toolType: 'converter',
    fields: [
      { k: 'px', l: 'Pixels (one dimension)', type: 'number', placeholder: '3000' },
      { k: 'dpi', l: 'DPI / PPI', type: 'number', placeholder: '300' },
    ],
    fn: (inputs) => {
      const px = parseFloat(inputs.px) || 3000, dpi = parseFloat(inputs.dpi) || 300
      const inchSize = px / dpi
      const cmSize = inchSize * 2.54
      const mmSize = inchSize * 25.4
      return [{
        type: 'table', label: 'Print Size', content: [
          { label: 'Inches', value: `${inchSize.toFixed(2)}"` },
          { label: 'Centimeters', value: `${cmSize.toFixed(2)} cm` },
          { label: 'Millimeters', value: `${mmSize.toFixed(1)} mm` },
          { label: 'At 72 DPI (screen)', value: `${(px / 72).toFixed(2)}"` },
          { label: 'At 150 DPI (low print)', value: `${(px / 150).toFixed(2)}"` },
          { label: 'At 300 DPI (standard)', value: `${(px / 300).toFixed(2)}"` },
        ]
      }]
    },
    about: '300 DPI is the standard for professional printing. 72 DPI is the traditional screen resolution (though modern screens vary widely). A 12 megapixel camera photo (4000×3000 px) prints cleanly at about 13×10" at 300 DPI.',
    related: ['screen-resolution-converter', 'aspect-ratio-converter'],
  },
  {
    slug: 'bitrate-converter',
    title: 'Bitrate Converter',
    desc: 'Convert between bps, Kbps, Mbps, Gbps, and bytes per second.',
    cat: 'converter',
    icon: '📶',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Value', type: 'number', placeholder: '100' },
      {
        k: 'from',
        l: 'From',
        type: 'select',
        options: [
          { value: 'bps', label: 'bps (bits/sec)' },
          { value: 'kbps', label: 'Kbps (kilobits/sec)' },
          { value: 'mbps', label: 'Mbps (megabits/sec)' },
          { value: 'gbps', label: 'Gbps (gigabits/sec)' },
          { value: 'Bps', label: 'Bytes/sec' },
          { value: 'KBps', label: 'Kilobytes/sec' },
          { value: 'MBps', label: 'Megabytes/sec' },
        ],
      },
    ],
    fn: (inputs) => {
      const v = parseFloat(inputs.value)
      if (isNaN(v)) return [{ type: 'text', label: 'Error', content: 'Enter a valid number.' }]
      const toBps: Record<string, number> = { bps: 1, kbps: 1e3, mbps: 1e6, gbps: 1e9, Bps: 8, KBps: 8000, MBps: 8e6 }
      const base = v * (toBps[inputs.from] ?? 1)
      const labels: Record<string, string> = { bps: 'bps', kbps: 'Kbps', mbps: 'Mbps', gbps: 'Gbps', Bps: 'Bytes/sec', KBps: 'KB/sec', MBps: 'MB/sec' }
      const rows = Object.entries(toBps).map(([u, f]) => ({ label: labels[u], value: (base / f).toPrecision(6).replace(/\.?0+$/, '') }))
      return [{ type: 'table', label: 'Bitrate Conversions', content: rows }]
    },
    about: 'Internet speeds are measured in Megabits per second (Mbps); file sizes in Megabytes (MB). 1 Mbps = 0.125 MB/s. A 100 Mbps connection downloads 12.5 MB per second. Netflix 4K streaming requires ~25 Mbps.',
    related: ['bandwidth-calculator', 'data-storage-converter', 'internet-speed-checker-guide'],
  },
  {
    slug: 'framerate-converter',
    title: 'Frame Rate Converter',
    desc: 'Convert between common video frame rates and calculate file sizes.',
    cat: 'converter',
    icon: '🎬',
    toolType: 'converter',
    fields: [
      { k: 'fps', l: 'Frame Rate (FPS)', type: 'number', placeholder: '30' },
      { k: 'duration', l: 'Duration (seconds)', type: 'number', placeholder: '60' },
    ],
    fn: (inputs) => {
      const fps = parseFloat(inputs.fps) || 30, dur = parseFloat(inputs.duration) || 60
      const frames = fps * dur
      const commonFps = [23.976, 24, 25, 29.97, 30, 50, 59.94, 60, 120]
      const rows: { label: string; value: string }[] = [
        { label: 'Total Frames', value: Math.round(frames).toString() },
        { label: 'Duration at 24fps', value: `${(frames / 24).toFixed(2)} sec` },
        { label: 'Duration at 30fps', value: `${(frames / 30).toFixed(2)} sec` },
        { label: 'Duration at 60fps', value: `${(frames / 60).toFixed(2)} sec` },
      ]
      commonFps.forEach(f => {
        if (Math.abs(f - fps) > 0.1) rows.push({ label: `Equivalent at ${f}fps`, value: `${(frames / f).toFixed(2)} sec` })
      })
      return [{ type: 'table', label: 'Frame Rate Info', content: rows.slice(0, 8) }]
    },
    about: '24fps is the cinematic standard, giving film its characteristic motion blur. 30fps is standard US broadcast (NTSC); 25fps for PAL (Europe). 60fps is common in gaming. 120fps and above reduce motion blur for sports and VR content.',
    related: ['screen-resolution-converter', 'bitrate-converter', 'aspect-ratio-converter'],
  },
  {
    slug: 'morse-code-converter',
    title: 'Morse Code Converter',
    desc: 'Convert text to Morse code and Morse code back to text.',
    cat: 'converter',
    icon: '📡',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Text or Morse Code', type: 'textarea', placeholder: 'Hello World or .... . .-.. .-.. ---' },
      {
        k: 'mode',
        l: 'Direction',
        type: 'select',
        options: [
          { value: 'to', label: 'Text → Morse' },
          { value: 'from', label: 'Morse → Text' },
        ],
      },
    ],
    fn: (inputs) => {
      const morseMap: Record<string, string> = { A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.', '-': '-....-', ' ': '/' }
      const reverseMap: Record<string, string> = Object.fromEntries(Object.entries(morseMap).map(([k, v]) => [v, k]))
      if (inputs.mode === 'to') {
        const morse = inputs.value.toUpperCase().split('').map(c => morseMap[c] ?? '?').join(' ')
        return [{ type: 'value', label: 'Morse Code', content: morse }]
      } else {
        const text = inputs.value.split(' / ').map(word => word.split(' ').map(sym => reverseMap[sym] ?? '?').join('')).join(' ')
        return [{ type: 'value', label: 'Decoded Text', content: text }]
      }
    },
    about: 'Morse code was developed by Samuel Morse in the 1830s for telegraph communication. SOS (···−−−···) was chosen as the international distress signal in 1906 because it was easy to send. Morse code is still used by amateur radio operators.',
    related: ['ascii-converter', 'binary-text-converter'],
  },
  {
    slug: 'shoe-size-converter',
    title: 'Shoe Size Converter',
    desc: 'Convert shoe sizes between US Men\'s, US Women\'s, UK, EU, and cm.',
    cat: 'converter',
    icon: '👟',
    toolType: 'converter',
    fields: [
      { k: 'size', l: 'Size', type: 'number', placeholder: '10' },
      {
        k: 'system',
        l: 'From System',
        type: 'select',
        options: [
          { value: 'us_m', label: 'US Men\'s' },
          { value: 'us_w', label: 'US Women\'s' },
          { value: 'uk', label: 'UK' },
          { value: 'eu', label: 'EU (European)' },
          { value: 'cm', label: 'Foot Length (cm)' },
        ],
      },
    ],
    fn: (inputs) => {
      const s = parseFloat(inputs.size)
      if (isNaN(s)) return [{ type: 'text', label: 'Error', content: 'Enter a valid size.' }]
      // Convert everything to US Men's first
      let usm: number
      if (inputs.system === 'us_m') usm = s
      else if (inputs.system === 'us_w') usm = s - 1.5
      else if (inputs.system === 'uk') usm = s + 0.5
      else if (inputs.system === 'eu') usm = (s - 31.333) / 1.333
      else usm = (s * 10 / 6.667) - 22 / 6.667 // cm approximation
      return [{
        type: 'table', label: 'Shoe Size Conversions', content: [
          { label: 'US Men\'s', value: usm.toFixed(1) },
          { label: 'US Women\'s', value: (usm + 1.5).toFixed(1) },
          { label: 'UK', value: (usm - 0.5).toFixed(1) },
          { label: 'EU', value: (usm * 1.333 + 31.333).toFixed(0) },
          { label: 'Foot Length (cm)', value: ((usm + 21.333) * 0.6667).toFixed(1) },
          { label: 'Foot Length (in)', value: ((usm + 21.333) * 0.6667 / 2.54).toFixed(2) },
        ]
      }]
    },
    about: 'Shoe sizing systems differ significantly worldwide. US Women\'s sizes run 1.5 sizes larger than Men\'s for the same foot. EU sizes use the Paris point (2/3 cm). Always check brand-specific sizing as widths and lasts vary.',
    related: ['clothing-size-converter', 'length-converter'],
  },
  {
    slug: 'clothing-size-converter',
    title: 'Clothing Size Converter',
    desc: 'Convert clothing sizes between US, UK, EU, Italian, and Asian sizing.',
    cat: 'converter',
    icon: '👕',
    toolType: 'converter',
    fields: [
      { k: 'size', l: 'US Size', type: 'number', placeholder: '8' },
      {
        k: 'gender',
        l: 'Category',
        type: 'select',
        options: [
          { value: 'women', label: 'Women\'s' },
          { value: 'men', label: 'Men\'s (shirts, chest inches)' },
        ],
      },
    ],
    fn: (inputs) => {
      const s = parseFloat(inputs.size)
      if (isNaN(s)) return [{ type: 'text', label: 'Error', content: 'Enter a valid size.' }]
      if (inputs.gender === 'women') {
        return [{
          type: 'table', label: 'Women\'s Size Conversions', content: [
            { label: 'US Size', value: s.toString() },
            { label: 'UK Size', value: (s - 4).toString() },
            { label: 'EU Size', value: (s + 28).toString() },
            { label: 'Italian Size', value: (s + 32).toString() },
            { label: 'Australian', value: (s - 4).toString() },
            { label: 'Bust (approx in)', value: `${s * 2 + 20}"` },
          ]
        }]
      } else {
        return [{
          type: 'table', label: 'Men\'s Shirt Size Conversions', content: [
            { label: 'US/UK Chest (in)', value: s.toString() },
            { label: 'EU Size', value: (s * 2.54).toFixed(0) },
            { label: 'US Label', value: s < 36 ? 'XS' : s < 38 ? 'S' : s < 40 ? 'M' : s < 42 ? 'L' : s < 44 ? 'XL' : '2XL' },
            { label: 'Asian Size', value: s < 36 ? 'M' : s < 38 ? 'L' : s < 40 ? 'XL' : s < 42 ? '2XL' : '3XL' },
          ]
        }]
      }
    },
    about: 'Women\'s US size 8 equals UK 12, EU 36, Italian 40. Men\'s sizes use chest measurement in inches (US/UK) or centimeters (EU). Asian sizing typically runs 1–2 sizes smaller than US/EU equivalents. Always check brand size charts.',
    related: ['shoe-size-converter', 'ring-size-converter'],
  },
  {
    slug: 'ring-size-converter',
    title: 'Ring Size Converter',
    desc: 'Convert ring sizes between US, UK, EU, and inner diameter in mm.',
    cat: 'converter',
    icon: '💍',
    toolType: 'converter',
    fields: [
      { k: 'size', l: 'Size or Diameter (mm)', type: 'number', placeholder: '7' },
      {
        k: 'from',
        l: 'From System',
        type: 'select',
        options: [
          { value: 'us', label: 'US / Canada' },
          { value: 'uk', label: 'UK / Australia (A–Z)' },
          { value: 'eu', label: 'EU / ISO (mm circumference)' },
          { value: 'mm', label: 'Inner Diameter (mm)' },
        ],
      },
    ],
    fn: (inputs) => {
      const s = parseFloat(inputs.size)
      if (isNaN(s)) return [{ type: 'text', label: 'Error', content: 'Enter a valid size.' }]
      // Convert to diameter mm
      let diam: number
      if (inputs.from === 'us') diam = (s * 0.8128) + 11.63
      else if (inputs.from === 'uk') {
        const ukBase = 37.83 // A = 37.83mm circumference → 12.04mm diam
        diam = (ukBase + (s - 1) * 1.27) / Math.PI
      } else if (inputs.from === 'eu') diam = s / Math.PI
      else diam = s
      const circ = diam * Math.PI
      const usSize = (diam - 11.63) / 0.8128
      return [{
        type: 'table', label: 'Ring Size Conversions', content: [
          { label: 'US / Canada', value: usSize.toFixed(1) },
          { label: 'Diameter (mm)', value: diam.toFixed(2) },
          { label: 'Circumference (mm)', value: circ.toFixed(2) },
          { label: 'EU / ISO Size', value: circ.toFixed(0) },
          { label: 'UK Alphabetic', value: String.fromCharCode(65 + Math.round((circ - 37.83) / 1.27)) },
        ]
      }]
    },
    about: 'US ring sizes are numbered 3–13 for women and men, in increments of 1/4 size. UK uses letters A–Z. EU uses inner circumference in mm. The most common women\'s size is US 6–7; men\'s is US 9–10.',
    related: ['clothing-size-converter', 'shoe-size-converter'],
  },
  {
    slug: 'wine-bottle-size-converter',
    title: 'Wine Bottle Size Converter',
    desc: 'Convert between wine bottle sizes — standard, magnum, jeroboam, and more.',
    cat: 'converter',
    icon: '🍷',
    toolType: 'converter',
    fields: [],
    staticContent: () => [{
      type: 'table', label: 'Wine Bottle Sizes', content: [
        { label: 'Split / Piccolo (187 mL)', value: '¼ bottle / ~1.5 glasses' },
        { label: 'Half / Demi (375 mL)', value: '½ bottle / ~2.5 glasses' },
        { label: 'Standard (750 mL)', value: '1 bottle / ~5 glasses' },
        { label: 'Magnum (1.5 L)', value: '2 bottles / ~10 glasses' },
        { label: 'Double Magnum / Jeroboam (3 L)', value: '4 bottles / ~20 glasses' },
        { label: 'Rehoboam (4.5 L)', value: '6 bottles / ~30 glasses' },
        { label: 'Imperial / Methuselah (6 L)', value: '8 bottles / ~40 glasses' },
        { label: 'Salmanazar (9 L)', value: '12 bottles / ~60 glasses' },
        { label: 'Balthazar (12 L)', value: '16 bottles / ~80 glasses' },
        { label: 'Nebuchadnezzar (15 L)', value: '20 bottles / ~100 glasses' },
      ]
    }],
    about: 'Larger format wine bottles age more slowly because the ratio of oxygen to wine is lower. Magnums and above are preferred for long-term cellaring. A standard pour is 5 oz (148 mL), giving approximately 5 glasses per bottle.',
    related: ['volume-converter', 'alcohol-abv-converter', 'cooking-measurement-converter'],
  },
  {
    slug: 'alcohol-abv-converter',
    title: 'Alcohol ABV / Proof Converter',
    desc: 'Convert between alcohol percentage (ABV) and proof (US and UK).',
    cat: 'converter',
    icon: '🥃',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Value', type: 'number', placeholder: '40' },
      {
        k: 'from',
        l: 'From',
        type: 'select',
        options: [
          { value: 'abv', label: 'ABV (% alcohol)' },
          { value: 'us_proof', label: 'US Proof' },
          { value: 'uk_proof', label: 'UK Proof (degrees Sikes)' },
        ],
      },
    ],
    fn: (inputs) => {
      const v = parseFloat(inputs.value)
      if (isNaN(v)) return [{ type: 'text', label: 'Error', content: 'Enter a valid value.' }]
      let abv: number
      if (inputs.from === 'abv') abv = v
      else if (inputs.from === 'us_proof') abv = v / 2
      else abv = v / 1.75 // UK proof: 100° = 57.15% ABV
      return [{
        type: 'table', label: 'Alcohol Strength', content: [
          { label: 'ABV (%)', value: `${abv.toFixed(1)}%` },
          { label: 'US Proof', value: (abv * 2).toFixed(0) },
          { label: 'UK Proof (Sikes)', value: (abv * 1.75).toFixed(1) },
          { label: 'Category', value: abv < 5 ? 'Beer/Cider' : abv < 15 ? 'Wine' : abv < 20 ? 'Fortified Wine' : abv < 40 ? 'Liqueur' : 'Spirit' },
        ]
      }]
    },
    about: 'US proof is exactly twice the ABV percentage — 80 proof vodka is 40% alcohol. UK proof, the older Sikes system, equals 57.15% ABV at 100 degrees. The EU and most countries now use ABV % exclusively.',
    related: ['volume-converter', 'wine-bottle-size-converter'],
  },
  {
    slug: 'proof-to-abv-converter',
    title: 'Proof to ABV Converter',
    desc: 'Quickly convert US proof to ABV percentage for spirits and liquors.',
    cat: 'converter',
    icon: '🍸',
    toolType: 'converter',
    fields: [
      { k: 'proof', l: 'US Proof', type: 'number', placeholder: '80' },
    ],
    fn: (inputs) => {
      const proof = parseFloat(inputs.proof)
      if (isNaN(proof)) return [{ type: 'text', label: 'Error', content: 'Enter a valid proof number.' }]
      const abv = proof / 2
      return [{
        type: 'table', label: 'Proof / ABV', content: [
          { label: 'US Proof', value: proof.toString() },
          { label: 'ABV (%)', value: `${abv.toFixed(1)}%` },
          { label: 'UK Proof', value: (abv * 1.75).toFixed(1) },
          { label: 'Per 1.5 oz shot', value: `${(1.5 * abv / 100 * 0.79 * 29.5735).toFixed(1)}g pure alcohol` },
        ]
      }]
    },
    about: 'The US proof system was standardized at twice the alcohol percentage. A 100-proof spirit is 50% ABV. Gunpowder proof — the historical method — ignited gunpowder mixed with the spirit, which required ~57% ABV.',
    related: ['alcohol-abv-converter', 'wine-bottle-size-converter'],
  },
  {
    slug: 'sugar-measurement-converter',
    title: 'Sugar Measurement Converter',
    desc: 'Convert cups of sugar to grams, ounces, and tablespoons.',
    cat: 'converter',
    icon: '🍬',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Amount', type: 'number', placeholder: '1' },
      {
        k: 'type',
        l: 'Sugar Type',
        type: 'select',
        options: [
          { value: 'white', label: 'Granulated White Sugar' },
          { value: 'brown', label: 'Brown Sugar (packed)' },
          { value: 'powdered', label: 'Powdered / Icing Sugar' },
          { value: 'caster', label: 'Caster / Superfine Sugar' },
        ],
      },
      {
        k: 'from',
        l: 'From',
        type: 'select',
        options: [
          { value: 'cup', label: 'Cups' },
          { value: 'g', label: 'Grams' },
          { value: 'oz', label: 'Ounces' },
          { value: 'tbsp', label: 'Tablespoons' },
        ],
      },
    ],
    fn: (inputs) => {
      const v = parseFloat(inputs.value)
      if (isNaN(v)) return [{ type: 'text', label: 'Error', content: 'Enter a valid amount.' }]
      const gramPerCup: Record<string, number> = { white: 200, brown: 220, powdered: 120, caster: 200 }
      const gpc = gramPerCup[inputs.type] ?? 200
      const toG: Record<string, number> = { cup: gpc, g: 1, oz: 28.3495, tbsp: gpc / 16 }
      const base = v * (toG[inputs.from] ?? 1)
      return [{
        type: 'table', label: 'Sugar Measurements', content: [
          { label: 'Grams', value: base.toFixed(1) },
          { label: 'Ounces', value: (base / 28.3495).toFixed(2) },
          { label: 'Cups', value: (base / gpc).toFixed(3) },
          { label: 'Tablespoons', value: (base / (gpc / 16)).toFixed(1) },
          { label: 'Teaspoons', value: (base / (gpc / 48)).toFixed(1) },
        ]
      }]
    },
    about: 'Granulated white sugar packs to about 200g per cup; brown sugar packs more densely at about 220g. Powdered sugar is much lighter at 120g per cup due to air. Always spoon powdered sugar into the measuring cup, never scoop.',
    related: ['flour-weight-converter', 'butter-converter', 'cooking-measurement-converter'],
  },
  {
    slug: 'illuminance-converter',
    title: 'Illuminance Converter',
    desc: 'Convert between lux, foot-candles, and lumens per square meter.',
    cat: 'converter',
    icon: '💡',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Value', type: 'number', placeholder: '500' },
      {
        k: 'from',
        l: 'From',
        type: 'select',
        options: [
          { value: 'lux', label: 'Lux (lx)' },
          { value: 'fc', label: 'Foot-candle (fc)' },
          { value: 'phot', label: 'Phot' },
        ],
      },
    ],
    fn: (inputs) => {
      const v = parseFloat(inputs.value)
      if (isNaN(v)) return [{ type: 'text', label: 'Error', content: 'Enter a valid number.' }]
      const toLux: Record<string, number> = { lux: 1, fc: 10.763910417, phot: 10000 }
      const lux = v * (toLux[inputs.from] ?? 1)
      return [{
        type: 'table', label: 'Illuminance Conversions', content: [
          { label: 'Lux (lx)', value: lux.toFixed(4).replace(/\.?0+$/, '') },
          { label: 'Foot-candles', value: (lux / 10.7639).toFixed(4).replace(/\.?0+$/, '') },
          { label: 'Context', value: lux < 50 ? 'Dim room' : lux < 300 ? 'Office task lighting' : lux < 1000 ? 'Bright office / overcast sky' : lux < 10000 ? 'Full daylight' : 'Direct sunlight (~100,000 lux)' },
        ]
      }]
    },
    about: 'Lux is lumens per square meter. Office lighting standards typically require 300–500 lux at the work surface. Direct sunlight provides about 100,000 lux; the full moon provides about 0.1 lux. A foot-candle is 1 lumen per square foot.',
    related: ['energy-converter', 'power-converter'],
  },
  {
    slug: 'magnetic-field-converter',
    title: 'Magnetic Field Strength Converter',
    desc: 'Convert between tesla, gauss, millitesla, and oersted.',
    cat: 'converter',
    icon: '🧲',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Value', type: 'number', placeholder: '1' },
      {
        k: 'from',
        l: 'From',
        type: 'select',
        options: [
          { value: 't', label: 'Tesla (T)' },
          { value: 'mt', label: 'Millitesla (mT)' },
          { value: 'ut', label: 'Microtesla (µT)' },
          { value: 'g', label: 'Gauss (G)' },
          { value: 'oe', label: 'Oersted (Oe)' },
        ],
      },
    ],
    fn: (inputs) => {
      const v = parseFloat(inputs.value)
      if (isNaN(v)) return [{ type: 'text', label: 'Error', content: 'Enter a valid number.' }]
      const toT: Record<string, number> = { t: 1, mt: 0.001, ut: 1e-6, g: 0.0001, oe: 79.5775 }
      const t = v * (toT[inputs.from] ?? 1)
      return [{
        type: 'table', label: 'Magnetic Field Conversions', content: [
          { label: 'Tesla (T)', value: t.toExponential(4) },
          { label: 'Millitesla (mT)', value: (t * 1000).toExponential(4) },
          { label: 'Microtesla (µT)', value: (t * 1e6).toExponential(4) },
          { label: 'Gauss (G)', value: (t * 10000).toExponential(4) },
          { label: 'Context', value: t < 1e-6 ? 'Earth\'s field (~50 µT)' : t < 0.1 ? 'Refrigerator magnet' : t < 3 ? 'MRI machine (1.5–3 T)' : 'Powerful research magnet' },
        ]
      }]
    },
    about: 'Earth\'s magnetic field is about 25–65 microtesla. MRI machines typically operate at 1.5 or 3 Tesla. The strongest continuous magnetic fields created by humans are around 45 Tesla. Permanent refrigerator magnets are about 1–10 millitesla.',
    related: ['energy-converter', 'frequency-converter'],
  },
  {
    slug: 'flow-rate-converter',
    title: 'Flow Rate Converter',
    desc: 'Convert volumetric flow rates between GPM, L/min, m³/s, and CFM.',
    cat: 'converter',
    icon: '💧',
    toolType: 'converter',
    fields: [
      { k: 'value', l: 'Value', type: 'number', placeholder: '10' },
      {
        k: 'from',
        l: 'From',
        type: 'select',
        options: [
          { value: 'gpm', label: 'Gallons/min (GPM)' },
          { value: 'lpm', label: 'Liters/min (L/min)' },
          { value: 'm3s', label: 'Cubic meters/sec (m³/s)' },
          { value: 'cfm', label: 'Cubic feet/min (CFM)' },
          { value: 'ls', label: 'Liters/sec (L/s)' },
        ],
      },
    ],
    fn: (inputs) => {
      const v = parseFloat(inputs.value)
      if (isNaN(v)) return [{ type: 'text', label: 'Error', content: 'Enter a valid number.' }]
      const toLpm: Record<string, number> = { gpm: 3.78541, lpm: 1, m3s: 60000, cfm: 28.31685, ls: 60 }
      const lpm = v * (toLpm[inputs.from] ?? 1)
      const labels: Record<string, string> = { gpm: 'Gallons/min (GPM)', lpm: 'Liters/min (L/min)', m3s: 'Cubic meters/sec (m³/s)', cfm: 'Cubic feet/min (CFM)', ls: 'Liters/sec (L/s)' }
      const rows = Object.entries(toLpm).map(([u, f]) => ({ label: labels[u], value: (lpm / f).toPrecision(5).replace(/\.?0+$/, '') }))
      return [{ type: 'table', label: 'Flow Rate Conversions', content: rows }]
    },
    about: 'The average US shower uses 2 gallons per minute (7.6 L/min); older showerheads use up to 5 GPM. HVAC systems measure airflow in CFM. Municipal water mains typically flow at thousands of GPM.',
    related: ['volume-converter', 'water-usage-calculator', 'pressure-converter'],
  },
]
