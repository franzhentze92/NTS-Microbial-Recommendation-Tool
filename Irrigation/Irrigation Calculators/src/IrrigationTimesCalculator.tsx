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
} from '@mui/material';

const netWaterUnits = [
  { label: 'mm', value: 'mm' },
  { label: 'cm', value: 'cm' },
  { label: 'in', value: 'in' },
];

const areaUnits = [
  { label: 'acres', value: 'acres' },
  { label: 'sq. in.', value: 'sqin' },
  { label: 'sq. ft.', value: 'sqft' },
  { label: 'hectares', value: 'hectares' },
  { label: 'sq. cm.', value: 'sqcm' },
  { label: 'sq. meters', value: 'sqm' },
  { label: 'sq. mile', value: 'sqmile' },
];

const flowRateUnits = [
  { label: 'lps', value: 'lps' },
  { label: 'lpm', value: 'lpm' },
  { label: 'lph', value: 'lph' },
  { label: 'gpm', value: 'gpm' },
  { label: 'gph', value: 'gph' },
  { label: 'gpd', value: 'gpd' },
  { label: 'cfs', value: 'cfs' },
  { label: 'cfm', value: 'cfm' },
  { label: 'cu. m/hr', value: 'cumhr' },
  { label: 'cu. yd/min', value: 'cuym' },
  { label: 'mgd', value: 'mgd' },
  { label: 'acre-in/day', value: 'acreinday' },
  { label: 'acre-in/hr', value: 'acreinhr' },
  { label: 'acre-ft/day', value: 'acrefday' },
  { label: 'cms', value: 'cms' },
];

const setTimeUnits = [
  { label: 'hr', value: 'hr' },
  { label: 'min', value: 'min' },
];

interface Inputs {
  netWater: number;
  netWaterUnit: string;
  systemEfficiency: number;
  irrigatedArea: number;
  areaUnit: string;
  flowRate: number;
  flowRateUnit: string;
  setTimeUnit: string;
}

function convertNetWaterToInches(value: number, unit: string): number {
  switch (unit) {
    case 'mm': return value * 0.0393701;
    case 'cm': return value * 0.393701;
    case 'in': return value;
    default: return value;
  }
}

function convertAreaToAcres(value: number, unit: string): number {
  switch (unit) {
    case 'acres': return value;
    case 'sqin': return value / 6_272_640;
    case 'sqft': return value / 43_560;
    case 'hectares': return value * 2.47105;
    case 'sqcm': return value / 40_468_564.224;
    case 'sqm': return value / 4_046.86;
    case 'sqmile': return value * 640;
    default: return value;
  }
}

function convertFlowRateToGpm(value: number, unit: string): number {
  switch (unit) {
    case 'gpm': return value;
    case 'lps': return value * 15.8503;
    case 'lpm': return value * 0.264172;
    case 'lph': return value * 0.00440287;
    case 'gph': return value / 60;
    case 'gpd': return value / 1_440;
    case 'cfs': return value * 448.831;
    case 'cfm': return value * 7.48052;
    case 'cumhr': return value * 4.40287;
    case 'cuym': return value * 201.974;
    case 'mgd': return value * 694.444;
    case 'acreinday': return value * 27_154;
    case 'acreinhr': return value * 651_696;
    case 'acrefday': return value * 271_540;
    case 'cms': return value * 15_850.3;
    default: return value;
  }
}

const fontTitle = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 700, fontSize: 32, color: '#222' };
const fontSection = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 600, fontSize: 20, color: '#8cb43a' };
const fontFormula = { fontFamily: 'monospace', fontWeight: 600, fontSize: 20, background: '#f5f5f5', p: 2, borderRadius: 2, display: 'inline-block' };
const fontText = { fontFamily: 'Roboto, Arial, sans-serif', fontSize: 16, color: '#222' };
const fontVar = { fontWeight: 700, color: '#8cb43a' };

const IrrigationTimesCalculator = () => {
  const [inputs, setInputs] = useState<Inputs>({
    netWater: 0,
    netWaterUnit: 'mm',
    systemEfficiency: 80,
    irrigatedArea: 0,
    areaUnit: 'acres',
    flowRate: 0,
    flowRateUnit: 'gpm',
    setTimeUnit: 'hr',
  });
  const [result, setResult] = useState<number | null>(null);

  const handleInputChange = (field: keyof Inputs) => (
    event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
  ) => {
    const value = event.target.value;
    setInputs((prev) => ({
      ...prev,
      [field]: field.includes('Unit') ? value : Number(value),
    }));
  };

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
    calculateSetTime();
    // eslint-disable-next-line
  }, [inputs]);

  const calculateSetTime = () => {
    const netWaterInches = convertNetWaterToInches(inputs.netWater, inputs.netWaterUnit);
    const areaAcres = convertAreaToAcres(inputs.irrigatedArea, inputs.areaUnit);
    const flowGpm = convertFlowRateToGpm(inputs.flowRate, inputs.flowRateUnit);
    const efficiency = inputs.systemEfficiency / 100;
    if (netWaterInches <= 0 || areaAcres <= 0 || flowGpm <= 0 || efficiency <= 0) {
      setResult(null);
      return;
    }
    let setTimeHr = (netWaterInches * areaAcres * 43560) / (96.3 * flowGpm * efficiency);
    let finalTime = setTimeHr;
    if (inputs.setTimeUnit === 'min') {
      finalTime = setTimeHr * 60;
    }
    setResult(finalTime);
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography gutterBottom sx={fontTitle} align="center">
        Set Irrigation Times
      </Typography>
      <Typography gutterBottom sx={fontText} align="center">
        Use this form to determine the set time required to fulfill a given water application, irrigation area, and flow rate.
      </Typography>
      <Typography variant="body2" gutterBottom align="center">
        Reference: Washington State University
      </Typography>
      <Box sx={{ mb: 4 }} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Net Water Application"
              type="number"
              value={inputs.netWater}
              onChange={handleNumberInputChange('netWater')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Unit</InputLabel>
            <Select
              value={inputs.netWaterUnit}
              label="Unit"
              onChange={handleInputChange('netWaterUnit')}
            >
              {netWaterUnits.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="System Efficiency (%)"
              type="number"
              value={inputs.systemEfficiency}
              onChange={handleNumberInputChange('systemEfficiency')}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Irrigated Area"
              type="number"
              value={inputs.irrigatedArea}
              onChange={handleNumberInputChange('irrigatedArea')}
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
            <InputLabel>Set Time Unit</InputLabel>
            <Select
              value={inputs.setTimeUnit}
              label="Set Time Unit"
              onChange={handleInputChange('setTimeUnit')}
            >
              {setTimeUnits.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      {result !== null && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Set Time:
          </Typography>
          <Typography variant="h4" color="primary">
            {result.toFixed(2)} {inputs.setTimeUnit}
          </Typography>
        </Box>
      )}
      <Box sx={{ mt: 6 }}>
        <Typography sx={fontSection} gutterBottom align="center">
          The Equation
        </Typography>
        <Typography sx={fontText} align="center" gutterBottom>
          This is the formula this calculator uses to determine the set times for an irrigation system.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Box sx={fontFormula}>
            T = (D × A × 43560) / (96.3 × Q × E)
          </Box>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={fontText} align="center"><Box component="span" sx={fontVar}>T</Box> = Set Time (hr)</Typography>
          <Typography sx={fontText} align="center"><Box component="span" sx={fontVar}>D</Box> = Net water application (in)</Typography>
          <Typography sx={fontText} align="center"><Box component="span" sx={fontVar}>A</Box> = Irrigated area (acres)</Typography>
          <Typography sx={fontText} align="center"><Box component="span" sx={fontVar}>Q</Box> = Flow Rate (gpm)</Typography>
          <Typography sx={fontText} align="center"><Box component="span" sx={fontVar}>E</Box> = System efficiency (as a decimal)</Typography>
        </Box>
        <Typography sx={{ fontSize: 14, color: '#8cb43a', fontWeight: 600, letterSpacing: 1, mt: 2 }} align="center">
          Reference: Washington State University
        </Typography>
      </Box>
    </Paper>
  );
};

export default IrrigationTimesCalculator; 