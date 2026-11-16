import type { DashboardState, InletStatus } from './types'

export function createInitialDashboardState(): DashboardState {
  const inlets: InletStatus[] = []
  const zones = ['Block A', 'Block B', 'Block C', 'Block D']
  const types: Array<'organic' | 'recyclable' | 'residual'> = ['organic', 'recyclable', 'residual']
  let id = 1
  for (const zone of zones) {
    for (const type of types) {
      inlets.push({
        id: `I${String(id++).padStart(2, '0')}`,
        label: `${zone} · ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        zone,
        fillPct: Math.floor(Math.random() * 46) + 35, // 35–80%
        valveOpen: false,
        type,
      })
    }
  }

  // Ensure at least one inlet starts close to the 88% trigger so a suction cycle begins within ~5–10s
  if (Math.max(...inlets.map(i => i.fillPct)) < 78) {
    const idx = Math.floor(Math.random() * inlets.length)
    inlets[idx] = { ...inlets[idx], fillPct: 79 + Math.floor(Math.random() * 2) }
  }

  return {
    inlets,
    terminal: { vacuumKpa: 0, exhaustersOn: false, organicContainerPct: 20, recyclableContainerPct: 15, residualContainerPct: 10 },
    alerts: [{ id: 'a0', time: '00:00', message: 'DEMO system initialised. All valves closed.', severity: 'info' }],
    todayTotalTonne: 0.8,
    todayCycles: 3,
  }
}

export function tickDashboard(prev: DashboardState): DashboardState {
  const inlets = prev.inlets.map(inlet => {
    if (inlet.valveOpen) {
      const newFill = Math.max(0, inlet.fillPct - 22)
      return { ...inlet, fillPct: newFill, valveOpen: newFill > 0 }
    }
    const increase = Math.floor(Math.random() * 5) + 1
    return { ...inlet, fillPct: Math.min(100, inlet.fillPct + increase) }
  })

  const newAlerts: Array<DashboardState['alerts'][0]> = []
  const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

  const updatedInlets = inlets.map(inlet => {
    if (inlet.fillPct >= 88 && !inlet.valveOpen) {
      newAlerts.push({
        id: `a${Date.now()}-${inlet.id}`,
        time: nowTime,
        message: `Inlet ${inlet.id} (${inlet.zone}) reached ${inlet.fillPct}% — suction cycle triggered.`,
        severity: 'warning' as const,
      })
      return { ...inlet, valveOpen: true }
    }
    return inlet
  })

  const anyOpen = updatedInlets.some(i => i.valveOpen)

  let organicContainerPct = prev.terminal.organicContainerPct + (anyOpen ? 0.4 : 0)
  let recyclableContainerPct = prev.terminal.recyclableContainerPct + (anyOpen ? 0.25 : 0)
  let residualContainerPct = prev.terminal.residualContainerPct + (anyOpen ? 0.15 : 0)

  if (organicContainerPct >= 90) {
    organicContainerPct = 15
    newAlerts.push({
      id: `a${Date.now()}-pickup-organic`,
      time: nowTime,
      message: 'Hook-lift truck pickup simulated — Organic container emptied.',
      severity: 'info',
    })
  }
  if (recyclableContainerPct >= 90) {
    recyclableContainerPct = 15
    newAlerts.push({
      id: `a${Date.now()}-pickup-recyclable`,
      time: nowTime,
      message: 'Hook-lift truck pickup simulated — Recyclable container emptied.',
      severity: 'info',
    })
  }
  if (residualContainerPct >= 90) {
    residualContainerPct = 15
    newAlerts.push({
      id: `a${Date.now()}-pickup-residual`,
      time: nowTime,
      message: 'Hook-lift truck pickup simulated — Residual container emptied.',
      severity: 'info',
    })
  }

  const terminal = {
    ...prev.terminal,
    exhaustersOn: anyOpen,
    vacuumKpa: anyOpen ? -(40 + Math.floor(Math.random() * 25)) : -Math.floor(Math.random() * 3),
    organicContainerPct,
    recyclableContainerPct,
    residualContainerPct,
  }

  return {
    ...prev,
    inlets: updatedInlets,
    terminal,
    alerts: [...newAlerts, ...prev.alerts].slice(0, 20),
    todayTotalTonne: anyOpen ? parseFloat((prev.todayTotalTonne + 0.025).toFixed(2)) : prev.todayTotalTonne,
    todayCycles: anyOpen ? prev.todayCycles + 1 : prev.todayCycles,
  }
}
