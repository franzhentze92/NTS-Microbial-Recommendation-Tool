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
  SelectChangeEvent,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';

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
  { label: 'sec', value: 'sec' },
  { label: 'min', value: 'min' },
  { label: 'hr', value: 'hr' },
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
const fontFormula = { fontFamily: 'monospace', fontWeight: 600, fontSize: 20, background: '#f5f5f5', p: 2, borderRadius: 2, display: 'inline-block' };
const fontText = { fontFamily: 'Roboto, Arial, sans-serif', fontSize: 16, color: '#222' };
const fontVar = { fontWeight: 700, color: '#8cb43a' };

interface Inputs {
  flowRate: number;
  flowRateUnit: string;
  area: number;
  areaUnit: string;
  time: number;
  timeUnit: string;
  depth: number;
  depthUnit: string;
  efficiency: number;
  solveFor: 'depth' | 'time';
}

// Conversion factors to base units
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
  const [inputs, setInputs] = useState<Inputs>({
    flowRate: 0,
    flowRateUnit: 'gpm',
    area: 0,
    areaUnit: 'acres',
    time: 0,
    timeUnit: 'hr',
    depth: 0,
    depthUnit: 'in',
    efficiency: 100,
    solveFor: 'depth',
  });
  const [result, setResult] = useState<number | null>(null);

  const handleInputChange = (field: keyof Inputs) => (
    event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
  ) => {
    const value = event.target.value;
    setInputs((prev) => ({
      ...prev,
      [field]: field.includes('Unit') || field === 'solveFor' ? value : Number(value),
    }));
  };

  // Dedicated handler for number/text fields
  const handleNumberInputChange = (field: keyof Inputs) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setInputs((prev) => ({
      ...prev,
      [field]: Number(value),
    }));
  };

  useEffect(() => {
    calculateWaterDepth();
    // eslint-disable-next-line
  }, [inputs]);

  // Main calculation
  const calculateWaterDepth = () => {
    // Convert all to base units
    const Q = inputs.flowRate * (flowRateToGpm[inputs.flowRateUnit as keyof typeof flowRateToGpm] || 1); // gpm
    const A = inputs.area * (areaToAcres[inputs.areaUnit as keyof typeof areaToAcres] || 1); // acres
    const T = inputs.time * (timeToHr[inputs.timeUnit as keyof typeof timeToHr] || 1); // hr
    const d = inputs.depth * (depthToIn[inputs.depthUnit as keyof typeof depthToIn] || 1); // in
    const eff = inputs.efficiency / 100;
    // K depends on flow rate unit
    let K = 453;
    if (inputs.flowRateUnit === 'cfs') K = 1.01;
    else if (inputs.flowRateUnit === 'mgd') K = 0.653;
    else if (inputs.flowRateUnit === 'lps') K = 1.71;
    else if (inputs.flowRateUnit === 'lpm') K = 102.6;
    else if (inputs.flowRateUnit === 'cms') K = 1710;
    else if (inputs.flowRateUnit === 'cu. m/hr') K = 4.02;
    else if (inputs.flowRateUnit === 'gph') K = 27200;
    else if (inputs.flowRateUnit === 'acre-in/day') K = 1;
    else if (inputs.flowRateUnit === 'acre-in/hour') K = 24;
    else if (inputs.flowRateUnit === 'acre-ft/day') K = 0.0833;
    // Calculation
    if (inputs.solveFor === 'depth') {
      if (Q > 0 && T > 0 && A > 0 && eff > 0) {
        const depthIn = (Q * T * eff) / (K * A);
        setResult(depthIn / (depthToIn[inputs.depthUnit as keyof typeof depthToIn] || 1));
      } else {
        setResult(null);
      }
    } else if (inputs.solveFor === 'time') {
      if (Q > 0 && d > 0 && A > 0 && eff > 0) {
        const timeHr = (K * A * d) / (Q * eff);
        setResult(timeHr / (timeToHr[inputs.timeUnit as keyof typeof timeToHr] || 1));
      } else {
        setResult(null);
      }
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography gutterBottom sx={fontTitle} align="center">
        Water Depth
      </Typography>
      <Typography gutterBottom sx={fontText} align="center">
        This form calculates the depth of water applied to a specified area over the specified time span based on the given flow rate onto the field. You can solve for either water depth or time. All common irrigation units and efficiency are supported.
      </Typography>
      <Box sx={{ mb: 4 }} />
      <RadioGroup
        row
        value={inputs.solveFor}
        onChange={handleInputChange('solveFor')}
        sx={{ justifyContent: 'center', mb: 2 }}
      >
        <FormControlLabel value="depth" control={<Radio color="success" />} label={<Box component="span" sx={{ color: '#8cb43a', fontWeight: 600 }}>Solve for Depth</Box>} />
        <FormControlLabel value="time" control={<Radio color="success" />} label={<Box component="span" sx={{ color: '#8cb43a', fontWeight: 600 }}>Solve for Time</Box>} />
      </RadioGroup>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Flow Rate"
              type="number"
              value={inputs.flowRate}
              onChange={handleNumberInputChange('flowRate')}
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
              onChange={handleNumberInputChange('area')}
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
              onChange={handleNumberInputChange('time')}
              disabled={inputs.solveFor === 'time'}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Time Unit</InputLabel>
            <Select
              value={inputs.timeUnit}
              label="Time Unit"
              onChange={handleInputChange('timeUnit')}
              disabled={inputs.solveFor === 'time'}
            >
              {timeUnits.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Depth"
              type="number"
              value={inputs.depth}
              onChange={handleNumberInputChange('depth')}
              disabled={inputs.solveFor === 'depth'}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Depth Unit</InputLabel>
            <Select
              value={inputs.depthUnit}
              label="Depth Unit"
              onChange={handleInputChange('depthUnit')}
              disabled={inputs.solveFor === 'depth'}
            >
              {depthUnits.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Irrigation Efficiency (%)"
              type="number"
              value={inputs.efficiency}
              onChange={handleNumberInputChange('efficiency')}
              inputProps={{ min: 0, max: 100 }}
            />
          </FormControl>
        </Grid>
      </Grid>
      <Box sx={{ mt: 4, mb: 2, textAlign: 'center' }}>
        <Typography sx={fontSection} gutterBottom>
          {inputs.solveFor === 'depth' ? 'Calculated Depth:' : 'Calculated Time:'}
        </Typography>
        <Typography sx={{ fontWeight: 700, fontSize: 28, color: '#8cb43a' }}>
          {result !== null
            ? `${result.toLocaleString(undefined, { maximumFractionDigits: 3 })} ${inputs.solveFor === 'depth' ? inputs.depthUnit : inputs.timeUnit}`
            : '--'}
        </Typography>
      </Box>
      <Box sx={{ mt: 6 }}>
        <Typography sx={fontSection} gutterBottom align="center">
          The Equation
        </Typography>
        <Typography sx={fontText} align="center" gutterBottom>
          This calculator uses this formula to determine the depth that water is applied or the time required.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Box sx={fontFormula}>
            Q × T × Efficiency = K × A × d
          </Box>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={fontText} align="center"><Box component="span" sx={fontVar}>Q</Box> = Flow rate of water onto the field (various units)</Typography>
          <Typography sx={fontText} align="center"><Box component="span" sx={fontVar}>T</Box> = Time water is flowing (various units)</Typography>
          <Typography sx={fontText} align="center"><Box component="span" sx={fontVar}>Efficiency</Box> = Irrigation efficiency (fraction)</Typography>
          <Typography sx={fontText} align="center"><Box component="span" sx={fontVar}>K</Box> = Constant (depends on flow rate unit)</Typography>
          <Typography sx={fontText} align="center"><Box component="span" sx={fontVar}>A</Box> = Area (various units)</Typography>
          <Typography sx={fontText} align="center"><Box component="span" sx={fontVar}>d</Box> = Depth of water application over A (various units)</Typography>
        </Box>
        <Typography sx={{ fontSize: 14, color: '#8cb43a', fontWeight: 600, letterSpacing: 1, mt: 2 }} align="center">
          Reference: Washington State University
        </Typography>
      </Box>
    </Paper>
  );
};

export default WaterDepthCalculator; 