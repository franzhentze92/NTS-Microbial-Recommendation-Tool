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
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import BackButton from './BackButton';

const hoseSizes = [
  { label: '1/2 in', value: '1/2' },
  { label: '5/8 in', value: '5/8' },
  { label: '3/4 in', value: '3/4' },
];
const pressures = [40, 45, 50, 60];
const lengths = [25, 50, 75, 100, 125, 150, 175, 200];
const lTable = {
  25: 4,
  50: 2,
  75: 1.5,
  100: 1,
  125: 0.87,
  150: 0.75,
  175: 0.62,
  200: 0.5,
};
const spTable = {
  '1/2': { 40: 6, 45: 6.5, 50: 7, 60: 7.5 },
  '5/8': { 40: 11, 45: 12, 50: 12.5, 60: 14 },
  '3/4': { 40: 18, 45: 19, 50: 20, 60: 22 },
};
const flowUnits = [
  { label: 'gpm', value: 'gpm', fromGpm: v => v, toGpm: v => v },
  { label: 'lpm', value: 'lpm', fromGpm: v => v * 3.78541, toGpm: v => v / 3.78541 },
];
const volumeUnits = [
  { label: 'gal', value: 'gal', toGal: v => v, fromGal: v => v },
  { label: 'L', value: 'L', toGal: v => v * 0.264172, fromGal: v => v / 0.264172 },
];
const timeUnits = [
  { label: 'min', value: 'min', fromMin: v => v, toMin: v => v },
  { label: 'hr', value: 'hr', fromMin: v => v / 60, toMin: v => v * 60 },
];

const fontTitle = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 700, fontSize: 32, color: '#222' };
const fontSection = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 600, fontSize: 20, color: '#8cb43a' };
const fontFormula = { fontFamily: 'monospace', fontWeight: 600, fontSize: 24, background: '#f5f5f5', p: 2, borderRadius: 2, display: 'inline-block' };
const fontText = { fontFamily: 'Roboto, Arial, sans-serif', fontSize: 16, color: '#222' };

function calculateFlowRate({ size, pressure, length, flowUnit }) {
  if (!size || !pressure || !length) return null;
  const SP = spTable[size][pressure];
  const L = lTable[length];
  if (!SP || !L) return null;
  const Q_gpm = SP * L;
  const outConv = flowUnits.find(u => u.value === flowUnit).fromGpm;
  return outConv(Q_gpm);
}

function calculateFillTime({ size, pressure, length, volume, volumeUnit, timeUnit }) {
  if (!size || !pressure || !length || !volume) return null;
  const SP = spTable[size][pressure];
  const L = lTable[length];
  if (!SP || !L) return null;
  const Q_gpm = SP * L;
  const Vol_gal = volumeUnits.find(u => u.value === volumeUnit).toGal(Number(volume));
  if (Q_gpm <= 0) return null;
  const time_min = Vol_gal / Q_gpm;
  const outConv = timeUnits.find(u => u.value === timeUnit).fromMin;
  return outConv(time_min);
}

const GardenHoseFlowRateTimeCalculator = () => {
  const [mode, setMode] = useState('flow'); // 'flow' or 'time'
  const [inputs, setInputs] = useState({
    size: '5/8',
    pressure: 50,
    length: 50,
    flowUnit: 'gpm',
    volume: '',
    volumeUnit: 'gal',
    timeUnit: 'min',
  });
  const [result, setResult] = useState(null);

  useEffect(() => {
    let res = null;
    if (mode === 'flow') {
      res = calculateFlowRate({
        size: inputs.size,
        pressure: inputs.pressure,
        length: inputs.length,
        flowUnit: inputs.flowUnit,
      });
    } else {
      res = calculateFillTime({
        size: inputs.size,
        pressure: inputs.pressure,
        length: inputs.length,
        volume: inputs.volume,
        volumeUnit: inputs.volumeUnit,
        timeUnit: inputs.timeUnit,
      });
    }
    setResult(res);
  }, [inputs, mode]);

  const handleInputChange = (field) => (event) => {
    setInputs(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleModeChange = (event, newMode) => {
    if (newMode) setMode(newMode);
    setResult(null);
    setInputs({
      size: '5/8',
      pressure: 50,
      length: 50,
      flowUnit: 'gpm',
      volume: '',
      volumeUnit: 'gal',
      timeUnit: 'min',
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <BackButton />
      <Typography gutterBottom sx={fontTitle} align="center">
        Garden Hose Flow Rate & Time
      </Typography>
      <Typography gutterBottom sx={fontText} align="center">
        Calculate the water flow rate from a garden hose or the time to fill a container.
      </Typography>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          color="primary"
        >
          <ToggleButton value="flow">Calculate Flow Rate</ToggleButton>
          <ToggleButton value="time">Calculate Fill Time</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ mb: 2 }} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Hose Size</InputLabel>
            <Select
              value={inputs.size}
              label="Hose Size"
              onChange={handleInputChange('size')}
            >
              {hoseSizes.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Pressure (psi)</InputLabel>
            <Select
              value={inputs.pressure}
              label="Pressure (psi)"
              onChange={handleInputChange('pressure')}
            >
              {pressures.map((p) => (
                <MenuItem key={p} value={p}>{p}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Hose Length (ft)</InputLabel>
            <Select
              value={inputs.length}
              label="Hose Length (ft)"
              onChange={handleInputChange('length')}
            >
              {lengths.map((l) => (
                <MenuItem key={l} value={l}>{l}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {mode === 'flow' ? (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Flow Rate Unit</InputLabel>
              <Select
                value={inputs.flowUnit}
                label="Flow Rate Unit"
                onChange={handleInputChange('flowUnit')}
              >
                {flowUnits.map((u) => (
                  <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        ) : (
          <>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <TextField
                  label="Volume to Fill"
                  type="number"
                  value={inputs.volume}
                  onChange={handleInputChange('volume')}
                />
              </FormControl>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Volume Unit</InputLabel>
                <Select
                  value={inputs.volumeUnit}
                  label="Volume Unit"
                  onChange={handleInputChange('volumeUnit')}
                >
                  {volumeUnits.map((u) => (
                    <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Time Unit</InputLabel>
                <Select
                  value={inputs.timeUnit}
                  label="Time Unit"
                  onChange={handleInputChange('timeUnit')}
                >
                  {timeUnits.map((u) => (
                    <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </>
        )}
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
            <Typography sx={{ fontWeight: 600, color: '#8cb43a', ml: 1 }}>
              {mode === 'flow'
                ? flowUnits.find(u => u.value === inputs.flowUnit).label
                : timeUnits.find(u => u.value === inputs.timeUnit).label}
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
            {mode === 'flow'
              ? 'Q = SP × L'
              : 'Time = Vol / Q'}
          </Box>
        </Box>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 1 }}>
            Where:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            {mode === 'flow' ? (
              <>
                <Typography sx={{ fontSize: 16 }}><b>Q</b> = Water flow rate from the end of the hose (gpm)</Typography>
                <Typography sx={{ fontSize: 16 }}><b>SP</b> = Value from hose size & pressure table</Typography>
                <Typography sx={{ fontSize: 16 }}><b>L</b> = Value from hose length table</Typography>
              </>
            ) : (
              <>
                <Typography sx={{ fontSize: 16 }}><b>Time</b> = Time to fill specified volume (min)</Typography>
                <Typography sx={{ fontSize: 16 }}><b>Vol</b> = Volume needed (gal)</Typography>
                <Typography sx={{ fontSize: 16 }}><b>Q</b> = Flow rate from the garden hose (gpm)</Typography>
              </>
            )}
          </Box>
        </Box>
        <Typography sx={{ fontSize: 13, color: '#888', mt: 2 }}>
          Reference: Washington State University
        </Typography>
      </Box>
    </Paper>
  );
};

export default GardenHoseFlowRateTimeCalculator; 