import type { SimInputs, SimOutputs } from './types'

// === CONSTANTS (each documented with source) ===
// kWh/tonne: published life-cycle benchmark for pneumatic waste transport
const KWH_PER_TONNE_MIN = 80  // Literature: lower bound
const KWH_PER_TONNE_MAX = 120 // Literature: upper bound

// Diesel: typical 7-tonne compactor ~0.35 L/km (industry assumption)
const DIESEL_L_PER_KM = 0.35

// Average round-trip distance for a street truck (assumption: 15 km)
const AVG_TRUCK_ROUND_TRIP_KM = 15

// Pipeline cost per metre (civil + steel + installation, literature range)
const PIPELINE_COST_RS_PER_M_MIN = 25000
const PIPELINE_COST_RS_PER_M_MAX = 60000

// Terminal base cost (assumption: small-medium terminal)
const TERMINAL_COST_CR_MIN = 3
const TERMINAL_COST_CR_MAX = 8

// Inlet cost each (inlet + chute + valve + sensor + civil, assumption)
const INLET_COST_RS_MIN = 200000
const INLET_COST_RS_MAX = 400000

const clamp = (val: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Number.isFinite(val) ? val : min))

export function calculate(inputs: SimInputs): SimOutputs {
  const population = Math.max(0, Number.isFinite(inputs.population) ? inputs.population : 0)
  const wastePerPersonKg = Math.max(0, Number.isFinite(inputs.wastePerPersonKg) ? inputs.wastePerPersonKg : 0)
  const organicPct = clamp(inputs.organicPct, 0, 100)
  const recyclePct = clamp(inputs.recyclePct, 0, 100 - organicPct)
  const residualPct = 100 - organicPct - recyclePct
  const pipelineLengthKm = Math.max(0, Number.isFinite(inputs.pipelineLengthKm) ? inputs.pipelineLengthKm : 0)
  const personsPerInlet = Math.max(1, Number.isFinite(inputs.personsPerInlet) ? inputs.personsPerInlet : 1)
  const currentTruckTripsPerDay = Math.max(0, Number.isFinite(inputs.currentTruckTripsPerDay) ? inputs.currentTruckTripsPerDay : 0)
  const electricityRateRs = Math.max(0, Number.isFinite(inputs.electricityRateRs) ? inputs.electricityRateRs : 0)
  const containerCapacityTonne = Math.max(0.1, Number.isFinite(inputs.containerCapacityTonne) ? inputs.containerCapacityTonne : 0.1)
  const renewablePct = clamp(inputs.renewablePct, 0, 100)
  const operatingDaysPerYear = clamp(Math.round(inputs.operatingDaysPerYear ?? 365), 1, 366)

  const dailyWasteKg = population * wastePerPersonKg
  const dailyWasteTonne = dailyWasteKg / 1000
  const annualWasteTonne = dailyWasteTonne * operatingDaysPerYear
  const organicTonne = dailyWasteTonne * (organicPct / 100)
  const recycleTonne = dailyWasteTonne * (recyclePct / 100)
  const residualTonne = dailyWasteTonne * (residualPct / 100)

  const numInlets = Math.ceil(population / personsPerInlet)
  const terminalTruckTrips = Math.ceil(dailyWasteTonne / containerCapacityTonne)
  const trucksRemoved = Math.max(0, currentTruckTripsPerDay - terminalTruckTrips)

  const electricityKwhMin = dailyWasteTonne * KWH_PER_TONNE_MIN
  const electricityKwhMax = dailyWasteTonne * KWH_PER_TONNE_MAX
  const annualElectricityKwhMin = electricityKwhMin * operatingDaysPerYear
  const annualElectricityKwhMax = electricityKwhMax * operatingDaysPerYear
  const electricityCostRsMin = electricityKwhMin * electricityRateRs
  const electricityCostRsMax = electricityKwhMax * electricityRateRs
  const annualElectricityCostRsMin = electricityCostRsMin * operatingDaysPerYear
  const annualElectricityCostRsMax = electricityCostRsMax * operatingDaysPerYear

  const pipelineCostRsMin = pipelineLengthKm * 1000 * PIPELINE_COST_RS_PER_M_MIN
  const pipelineCostRsMax = pipelineLengthKm * 1000 * PIPELINE_COST_RS_PER_M_MAX
  const inletCostRsMin = numInlets * INLET_COST_RS_MIN
  const inletCostRsMax = numInlets * INLET_COST_RS_MAX
  const capitalCostCrMin = (pipelineCostRsMin + inletCostRsMin) / 1e7 + TERMINAL_COST_CR_MIN
  const capitalCostCrMax = (pipelineCostRsMax + inletCostRsMax) / 1e7 + TERMINAL_COST_CR_MAX

  const dieselSavedLitresMin = trucksRemoved * AVG_TRUCK_ROUND_TRIP_KM * DIESEL_L_PER_KM * 0.8
  const dieselSavedLitresMax = trucksRemoved * AVG_TRUCK_ROUND_TRIP_KM * DIESEL_L_PER_KM * 1.2

  const renewableAdjustedKwh = electricityKwhMax * (1 - renewablePct / 100)

  const netEnergyBalanceLabel = renewableAdjustedKwh < electricityKwhMax * 0.4
    ? 'Sustainable' : renewableAdjustedKwh < electricityKwhMax * 0.75
    ? 'Marginal' : 'Grid-dependent'

  return {
    dailyWasteKg, dailyWasteTonne, annualWasteTonne,
    organicTonne, recycleTonne, residualTonne,
    numInlets, terminalTruckTrips, trucksRemoved,
    electricityKwhMin, electricityKwhMax,
    annualElectricityKwhMin, annualElectricityKwhMax,
    electricityCostRsMin, electricityCostRsMax,
    annualElectricityCostRsMin, annualElectricityCostRsMax,
    capitalCostCrMin, capitalCostCrMax,
    dieselSavedLitresMin, dieselSavedLitresMax,
    netEnergyBalanceLabel, renewableAdjustedKwh,
  }
}

export const DEFAULT_INPUTS: SimInputs = {
  population: 10000,
  wastePerPersonKg: 0.45,
  organicPct: 50, recyclePct: 30, residualPct: 20,
  pipelineLengthKm: 2,
  personsPerInlet: 50,
  currentTruckTripsPerDay: 20,
  electricityRateRs: 7,
  containerCapacityTonne: 5,
  renewablePct: 30,
  operatingDaysPerYear: 365,
}
