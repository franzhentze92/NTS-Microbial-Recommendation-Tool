import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, MenuItem, Grid, Divider } from '@mui/material';

const intervalUnits = [
  { label: 'days', value: 1 },
  { label: 'hr', value: 1 / 24 },
];

const cropWaterUseUnits = [
  { label: 'in/day', value: 1 },
  { label: 'mm/day', value: 1 / 25.4 },
  { label: 'cm/day', value: 1 / 2.54 },
  { label: 'in/month', value: 1 / 30 },
  { label: 'mm/month', value: 1 / (25.4 * 30) },
  { label: 'cm/month', value: 1 / (2.54 * 30) },
];

const appRateUnits = [
  { label: 'in/hr', value: 1 },
  { label: 'in/day', value: 1 / 24 },
  { label: 'mm/hr', value: 1 / 25.4 },
  { label: 'mm/day', value: 1 / (25.4 * 24) },
  { label: 'cm/hr', value: 1 / 2.54 },
  { label: 'cm/day', value: 1 / (2.54 * 24) },
];

const efficiencyUnits = [
  { label: '%', value: 0.01 },
  { label: 'decimal', value: 1 },
];

const outputUnits = [
  { label: 'min', value: 1 },
  { label: 'hr', value: 1 / 60 },
  { label: 'days', value: 1 / (60 * 24) },
];

const fontTitle = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 700, fontSize: 32, color: '#222' };
const fontSection = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 600, fontSize: 20, color: '#8cb43a' };
const fontFormula = { fontFamily: 'monospace', fontWeight: 600, fontSize: 20, background: '#f5f5f5', p: 2, borderRadius: 2, display: 'inline-block' };
const fontText = { fontFamily: 'Roboto, Arial, sans-serif', fontSize: 16, color: '#222' };
const fontVar = { fontWeight: 700, color: '#8cb43a' };

const IrrigationRunTimeCalculator: React.FC = () => {
  const [interval, setInterval] = useState('');
  const [intervalUnit, setIntervalUnit] = useState(intervalUnits[0].label);
  const [waterUse, setWaterUse] = useState('');
  const [waterUseUnit, setWaterUseUnit] = useState(cropWaterUseUnits[0].label);
  const [appRate, setAppRate] = useState('');
  const [appRateUnit, setAppRateUnit] = useState(appRateUnits[0].label);
  const [efficiency, setEfficiency] = useState('');
  const [efficiencyUnit, setEfficiencyUnit] = useState(efficiencyUnits[0].label);
  const [outputUnit, setOutputUnit] = useState(outputUnits[0].label);

  // Calculate run time in minutes
  let result = '';
  const valid = interval && waterUse && appRate && efficiency && Number(efficiency) !== 0;
  if (valid) {
    // Convert all to base units: days, in/day, in/hr, decimal
    const I = parseFloat(interval) * intervalUnits.find(u => u.label === intervalUnit)!.value;
    const W = parseFloat(waterUse) * cropWaterUseUnits.find(u => u.label === waterUseUnit)!.value;
    const AR = parseFloat(appRate) * appRateUnits.find(u => u.label === appRateUnit)!.value;
    const E = parseFloat(efficiency) * efficiencyUnits.find(u => u.label === efficiencyUnit)!.value;
    if (AR > 0 && E > 0) {
      const T_min = (60 * I * W) / (AR * E);
      const outFactor = outputUnits.find(u => u.label === outputUnit)!.value;
      const T_out = T_min * outFactor;
      result = T_out.toFixed(4).replace(/\.?0+$/, '');
    }
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography gutterBottom sx={fontTitle} align="center">
        Irrigation Run Time Calculator
      </Typography>
      <Typography gutterBottom sx={fontText} align="center">
        Use this calculator to determine the length of time that an irrigation system must run to apply enough water to replace the water lost to evapotranspiration.
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Watering Interval"
              value={interval}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInterval(e.target.value)}
              type="number"
              fullWidth
              inputProps={{ min: 0 }}
              sx={{ mb: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Interval Unit"
              value={intervalUnit}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIntervalUnit(e.target.value)}
              fullWidth
            >
              {intervalUnits.map(u => (
                <MenuItem key={u.label} value={u.label}>{u.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Crop Water Use"
              value={waterUse}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWaterUse(e.target.value)}
              type="number"
              fullWidth
              inputProps={{ min: 0 }}
              sx={{ mb: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Water Use Unit"
              value={waterUseUnit}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWaterUseUnit(e.target.value)}
              fullWidth
            >
              {cropWaterUseUnits.map(u => (
                <MenuItem key={u.label} value={u.label}>{u.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Application Rate"
              value={appRate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAppRate(e.target.value)}
              type="number"
              fullWidth
              inputProps={{ min: 0 }}
              sx={{ mb: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Application Rate Unit"
              value={appRateUnit}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAppRateUnit(e.target.value)}
              fullWidth
            >
              {appRateUnits.map(u => (
                <MenuItem key={u.label} value={u.label}>{u.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Irrigation Efficiency"
              value={efficiency}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEfficiency(e.target.value)}
              type="number"
              fullWidth
              inputProps={{ min: 0, max: 100 }}
              sx={{ mb: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Efficiency Unit"
              value={efficiencyUnit}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEfficiencyUnit(e.target.value)}
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
              {outputUnits.map(u => (
                <MenuItem key={u.label} value={u.label}>{u.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Irrigation Run Time:</Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: 24 }}>
            {result ? `${result} ${outputUnit}` : '--'}
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 4 }} />
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography sx={fontSection} gutterBottom>The Equation</Typography>
        <Typography sx={fontText} gutterBottom>
          This calculator uses this formula to determine the run time of an irrigation system.
        </Typography>
        <Box sx={{ my: 2 }}>
          <Box sx={fontFormula}>
            T = (60 × I × W) / (AR × E)
          </Box>
        </Box>
        <Typography sx={{ mb: 1, ...fontText }}>Where:</Typography>
        <Box sx={{ textAlign: 'left', display: 'inline-block', mb: 2 }}>
          <Typography sx={fontText}><Box component="span" sx={fontVar}>T</Box> = The time the irrigation system needs to run (hrs)</Typography>
          <Typography sx={fontText}><Box component="span" sx={fontVar}>I</Box> = The watering interval of the system (day)</Typography>
          <Typography sx={fontText}><Box component="span" sx={fontVar}>W</Box> = Crop Water Use (in/day)</Typography>
          <Typography sx={fontText}><Box component="span" sx={fontVar}>AR</Box> = Application Rate of the system (in/hr)</Typography>
          <Typography sx={fontText}><Box component="span" sx={fontVar}>E</Box> = The efficiency of the irrigation system (as a decimal)</Typography>
        </Box>
        <Typography sx={{ fontSize: 14, color: '#8cb43a', fontWeight: 600, letterSpacing: 1, mt: 2 }}>
          Reference: Washington State University
        </Typography>
      </Box>
    </Paper>
  );
};

export default IrrigationRunTimeCalculator; 