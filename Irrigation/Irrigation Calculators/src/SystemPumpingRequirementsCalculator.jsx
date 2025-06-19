import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Box,
} from '@mui/material';
import BackButton from './BackButton';

const netAppUnits = [
  { label: 'in/week', value: 'inweek' },
];
const areaUnits = [
  { label: 'acres', value: 'acres' },
];
const hrsUnits = [
  { label: 'hours', value: 'hours' },
];
const daysUnits = [
  { label: 'days', value: 'days' },
];
const effUnits = [
  { label: 'decimal', value: 'decimal' },
];
const outputUnits = [
  { label: 'gpm', value: 'gpm' },
  { label: 'lps', value: 'lps' },
  { label: 'lpm', value: 'lpm' },
];

const fontTitle = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 700, fontSize: 32, color: '#222' };
const fontSection = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 600, fontSize: 20, color: '#8cb43a' };
const fontFormula = { fontFamily: 'monospace', fontWeight: 600, fontSize: 24, background: '#f5f5f5', p: 2, borderRadius: 2, display: 'inline-block' };
const fontText = { fontFamily: 'Roboto, Arial, sans-serif', fontSize: 16, color: '#222' };
const fontVar = { fontWeight: 700, color: '#8cb43a' };

function calculateQ({ netApp, area, hrs, days, eff }) {
  if (!netApp || !area || !hrs || !days || !eff) return null;
  const Q = (27154 * netApp * area) / (60 * hrs * days * eff);
  return Q;
}

function convertGpmToOutputUnit(value, unit) {
  switch (unit) {
    case 'gpm': return value;
    case 'lps': return value * 0.0630902;
    case 'lpm': return value * 3.78541;
    default: return value;
  }
}

const SystemPumpingRequirementsCalculator = () => {
  const [inputs, setInputs] = useState({
    netApp: '',
    netAppUnit: 'inweek',
    area: '',
    areaUnit: 'acres',
    hrs: '',
    hrsUnit: 'hours',
    days: '',
    daysUnit: 'days',
    eff: '',
    effUnit: 'decimal',
    outputUnit: 'gpm',
  });
  const [result, setResult] = useState(null);

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const q = calculateQ({
      netApp: parseFloat(inputs.netApp),
      area: parseFloat(inputs.area),
      hrs: parseFloat(inputs.hrs),
      days: parseFloat(inputs.days),
      eff: parseFloat(inputs.eff),
    });
    if (q === null || isNaN(q)) {
      setResult(null);
      return;
    }
    const val = convertGpmToOutputUnit(q, inputs.outputUnit);
    setResult(val);
  }, [inputs]);

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <BackButton />
      <Typography gutterBottom sx={fontTitle} align="center">
        System Pumping Requirements
      </Typography>
      <Typography gutterBottom sx={fontText} align="center">
        Calculate the total flow rate required to operate your irrigation system.
      </Typography>
      <Box sx={{ mb: 4 }} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Net application required per week"
              type="number"
              value={inputs.netApp}
              onChange={handleInputChange('netApp')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Net Application Unit</InputLabel>
            <Select
              value={inputs.netAppUnit}
              label="Net Application Unit"
              onChange={handleInputChange('netAppUnit')}
            >
              {netAppUnits.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Total area to be irrigated"
              type="number"
              value={inputs.area}
              onChange={handleInputChange('area')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Area Unit</InputLabel>
            <Select
              value={inputs.areaUnit}
              label="Area Unit"
              onChange={handleInputChange('areaUnit')}
            >
              {areaUnits.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Hours available per day"
              type="number"
              value={inputs.hrs}
              onChange={handleInputChange('hrs')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Time Unit</InputLabel>
            <Select
              value={inputs.hrsUnit}
              label="Time Unit"
              onChange={handleInputChange('hrsUnit')}
            >
              {hrsUnits.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Days available per week"
              type="number"
              value={inputs.days}
              onChange={handleInputChange('days')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Days Unit</InputLabel>
            <Select
              value={inputs.daysUnit}
              label="Days Unit"
              onChange={handleInputChange('daysUnit')}
            >
              {daysUnits.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Efficiency (as decimal, e.g. 0.75)"
              type="number"
              value={inputs.eff}
              onChange={handleInputChange('eff')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Efficiency Unit</InputLabel>
            <Select
              value={inputs.effUnit}
              label="Efficiency Unit"
              onChange={handleInputChange('effUnit')}
            >
              {effUnits.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Output Unit</InputLabel>
            <Select
              value={inputs.outputUnit}
              label="Output Unit"
              onChange={handleInputChange('outputUnit')}
            >
              {outputUnits.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Result and output unit dropdown side by side, below input fields */}
      {result !== null && (
        <Box sx={{ mt: 6, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography sx={{ ...fontSection, mb: 1 }} align="center">
            Result:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3, bgcolor: '#f5f5f5', borderRadius: 2, minWidth: 250, textAlign: 'center' }}>
            <Typography sx={{ ...fontFormula, fontSize: 28, mb: 0 }}>
              {result.toLocaleString(undefined, { maximumFractionDigits: 4 })}
            </Typography>
            <Typography sx={{ fontWeight: 700, color: '#8cb43a', fontSize: 24 }}>
              {outputUnits.find(u => u.value === inputs.outputUnit)?.label || inputs.outputUnit}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Formula centered, below result */}
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography sx={{ ...fontSection, mb: 1 }} align="center">
          Formula:
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Box sx={{ ...fontFormula, fontSize: 24 }}>
            Q = (27154 × Net_app × A) / (60 × Hrs × Days × E)
          </Box>
        </Box>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 1 }}>
            Where:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ fontSize: 16 }}><b>Q</b> = Total flow rate required to operate irrigation system (gpm)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>Net_app</b> = The net application required per week (in)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>A</b> = Total area to be irrigated (acres)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>Hrs</b> = Total hours available to operate per day (hrs)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>Days</b> = Total days available to operate each week (days)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>E</b> = Efficiency of the irrigation system (as a decimal)</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default SystemPumpingRequirementsCalculator; 