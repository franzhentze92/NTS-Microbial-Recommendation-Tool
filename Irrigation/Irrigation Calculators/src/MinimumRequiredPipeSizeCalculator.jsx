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
  { label: 'lps', value: 'lps', toGpm: v => v * 15.8503 },
];
const lengthUnits = [
  { label: 'ft', value: 'ft', toFt: v => v },
  { label: 'm', value: 'm', toFt: v => v * 3.28084 },
];
const pressureUnits = [
  { label: 'psi', value: 'psi', toPsi: v => v },
  { label: 'kPa', value: 'kpa', toPsi: v => v * 0.145038 },
  { label: 'bar', value: 'bar', toPsi: v => v * 14.5038 },
  { label: 'm H₂O', value: 'mh2o', toPsi: v => v * 1.42233 },
];
const diameterUnits = [
  { label: 'in', value: 'in', fromIn: v => v, toIn: v => v },
  { label: 'mm', value: 'mm', fromIn: v => v * 25.4, toIn: v => v / 25.4 },
];
const pipeMaterials = [
  { label: 'PVC', value: 150 },
  { label: 'Aluminum w/ Couplers', value: 120 },
  { label: 'Galv. Steel/Asb.-cement', value: 140 },
  { label: 'Cast Iron/Old Steel', value: 100 },
];

const fontTitle = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 700, fontSize: 32, color: '#222' };
const fontSection = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 600, fontSize: 20, color: '#8cb43a' };
const fontFormula = { fontFamily: 'monospace', fontWeight: 600, fontSize: 24, background: '#f5f5f5', p: 2, borderRadius: 2, display: 'inline-block' };
const fontText = { fontFamily: 'Roboto, Arial, sans-serif', fontSize: 16, color: '#222' };

function calculateMinPipeDiameter({ flow, flowUnit, length, lengthUnit, c, maxLoss, maxLossUnit, diameterUnit }) {
  if (!flow || !length || !c || !maxLoss) return null;
  const Q = flowUnits.find(u => u.value === flowUnit).toGpm(Number(flow));
  const L = lengthUnits.find(u => u.value === lengthUnit).toFt(Number(length));
  const C = Number(c);
  const Ploss = pressureUnits.find(u => u.value === maxLossUnit).toPsi(Number(maxLoss));
  if (Q <= 0 || L <= 0 || C <= 0 || Ploss <= 0) return null;
  // D = [4.53 * L * (Q/C)^1.852 / Ploss]^(1/4.857)
  const numerator = 4.53 * L * Math.pow(Q / C, 1.852);
  const D_in = Math.pow(numerator / Ploss, 1 / 4.857);
  const outConv = diameterUnits.find(u => u.value === diameterUnit).fromIn;
  return outConv(D_in);
}

const MinimumRequiredPipeSizeCalculator = () => {
  const [inputs, setInputs] = useState({
    flow: '',
    flowUnit: 'gpm',
    length: '',
    lengthUnit: 'ft',
    c: 150,
    maxLoss: '',
    maxLossUnit: 'psi',
    diameterUnit: 'in',
  });
  const [result, setResult] = useState(null);

  const handleInputChange = (field) => (event) => {
    setInputs(prev => ({ ...prev, [field]: event.target.value }));
  };

  useEffect(() => {
    const res = calculateMinPipeDiameter(inputs);
    setResult(res);
  }, [inputs]);

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <BackButton />
      <Typography gutterBottom sx={fontTitle} align="center">
        Minimum Required Pipe Size
      </Typography>
      <Typography gutterBottom sx={fontText} align="center">
        Calculate the minimum required pipe diameter for a given flow, length, material, and allowable pressure loss.
      </Typography>
      <Box sx={{ mb: 4 }} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Flow Rate"
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
              label="Pipe Length"
              type="number"
              value={inputs.length}
              onChange={handleInputChange('length')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Length Unit</InputLabel>
            <Select
              value={inputs.lengthUnit}
              label="Length Unit"
              onChange={handleInputChange('lengthUnit')}
            >
              {lengthUnits.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Pipe Material</InputLabel>
            <Select
              value={inputs.c}
              label="Pipe Material"
              onChange={handleInputChange('c')}
            >
              {pipeMaterials.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Max Allowable Pressure Loss"
              type="number"
              value={inputs.maxLoss}
              onChange={handleInputChange('maxLoss')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Pressure Loss Unit</InputLabel>
            <Select
              value={inputs.maxLossUnit}
              label="Pressure Loss Unit"
              onChange={handleInputChange('maxLossUnit')}
            >
              {pressureUnits.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Diameter Unit</InputLabel>
            <Select
              value={inputs.diameterUnit}
              label="Diameter Unit"
              onChange={handleInputChange('diameterUnit')}
            >
              {diameterUnits.map((u) => (
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
                value={inputs.diameterUnit}
                onChange={handleInputChange('diameterUnit')}
                sx={{ fontWeight: 600, color: '#8cb43a', minWidth: 100 }}
              >
                {diameterUnits.map((u) => (
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
            D = [4.53 × L × (Q/C)<sup>1.852</sup> / P_loss]<sup>1/4.857</sup>
          </Box>
        </Box>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 1 }}>
            Where:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ fontSize: 16 }}><b>D</b> = Minimum required pipe diameter (in)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>L</b> = Pipe length (ft)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>Q</b> = Flow rate of water inside pipe (gpm)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>C</b> = Pipe coefficient (material-dependent)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>P_loss</b> = Max allowable pressure loss (psi)</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default MinimumRequiredPipeSizeCalculator; 