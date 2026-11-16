export interface BilingualText { en: string; hi: string }

export interface Part {
  id: string; x: number; y: number; zone: string;
  name: BilingualText; role: BilingualText;
  failure: BilingualText; civil: BilingualText; specs: BilingualText;
}

export interface Step {
  id: number; key: string;
  badge: BilingualText; title: BilingualText; shortLabel: BilingualText;
  simple: BilingualText; technical: BilingualText;
  diagramHighlight: string; sourceTag: BilingualText;
}

export interface SequenceCycle {
  id: string; color: string;
  label: BilingualText; status: BilingualText; detail: BilingualText;
}

export interface ComparisonRow {
  id: string; criteria: BilingualText;
  truck: BilingualText; avwcs: BilingualText;
  winner: 'truck' | 'avwcs' | 'longterm';
  note?: BilingualText;
}

export interface ComparisonBar {
  id: string; label: BilingualText;
  truckScore: number; avwcsScore: number;
}

export interface FAQ {
  id: string; category: string;
  q: BilingualText; a: BilingualText;
}

export interface PilotPhase {
  step: number; duration: BilingualText;
  title: BilingualText; desc: BilingualText;
}

export interface DeliveryModel {
  model: BilingualText; whoFunds: BilingualText;
  pros: BilingualText; cons: BilingualText;
}

export interface KPI { metric: BilingualText; target: BilingualText }
export interface Risk { risk: BilingualText; mitigation: BilingualText }
export interface Policy { title: BilingualText; detail: BilingualText }

export interface TeamMember {
  role: BilingualText; name: BilingualText; focus: BilingualText;
}

export interface SimInputs {
  population: number;
  wastePerPersonKg: number;
  organicPct: number;
  recyclePct: number;
  residualPct: number;
  pipelineLengthKm: number;
  personsPerInlet: number;
  currentTruckTripsPerDay: number;
  electricityRateRs: number;
  containerCapacityTonne: number;
  renewablePct: number;
  operatingDaysPerYear: number;
}

export interface SimOutputs {
  dailyWasteKg: number;
  dailyWasteTonne: number;
  annualWasteTonne: number;
  organicTonne: number;
  recycleTonne: number;
  residualTonne: number;
  numInlets: number;
  terminalTruckTrips: number;
  trucksRemoved: number;
  electricityKwhMin: number;
  electricityKwhMax: number;
  annualElectricityKwhMin: number;
  annualElectricityKwhMax: number;
  electricityCostRsMin: number;
  electricityCostRsMax: number;
  annualElectricityCostRsMin: number;
  annualElectricityCostRsMax: number;
  capitalCostCrMin: number;
  capitalCostCrMax: number;
  dieselSavedLitresMin: number;
  dieselSavedLitresMax: number;
  netEnergyBalanceLabel: string;
  renewableAdjustedKwh: number;
}

export interface InletStatus {
  id: string; label: string; zone: string;
  fillPct: number; valveOpen: boolean; type: 'organic' | 'recyclable' | 'residual';
}

export interface TerminalStatus {
  vacuumKpa: number; exhaustersOn: boolean;
  organicContainerPct: number; recyclableContainerPct: number; residualContainerPct: number;
}

export interface Alert {
  id: string; time: string; message: string; severity: 'info' | 'warning';
}

export interface DashboardState {
  inlets: InletStatus[]; terminal: TerminalStatus;
  alerts: Alert[]; todayTotalTonne: number; todayCycles: number;
}
