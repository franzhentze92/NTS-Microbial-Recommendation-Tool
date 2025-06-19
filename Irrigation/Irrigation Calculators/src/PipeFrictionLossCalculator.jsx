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

const lengthUnits = [
  { label: 'ft', value: 'ft', toFt: v => v },
  { label: 'm', value: 'm', toFt: v => v * 3.28084 },
];
const flowUnits = [
  { label: 'gpm', value: 'gpm', toGpm: v => v },
  { label: 'lps', value: 'lps', toGpm: v => v * 15.8503 },
];
const diameterUnits = [
  { label: 'in', value: 'in', toIn: v => v },
  { label: 'mm', value: 'mm', toIn: v => v * 0.0393701 },
];
const pipeMaterials = [
  { label: 'PVC', value: 150 },
  { label: 'Aluminum w/ Couplers', value: 120 },
  { label: 'Galv. Steel/Asb.-cement', value: 140 },
  { label: 'Cast Iron/Old Steel', value: 100 },
];
const outputUnits = [
  { label: 'psi', value: 'psi', fromPsi: v => v },
  { label: 'kPa', value: 'kpa', fromPsi: v => v * 6.89476 },
  { label: 'bar', value: 'bar', fromPsi: v => v * 0.0689476 },
  { label: 'm H₂O', value: 'mh2o', fromPsi: v => v * 0.70307 },
];

const fontTitle = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 700, fontSize: 32, color: '#222' };
const fontSection = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 600, fontSize: 20, color: '#8cb43a' };
const fontFormula = { fontFamily: 'monospace', fontWeight: 600, fontSize: 24, background: '#f5f5f5', p: 2, borderRadius: 2, display: 'inline-block' };
const fontText = { fontFamily: 'Roboto, Arial, sans-serif', fontSize: 16, color: '#222' };

function calculatePressureLoss({ length, lengthUnit, flow, flowUnit, diameter, diameterUnit, c, outputUnit }) {
  if (!length || !flow || !diameter || !c) return null;
  const L = lengthUnits.find(u => u.value === lengthUnit).toFt(Number(length));
  const Q = flowUnits.find(u => u.value === flowUnit).toGpm(Number(flow));
  const D = diameterUnits.find(u => u.value === diameterUnit).toIn(Number(diameter));
  const C = Number(c);
  if (L <= 0 || Q <= 0 || D <= 0 || C <= 0) return null;
  // Hazen-Williams: P_loss = 4.53 × L × (Q/C)^1.852 / D^4.857
  const PlossPsi = 4.53 * L * Math.pow(Q / C, 1.852) / Math.pow(D, 4.857);
  const outConv = outputUnits.find(u => u.value === outputUnit).fromPsi;
  return outConv(PlossPsi);
}

const PipeFrictionLossCalculator = () => {
  const [inputs, setInputs] = useState({
    length: '',
    lengthUnit: 'ft',
    flow: '',
    flowUnit: 'gpm',
    diameter: '',
    diameterUnit: 'in',
    c: 150,
    outputUnit: 'psi',
  });
  const [result, setResult] = useState(null);

  const handleInputChange = (field) => (event) => {
    setInputs(prev => ({ ...prev, [field]: event.target.value }));
  };

  useEffect(() => {
    const res = calculatePressureLoss(inputs);
    setResult(res);
  }, [inputs]);

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <BackButton />
      <Typography gutterBottom sx={fontTitle} align="center">
        Pipe Friction Loss
      </Typography>
      <Typography gutterBottom sx={fontText} align="center">
        Calculate the pressure loss due to pipe friction using the Hazen-Williams equation.
      </Typography>
      <Box sx={{ mb: 4 }} />
      <Grid container spacing={3}>
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
              label="Pipe Inside Diameter"
              type="number"
              value={inputs.diameter}
              onChange={handleInputChange('diameter')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
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
            P_loss = 4.53 × L × (Q/C)<sup>1.852</sup> / D<sup>4.857</sup>
          </Box>
        </Box>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 1 }}>
            Where:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ fontSize: 16 }}><b>P_loss</b> = Pressure loss due to friction (psi)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>L</b> = Pipe length (ft)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>Q</b> = Flow rate of water inside pipe (gpm)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>C</b> = Pipe coefficient (material-dependent)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>D</b> = Pipe inside diameter (in)</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default PipeFrictionLossCalculator; 