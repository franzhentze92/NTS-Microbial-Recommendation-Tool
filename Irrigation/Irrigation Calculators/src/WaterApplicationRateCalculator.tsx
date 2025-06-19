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

const areaUnits = [
  { label: 'acre', value: 'acre' },
  { label: 'hectare', value: 'hectare' },
  { label: 'sq. in.', value: 'sqin' },
  { label: 'sq. ft.', value: 'sqft' },
  { label: 'sq. cm.', value: 'sqcm' },
  { label: 'sq. meter', value: 'sqm' },
  { label: 'sq. yd.', value: 'sqyd' },
  { label: 'sq. km', value: 'sqkm' },
  { label: 'sq. mile', value: 'sqmile' },
];

const flowRateUnits = [
  { label: 'lps', value: 'lps' },
  { label: 'lph', value: 'lph' },
  { label: 'lpd', value: 'lpd' },
  { label: 'gpm', value: 'gpm' },
  { label: 'gph', value: 'gph' },
  { label: 'gpd', value: 'gpd' },
  { label: 'cfs', value: 'cfs' },
  { label: 'acre-in/day', value: 'acreinday' },
  { label: 'acre-in/hour', value: 'acreinhr' },
  { label: 'acre-ft/day', value: 'acrefday' },
  { label: 'cms', value: 'cms' },
  { label: 'cu. m/hr', value: 'cumhr' },
];

const appRateUnits = [
  { label: 'mm/hr', value: 'mmhr' },
  { label: 'mm/day', value: 'mmday' },
  { label: 'cm/hr', value: 'cmhr' },
  { label: 'cm/day', value: 'cmday' },
  { label: 'in/hr', value: 'inhr' },
  { label: 'in/day', value: 'inday' },
];

interface Inputs {
  area: number;
  areaUnit: string;
  flowRate: number;
  flowRateUnit: string;
  appRateUnit: string;
}

function convertAreaToAcres(value: number, unit: string): number {
  switch (unit) {
    case 'acre': return value;
    case 'hectare': return value * 2.47105;
    case 'sqin': return value / 6_272_640;
    case 'sqft': return value / 43_560;
    case 'sqcm': return value / 40_468_564.224;
    case 'sqm': return value / 4_046.86;
    case 'sqyd': return value / 4_840;
    case 'sqkm': return value * 247.105;
    case 'sqmile': return value * 640;
    default: return value;
  }
}

function convertFlowRateToGpm(value: number, unit: string): number {
  switch (unit) {
    case 'gpm': return value;
    case 'lps': return value * 15.8503;
    case 'lph': return value * 0.00440287;
    case 'lpd': return value * 0.000183453;
    case 'gph': return value / 60;
    case 'gpd': return value / 1_440;
    case 'cfs': return value * 448.831;
    case 'acreinday': return value * 27_154;
    case 'acreinhr': return value * 651_696;
    case 'acrefday': return value * 271_540;
    case 'cms': return value * 15_850.3;
    case 'cumhr': return value * 4.40287;
    default: return value;
  }
}

function convertInHrToOutputUnit(value: number, unit: string): number {
  switch (unit) {
    case 'mmhr': return value * 25.4;
    case 'mmday': return value * 25.4 * 24;
    case 'cmhr': return value * 2.54;
    case 'cmday': return value * 2.54 * 24;
    case 'inhr': return value;
    case 'inday': return value * 24;
    default: return value;
  }
}

const fontTitle = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 700, fontSize: 32, color: '#222' };
const fontSection = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 600, fontSize: 20, color: '#8cb43a' };
const fontFormula = { fontFamily: 'monospace', fontWeight: 600, fontSize: 20, background: '#f5f5f5', p: 2, borderRadius: 2, display: 'inline-block' };
const fontText = { fontFamily: 'Roboto, Arial, sans-serif', fontSize: 16, color: '#222' };
const fontVar = { fontWeight: 700, color: '#8cb43a' };

const WaterApplicationRateCalculator = () => {
  const [inputs, setInputs] = useState<Inputs>({
    area: 0,
    areaUnit: 'acre',
    flowRate: 0,
    flowRateUnit: 'gpm',
    appRateUnit: 'mmhr',
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
    calculateAppRate();
    // eslint-disable-next-line
  }, [inputs]);

  const calculateAppRate = () => {
    const areaAcres = convertAreaToAcres(inputs.area, inputs.areaUnit);
    const flowGpm = convertFlowRateToGpm(inputs.flowRate, inputs.flowRateUnit);
    if (areaAcres <= 0 || flowGpm <= 0) {
      setResult(null);
      return;
    }
    // AR (in/hr) = q / (A * 452.57)
    const appRateInHr = flowGpm / (areaAcres * 452.57);
    const finalRate = convertInHrToOutputUnit(appRateInHr, inputs.appRateUnit);
    setResult(finalRate);
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography gutterBottom sx={fontTitle} align="center">
        Water Application Rate
      </Typography>
      <Typography gutterBottom sx={fontText} align="center">
        Use this form to calculate the water application rate using the flow rate on an area. This calculator assumes perfect irrigation efficiency and uniformity.
      </Typography>
      <Box sx={{ mb: 4 }} />
      <Grid container spacing={3}>
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
            <InputLabel>Application Rate Unit</InputLabel>
            <Select
              value={inputs.appRateUnit}
              label="Application Rate Unit"
              onChange={handleInputChange('appRateUnit')}
            >
              {appRateUnits.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      {result !== null && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Water Application Rate:
          </Typography>
          <Typography variant="h4" color="primary">
            {result.toFixed(4)} {appRateUnits.find(u => u.value === inputs.appRateUnit)?.label}
          </Typography>
        </Box>
      )}
      <Box sx={{ mt: 6 }}>
        <Typography sx={fontSection} gutterBottom align="center">
          The Equation
        </Typography>
        <Typography sx={fontText} align="center" gutterBottom>
          This is the formula this calculator uses to determine the water application rate.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Box sx={fontFormula}>
            AR = q / (A × 452.57)
          </Box>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={fontText} align="center"><Box component="span" sx={fontVar}>AR</Box> = Application Rate (in/hr)</Typography>
          <Typography sx={fontText} align="center"><Box component="span" sx={fontVar}>q</Box> = Flow rate (gpm)</Typography>
          <Typography sx={fontText} align="center"><Box component="span" sx={fontVar}>A</Box> = Area (sq. ft)</Typography>
        </Box>
        <Typography sx={{ fontSize: 14, color: '#8cb43a', fontWeight: 600, letterSpacing: 1, mt: 2 }} align="center">
          {/* Reference: Washington State University */}
        </Typography>
      </Box>
    </Paper>
  );
};

export default WaterApplicationRateCalculator; 