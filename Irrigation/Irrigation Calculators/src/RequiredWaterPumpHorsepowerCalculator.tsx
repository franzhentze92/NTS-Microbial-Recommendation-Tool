import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, MenuItem, Grid, Divider } from '@mui/material';

const pressureUnits = [
  { label: 'psi', toPsi: 1, toMeter: 0.70307 },
  { label: 'kPa', toPsi: 0.145038, toMeter: 0.10197 },
  { label: 'feet of water', toPsi: 0.433527, toMeter: 0.3048 },
  { label: 'm of water', toPsi: 1.42233, toMeter: 1 },
  { label: 'bar', toPsi: 14.5038, toMeter: 10 },
];

const flowUnits = [
  { label: 'gpm', toGpm: 1, toLps: 0.06309 },
  { label: 'cfs', toGpm: 448.831, toLps: 28.3168 },
  { label: 'acre-in/day', toGpm: 18.857, toLps: 1.191 },
  { label: 'acre-in/hour', toGpm: 452.57, toLps: 28.57 },
  { label: 'acre-ft/day', toGpm: 226.6, toLps: 14.32 },
  { label: 'lps', toGpm: 15.8503, toLps: 1 },
  { label: 'lpm', toGpm: 0.264172, toLps: 0.01667 },
  { label: 'cms', toGpm: 15850.3, toLps: 1000 },
  { label: 'cu. m/hr', toGpm: 4.40287, toLps: 0.27778 },
];

const efficiencyUnits = [
  { label: '%', toDecimal: 0.01 },
  { label: 'decimal', toDecimal: 1 },
];

const powerUnits = [
  { label: 'HP', factor: 1 },
  { label: 'kW', factor: 0.7457 },
];

const fontTitle = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 700, fontSize: 32, color: '#222' };
const fontSection = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 600, fontSize: 20, color: '#8cb43a' };
const fontFormula = { fontFamily: 'monospace', fontWeight: 600, fontSize: 20, background: '#f5f5f5', p: 2, borderRadius: 2, display: 'inline-block' };
const fontText = { fontFamily: 'Roboto, Arial, sans-serif', fontSize: 16, color: '#222' };
const fontVar = { fontWeight: 700, color: '#8cb43a' };

const RequiredWaterPumpHorsepowerCalculator: React.FC = () => {
  const [pressure, setPressure] = useState('');
  const [pressureUnit, setPressureUnit] = useState(pressureUnits[0].label);
  const [flow, setFlow] = useState('');
  const [flowUnit, setFlowUnit] = useState(flowUnits[0].label);
  const [pumpEff, setPumpEff] = useState('');
  const [pumpEffUnit, setPumpEffUnit] = useState(efficiencyUnits[0].label);
  const [motorEff, setMotorEff] = useState('');
  const [motorEffUnit, setMotorEffUnit] = useState(efficiencyUnits[0].label);
  const [outputUnit, setOutputUnit] = useState(powerUnits[0].label);

  let bhp = '';
  let totalPower = '';
  let bhpKW = '';
  let totalPowerKW = '';
  const valid = pressure && flow && pumpEff && motorEff && Number(pumpEff) !== 0 && Number(motorEff) !== 0;
  if (valid) {
    // Get selected units
    const pU = pressureUnits.find(u => u.label === pressureUnit)!;
    const fU = flowUnits.find(u => u.label === flowUnit)!;
    const pumpE = parseFloat(pumpEff) * efficiencyUnits.find(u => u.label === pumpEffUnit)!.toDecimal;
    const motorE = parseFloat(motorEff) * efficiencyUnits.find(u => u.label === motorEffUnit)!.toDecimal;
    // US units: psi + gpm
    const isUS = pressureUnit === 'psi' && flowUnit === 'gpm';
    // Metric: any metric unit
    if (isUS) {
      const P = parseFloat(pressure) * pU.toPsi;
      const Q = parseFloat(flow) * fU.toGpm;
      const bhpVal = (Q * P) / (3960 * pumpE);
      const totalPowerVal = bhpVal / motorE;
      bhp = bhpVal.toFixed(4).replace(/\.?0+$/, '');
      totalPower = totalPowerVal.toFixed(4).replace(/\.?0+$/, '');
      bhpKW = (bhpVal * 0.7457).toFixed(4).replace(/\.?0+$/, '');
      totalPowerKW = (totalPowerVal * 0.7457).toFixed(4).replace(/\.?0+$/, '');
    } else {
      // Metric formula: kW = (Q × H) / (367 × PumpEff)
      // Q in lps, H in meters
      const H = parseFloat(pressure) * pU.toMeter;
      const Q = parseFloat(flow) * fU.toLps;
      const kW = (Q * H) / (367 * pumpE);
      const totalKW = kW / motorE;
      bhpKW = kW.toFixed(4).replace(/\.?0+$/, '');
      totalPowerKW = totalKW.toFixed(4).replace(/\.?0+$/, '');
      bhp = (kW / 0.7457).toFixed(4).replace(/\.?0+$/, '');
      totalPower = (totalKW / 0.7457).toFixed(4).replace(/\.?0+$/, '');
    }
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography gutterBottom sx={fontTitle}>
        Required Water Pump Horsepower Calculator
      </Typography>
      <Typography gutterBottom sx={fontText}>
        Use this form to estimate the brake horsepower and total power (hp) requirements of the electric motor used to power an irrigation water pump.
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Pressure"
              value={pressure}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPressure(e.target.value)}
              type="number"
              fullWidth
              inputProps={{ min: 0 }}
              sx={{ mb: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Pressure Unit"
              value={pressureUnit}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPressureUnit(e.target.value)}
              fullWidth
            >
              {pressureUnits.map(u => (
                <MenuItem key={u.label} value={u.label}>{u.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Flow Rate"
              value={flow}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFlow(e.target.value)}
              type="number"
              fullWidth
              inputProps={{ min: 0 }}
              sx={{ mb: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Flow Rate Unit"
              value={flowUnit}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFlowUnit(e.target.value)}
              fullWidth
            >
              {flowUnits.map(u => (
                <MenuItem key={u.label} value={u.label}>{u.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Pump Efficiency"
              value={pumpEff}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPumpEff(e.target.value)}
              type="number"
              fullWidth
              inputProps={{ min: 0, max: 100 }}
              sx={{ mb: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Pump Efficiency Unit"
              value={pumpEffUnit}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPumpEffUnit(e.target.value)}
              fullWidth
            >
              {efficiencyUnits.map(u => (
                <MenuItem key={u.label} value={u.label}>{u.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Drive Motor Efficiency"
              value={motorEff}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMotorEff(e.target.value)}
              type="number"
              fullWidth
              inputProps={{ min: 0, max: 100 }}
              sx={{ mb: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Motor Efficiency Unit"
              value={motorEffUnit}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMotorEffUnit(e.target.value)}
              fullWidth
            >
              {efficiencyUnits.map(u => (
                <MenuItem key={u.label} value={u.label}>{u.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Output Unit"
              value={outputUnit}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOutputUnit(e.target.value)}
              fullWidth
            >
              {powerUnits.map(u => (
                <MenuItem key={u.label} value={u.label}>{u.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={fontSection}>Brake Horsepower:</Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: 24 }}>
            {bhp ? `${bhp} HP` : '--'} &nbsp;|&nbsp; {bhpKW ? `${bhpKW} kW` : '--'}
          </Typography>
          <Typography variant="h6" sx={{ mt: 3, ...fontSection }}>Total Power Requirements:</Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: 24 }}>
            {totalPower ? `${totalPower} HP` : '--'} &nbsp;|&nbsp; {totalPowerKW ? `${totalPowerKW} kW` : '--'}
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 4 }} />
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography sx={fontSection} gutterBottom>The Equation</Typography>
        <Typography sx={fontText} gutterBottom>
          This calculator uses these formulas to estimate the brake horsepower and total power requirements of the electric motor used to power an irrigation water pump.
        </Typography>
        <Box sx={{ my: 2 }}>
          <Box sx={fontFormula}>
            BHP = (Q × P) / (3960 × Pump Efficiency)
          </Box>
        </Box>
        <Box sx={{ my: 2 }}>
          <Box sx={fontFormula}>
            kW = (Q × H) / (367 × Pump Efficiency)
          </Box>
        </Box>
        <Box sx={{ my: 2 }}>
          <Box sx={fontFormula}>
            Motor HP = BHP / Motor Efficiency
          </Box>
        </Box>
        <Box sx={{ my: 2 }}>
          <Box sx={fontFormula}>
            Motor kW = kW / Motor Efficiency
          </Box>
        </Box>
        <Typography sx={{ mb: 1, ...fontText }}>Where:</Typography>
        <Box sx={{ textAlign: 'left', display: 'inline-block', mb: 2 }}>
          <Typography sx={fontText}><Box component="span" sx={fontVar}>Q</Box> = Flow Rate (GPM or L/s)</Typography>
          <Typography sx={fontText}><Box component="span" sx={fontVar}>P</Box> = Pressure (psi)</Typography>
          <Typography sx={fontText}><Box component="span" sx={fontVar}>H</Box> = Head (meters)</Typography>
          <Typography sx={fontText}><Box component="span" sx={fontVar}>Pump Efficiency</Box> = as a decimal (e.g., 70% = 0.7)</Typography>
          <Typography sx={fontText}><Box component="span" sx={fontVar}>Motor Efficiency</Box> = as a decimal (e.g., 90% = 0.9)</Typography>
        </Box>
        <Typography sx={{ fontSize: 14, color: '#8cb43a', fontWeight: 600, letterSpacing: 1, mt: 2 }}>
          {/* Reference: Washington State University */}
        </Typography>
      </Box>
    </Paper>
  );
};

export default RequiredWaterPumpHorsepowerCalculator; 