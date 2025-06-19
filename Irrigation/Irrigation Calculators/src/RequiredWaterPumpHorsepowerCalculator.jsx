import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import BackButton from './BackButton';

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

const RequiredWaterPumpHorsepowerCalculator = () => {
  const [inputs, setInputs] = useState({
    pressure: '',
    pressureUnit: pressureUnits[0].label,
    flow: '',
    flowUnit: flowUnits[0].label,
    pumpEff: '',
    pumpEffUnit: efficiencyUnits[0].label,
    motorEff: '',
    motorEffUnit: efficiencyUnits[0].label,
    outputUnit: powerUnits[0].label
  });

  const [results, setResults] = useState({
    bhp: null,
    totalPower: null,
    bhpKW: null,
    totalPowerKW: null
  });

  const handleNumberInputChange = (field) => (event) => {
    const value = event.target.value;
    setInputs(prev => ({
      ...prev,
      [field]: Number(value)
    }));
  };

  const handleInputChange = (field) => (event) => {
    setInputs(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  useEffect(() => {
    calculatePower();
  }, [inputs]);

  const calculatePower = () => {
    const { pressure, flow, pumpEff, motorEff } = inputs;
    
    if (!pressure || !flow || !pumpEff || !motorEff || Number(pumpEff) === 0 || Number(motorEff) === 0) {
      setResults({
        bhp: null,
        totalPower: null,
        bhpKW: null,
        totalPowerKW: null
      });
      return;
    }

    // Get selected units
    const pU = pressureUnits.find(u => u.label === inputs.pressureUnit);
    const fU = flowUnits.find(u => u.label === inputs.flowUnit);
    const pumpE = parseFloat(pumpEff) * efficiencyUnits.find(u => u.label === inputs.pumpEffUnit).toDecimal;
    const motorE = parseFloat(motorEff) * efficiencyUnits.find(u => u.label === inputs.motorEffUnit).toDecimal;

    // US units: psi + gpm
    const isUS = inputs.pressureUnit === 'psi' && inputs.flowUnit === 'gpm';
    
    let bhpVal, totalPowerVal, bhpKWVal, totalPowerKWVal;

    if (isUS) {
      const P = parseFloat(pressure) * pU.toPsi;
      const Q = parseFloat(flow) * fU.toGpm;
      bhpVal = (Q * P) / (3960 * pumpE);
      totalPowerVal = bhpVal / motorE;
      bhpKWVal = bhpVal * 0.7457;
      totalPowerKWVal = totalPowerVal * 0.7457;
    } else {
      // Metric formula: kW = (Q × H) / (367 × PumpEff)
      // Q in lps, H in meters
      const H = parseFloat(pressure) * pU.toMeter;
      const Q = parseFloat(flow) * fU.toLps;
      bhpKWVal = (Q * H) / (367 * pumpE);
      totalPowerKWVal = bhpKWVal / motorE;
      bhpVal = bhpKWVal / 0.7457;
      totalPowerVal = totalPowerKWVal / 0.7457;
    }

    setResults({
      bhp: bhpVal,
      totalPower: totalPowerVal,
      bhpKW: bhpKWVal,
      totalPowerKW: totalPowerKWVal
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <BackButton />
      <Typography gutterBottom sx={fontTitle} align="center">
        Required Water Pump Horsepower
      </Typography>
      <Typography gutterBottom sx={{ ...fontText, mb: 4 }} align="center">
        Estimate the brake horsepower and total power requirements of the electric motor used to power an irrigation water pump.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Pressure"
              type="number"
              value={inputs.pressure}
              onChange={handleNumberInputChange('pressure')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Pressure Unit</InputLabel>
            <Select
              value={inputs.pressureUnit}
              label="Pressure Unit"
              onChange={handleInputChange('pressureUnit')}
            >
              {pressureUnits.map((u) => (
                <MenuItem key={u.label} value={u.label}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Flow Rate"
              type="number"
              value={inputs.flow}
              onChange={handleNumberInputChange('flow')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Flow Rate Unit</InputLabel>
            <Select
              value={inputs.flowUnit}
              label="Flow Rate Unit"
              onChange={handleInputChange('flowUnit')}
            >
              {flowUnits.map((u) => (
                <MenuItem key={u.label} value={u.label}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Pump Efficiency"
              type="number"
              value={inputs.pumpEff}
              onChange={handleNumberInputChange('pumpEff')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Pump Efficiency Unit</InputLabel>
            <Select
              value={inputs.pumpEffUnit}
              label="Pump Efficiency Unit"
              onChange={handleInputChange('pumpEffUnit')}
            >
              {efficiencyUnits.map((u) => (
                <MenuItem key={u.label} value={u.label}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Drive Motor Efficiency"
              type="number"
              value={inputs.motorEff}
              onChange={handleNumberInputChange('motorEff')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Motor Efficiency Unit</InputLabel>
            <Select
              value={inputs.motorEffUnit}
              label="Motor Efficiency Unit"
              onChange={handleInputChange('motorEffUnit')}
            >
              {efficiencyUnits.map((u) => (
                <MenuItem key={u.label} value={u.label}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Results below input fields */}
      {results.bhp !== null && (
        <Box sx={{ mt: 6, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          {/* Brake Horsepower Result */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography sx={{ ...fontSection, mb: 1 }} align="center">
              Brake Horsepower:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3, bgcolor: '#f5f5f5', borderRadius: 2, minWidth: 250, textAlign: 'center' }}>
              <Typography sx={{ ...fontFormula, fontSize: 28, mb: 0 }}>
                {results.bhp.toFixed(2)}
              </Typography>
              <Typography sx={{ fontSize: 18, fontWeight: 600, color: '#8cb43a' }}>
                HP
              </Typography>
            </Box>
            <Typography sx={{ mt: 1, fontSize: 16, color: '#666' }}>
              {results.bhpKW.toFixed(2)} kW
            </Typography>
          </Box>

          {/* Total Power Result */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography sx={{ ...fontSection, mb: 1 }} align="center">
              Total Power Requirements:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3, bgcolor: '#f5f5f5', borderRadius: 2, minWidth: 250, textAlign: 'center' }}>
              <Typography sx={{ ...fontFormula, fontSize: 28, mb: 0 }}>
                {results.totalPower.toFixed(2)}
              </Typography>
              <Typography sx={{ fontSize: 18, fontWeight: 600, color: '#8cb43a' }}>
                HP
              </Typography>
            </Box>
            <Typography sx={{ mt: 1, fontSize: 16, color: '#666' }}>
              {results.totalPowerKW.toFixed(2)} kW
            </Typography>
          </Box>
        </Box>
      )}

      {/* Formulas centered, below results */}
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography sx={{ ...fontSection, mb: 1 }} align="center">
          Formulas:
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{ ...fontFormula, fontSize: 20 }}>
            BHP = (Q × P) / (3960 × Pump Efficiency)
          </Box>
          <Box sx={{ ...fontFormula, fontSize: 20 }}>
            kW = (Q × H) / (367 × Pump Efficiency)
          </Box>
          <Box sx={{ ...fontFormula, fontSize: 20 }}>
            Motor HP = BHP / Motor Efficiency
          </Box>
          <Box sx={{ ...fontFormula, fontSize: 20 }}>
            Motor kW = kW / Motor Efficiency
          </Box>
        </Box>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 1 }}>
            Where:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ fontSize: 16 }}>
              <b>Q</b> = Flow Rate (GPM or L/s)
            </Typography>
            <Typography sx={{ fontSize: 16 }}>
              <b>P</b> = Pressure (psi)
            </Typography>
            <Typography sx={{ fontSize: 16 }}>
              <b>H</b> = Head (meters)
            </Typography>
            <Typography sx={{ fontSize: 16 }}>
              <b>Pump Efficiency</b> = as a decimal (e.g., 70% = 0.7)
            </Typography>
            <Typography sx={{ fontSize: 16 }}>
              <b>Motor Efficiency</b> = as a decimal (e.g., 90% = 0.9)
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default RequiredWaterPumpHorsepowerCalculator; 