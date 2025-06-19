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

// All units from the original calculator
const flowRateUnits = [
  { label: 'gpm', value: 'gpm' },
  { label: 'gph', value: 'gph' },
  { label: 'mgd', value: 'mgd' },
  { label: 'cfs', value: 'cfs' },
  { label: 'acre-in/day', value: 'acre-in/day' },
  { label: 'acre-in/hour', value: 'acre-in/hour' },
  { label: 'acre-ft/day', value: 'acre-ft/day' },
  { label: 'lps', value: 'lps' },
  { label: 'lpm', value: 'lpm' },
  { label: 'cms', value: 'cms' },
  { label: 'cu. m/hr', value: 'cu. m/hr' },
];

const areaUnits = [
  { label: 'acres', value: 'acres' },
  { label: 'sq. ft', value: 'sq. ft' },
  { label: 'hectares', value: 'hectares' },
  { label: 'sq. m', value: 'sq. m' },
  { label: 'sq. miles', value: 'sq. miles' },
];

const timeUnits = [
  { label: 'hr', value: 'hr' },
  { label: 'min', value: 'min' },
  { label: 'sec', value: 'sec' },
  { label: 'days', value: 'days' },
  { label: 'weeks', value: 'weeks' },
  { label: 'months', value: 'months' },
  { label: 'yrs', value: 'yrs' },
];

const depthUnits = [
  { label: 'in', value: 'in' },
  { label: 'ft', value: 'ft' },
  { label: 'mm', value: 'mm' },
  { label: 'cm', value: 'cm' },
];

const fontTitle = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 700, fontSize: 32, color: '#222' };
const fontSection = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 600, fontSize: 20, color: '#8cb43a' };
const fontFormula = { fontFamily: 'monospace', fontWeight: 600, fontSize: 24, background: '#f5f5f5', p: 2, borderRadius: 2, display: 'inline-block' };
const fontText = { fontFamily: 'Roboto, Arial, sans-serif', fontSize: 16, color: '#222' };
const fontVar = { fontWeight: 700, color: '#8cb43a' };

const flowRateToGpm = {
  'gpm': 1,
  'gph': 1/60,
  'mgd': 694.444,
  'cfs': 448.831,
  'acre-in/day': 27.154,
  'acre-in/hour': 651.7,
  'acre-ft/day': 27154,
  'lps': 15.8503,
  'lpm': 0.264172,
  'cms': 15850.3,
  'cu. m/hr': 4.40287,
};
const areaToAcres = {
  'acres': 1,
  'sq. ft': 1/43560,
  'hectares': 2.47105,
  'sq. m': 0.000247105,
  'sq. miles': 640,
};
const timeToHr = {
  'sec': 1/3600,
  'min': 1/60,
  'hr': 1,
  'days': 24,
  'weeks': 168,
  'months': 730,
  'yrs': 8760,
};
const depthToIn = {
  'in': 1,
  'ft': 12,
  'mm': 0.0393701,
  'cm': 0.393701,
};
const inToDepth = {
  'in': 1,
  'ft': 1/12,
  'mm': 25.4,
  'cm': 2.54,
};

const WaterDepthCalculator = () => {
  const [inputs, setInputs] = useState({
    flowRate: '',
    flowRateUnit: 'gpm',
    area: '',
    areaUnit: 'acres',
    time: '',
    timeUnit: 'hr',
    depth: '',
    depthUnit: 'in',
    efficiency: '',
  });
  const [result, setResult] = useState(null);

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    // Example calculation for depth (inches): D = (Q × T) / (A × 96.3)
    const Q = parseFloat(inputs.flowRate) || 0;
    const T = parseFloat(inputs.time) || 0;
    const A = parseFloat(inputs.area) || 0;
    if (Q > 0 && T > 0 && A > 0) {
      const D = (Q * T) / (A * 96.3);
      setResult(D);
    } else {
      setResult(null);
    }
  }, [inputs]);

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 700, mx: 'auto' }}>
      <BackButton />
      <Typography gutterBottom sx={fontTitle} align="center">
        Water Depth Calculator
      </Typography>
      <Typography gutterBottom sx={fontText} align="center">
        Calculate the depth of water applied to a specified area over a specified time span based on the given flow rate.
      </Typography>
      <Box sx={{ mb: 4 }} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Flow Rate"
              type="number"
              value={inputs.flowRate}
              onChange={handleInputChange('flowRate')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Flow Rate Unit</InputLabel>
            <Select
              value={inputs.flowRateUnit}
              label="Flow Rate Unit"
              onChange={handleInputChange('flowRateUnit')}
            >
              {flowRateUnits.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Area"
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
              label="Time"
              type="number"
              value={inputs.time}
              onChange={handleInputChange('time')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
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
            <FormControl size="small">
              <Select
                value={inputs.depthUnit}
                onChange={handleInputChange('depthUnit')}
                sx={{ fontWeight: 600, color: '#8cb43a', minWidth: 100 }}
              >
                {depthUnits.map((u) => (
                  <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
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
            D = (Q × T) / (A × 96.3)
          </Box>
        </Box>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 1 }}>
            Where:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ fontSize: 16 }}>
              <b>D</b> = Water Depth (inches)
            </Typography>
            <Typography sx={{ fontSize: 16 }}>
              <b>Q</b> = Flow Rate (gpm)
            </Typography>
            <Typography sx={{ fontSize: 16 }}>
              <b>T</b> = Time (hours)
            </Typography>
            <Typography sx={{ fontSize: 16 }}>
              <b>A</b> = Area (acres)
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default WaterDepthCalculator; 