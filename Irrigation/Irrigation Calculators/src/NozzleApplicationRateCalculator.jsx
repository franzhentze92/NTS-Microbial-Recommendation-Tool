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

const flowUnits = [
  { label: 'gpm', value: 'gpm', toGpm: v => v },
  { label: 'lpm', value: 'lpm', toGpm: v => v * 0.264172 },
  { label: 'lph', value: 'lph', toGpm: v => v * 0.00440287 },
];
const distanceUnits = [
  { label: 'ft', value: 'ft', toFt: v => v },
  { label: 'm', value: 'm', toFt: v => v * 3.28084 },
  { label: 'cm', value: 'cm', toFt: v => v * 0.0328084 },
];
const appRateUnits = [
  { label: 'in/hr', value: 'inhr', fromInHr: v => v },
  { label: 'mm/hr', value: 'mmhr', fromInHr: v => v * 25.4 },
];

const fontTitle = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 700, fontSize: 32, color: '#222' };
const fontSection = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 600, fontSize: 20, color: '#8cb43a' };
const fontFormula = { fontFamily: 'monospace', fontWeight: 600, fontSize: 24, background: '#f5f5f5', p: 2, borderRadius: 2, display: 'inline-block' };
const fontText = { fontFamily: 'Roboto, Arial, sans-serif', fontSize: 16, color: '#222' };

function calculateNozzleAppRate({ flow, flowUnit, eff, x, xUnit, y, yUnit, appRateUnit }) {
  if (!flow || !eff || !x || !y) return null;
  const Qn = flowUnits.find(u => u.value === flowUnit).toGpm(Number(flow));
  const Eff = Number(eff);
  const X = distanceUnits.find(u => u.value === xUnit).toFt(Number(x));
  const Y = distanceUnits.find(u => u.value === yUnit).toFt(Number(y));
  if (Qn <= 0 || Eff <= 0 || X <= 0 || Y <= 0) return null;
  const PR_inhr = 96.25 * Qn * Eff / (X * Y);
  const outConv = appRateUnits.find(u => u.value === appRateUnit).fromInHr;
  return outConv(PR_inhr);
}

const NozzleApplicationRateCalculator = () => {
  const [inputs, setInputs] = useState({
    flow: '',
    flowUnit: 'gpm',
    eff: '0.7',
    x: '',
    xUnit: 'ft',
    y: '',
    yUnit: 'ft',
    appRateUnit: 'inhr',
  });
  const [result, setResult] = useState(null);

  const handleInputChange = (field) => (event) => {
    setInputs(prev => ({ ...prev, [field]: event.target.value }));
  };

  useEffect(() => {
    const res = calculateNozzleAppRate(inputs);
    setResult(res);
  }, [inputs]);

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <BackButton />
      <Typography gutterBottom sx={fontTitle} align="center">
        Nozzle Application Rate
      </Typography>
      <Typography gutterBottom sx={fontText} align="center">
        Calculate the effective application rate of a sprinkler nozzle system.
      </Typography>
      <Box sx={{ mb: 4 }} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Nozzle Flow Rate"
              type="number"
              value={inputs.flow}
              onChange={handleInputChange('flow')}
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
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Irrigation Efficiency"
              type="number"
              value={inputs.eff}
              onChange={handleInputChange('eff')}
              inputProps={{ step: '0.01', min: '0', max: '1' }}
              helperText="(e.g. 0.7 for set-move)"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Distance Between Nozzles (X)"
              type="number"
              value={inputs.x}
              onChange={handleInputChange('x')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>X Unit</InputLabel>
            <Select
              value={inputs.xUnit}
              label="X Unit"
              onChange={handleInputChange('xUnit')}
            >
              {distanceUnits.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Distance Between Sets (Y)"
              type="number"
              value={inputs.y}
              onChange={handleInputChange('y')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Y Unit</InputLabel>
            <Select
              value={inputs.yUnit}
              label="Y Unit"
              onChange={handleInputChange('yUnit')}
            >
              {distanceUnits.map((u) => (
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
              {appRateUnits.find(u => u.value === inputs.appRateUnit)?.label || inputs.appRateUnit}
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
            PR = 96.25 × Q<sub>n</sub> × Eff / (X × Y)
          </Box>
        </Box>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 1 }}>
            Where:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ fontSize: 16 }}><b>PR</b> = Precipitation rate (in/hr)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>Q<sub>n</sub></b> = Flow rate of water from nozzle (gpm)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>Eff</b> = Irrigation efficiency (decimal, e.g. 0.7)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>X</b> = Distance between nozzles on line (ft)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>Y</b> = Distance between sets (ft)</Typography>
          </Box>
        </Box>
        <Typography sx={{ fontSize: 13, color: '#888', mt: 2 }}>
          Reference: Washington State University
        </Typography>
      </Box>
    </Paper>
  );
};

export default NozzleApplicationRateCalculator; 