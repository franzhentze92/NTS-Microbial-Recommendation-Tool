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

const flowUnits = [
  { label: 'gpm', value: 'gpm', toGpm: v => v, fromGpm: v => v },
  { label: 'lpm', value: 'lpm', toGpm: v => v * 0.264172, fromGpm: v => v / 0.264172 },
];
const diameterUnits = [
  { label: 'in', value: 'in', toIn: v => v, fromIn: v => v },
  { label: 'mm', value: 'mm', toIn: v => v * 0.0393701, fromIn: v => v / 0.0393701 },
];
const pressureUnits = [
  { label: 'psi', value: 'psi', toPsi: v => v, fromPsi: v => v },
  { label: 'bar', value: 'bar', toPsi: v => v * 14.5038, fromPsi: v => v / 14.5038 },
  { label: 'kPa', value: 'kpa', toPsi: v => v * 0.145038, fromPsi: v => v / 0.145038 },
];

const fontTitle = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 700, fontSize: 32, color: '#222' };
const fontSection = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 600, fontSize: 20, color: '#8cb43a' };
const fontFormula = { fontFamily: 'monospace', fontWeight: 600, fontSize: 24, background: '#f5f5f5', p: 2, borderRadius: 2, display: 'inline-block' };
const fontText = { fontFamily: 'Roboto, Arial, sans-serif', fontSize: 16, color: '#222' };

function calculateQn({ diameter, diameterUnit, pressure, pressureUnit, flowUnit }) {
  if (!diameter || !pressure) return null;
  const D = diameterUnits.find(u => u.value === diameterUnit).toIn(Number(diameter));
  const P = pressureUnits.find(u => u.value === pressureUnit).toPsi(Number(pressure));
  if (D <= 0 || P <= 0) return null;
  const Qn_gpm = 28.9 * D * D * Math.sqrt(P);
  const outConv = flowUnits.find(u => u.value === flowUnit).fromGpm;
  return outConv(Qn_gpm);
}

function calculateD({ flow, flowUnit, pressure, pressureUnit, diameterUnit }) {
  if (!flow || !pressure) return null;
  const Qn = flowUnits.find(u => u.value === flowUnit).toGpm(Number(flow));
  const P = pressureUnits.find(u => u.value === pressureUnit).toPsi(Number(pressure));
  if (Qn <= 0 || P <= 0) return null;
  const D_in = Math.sqrt(Qn / (28.9 * Math.sqrt(P)));
  const outConv = diameterUnits.find(u => u.value === diameterUnit).fromIn;
  return outConv(D_in);
}

const NozzleFlowRateDiameterCalculator = () => {
  const [mode, setMode] = useState('flow'); // 'flow' or 'diameter'
  const [inputs, setInputs] = useState({
    diameter: '',
    diameterUnit: 'in',
    flow: '',
    flowUnit: 'gpm',
    pressure: '',
    pressureUnit: 'psi',
  });
  const [outputUnit, setOutputUnit] = useState('gpm');
  const [result, setResult] = useState(null);

  useEffect(() => {
    let res = null;
    if (mode === 'flow') {
      res = calculateQn({
        diameter: inputs.diameter,
        diameterUnit: inputs.diameterUnit,
        pressure: inputs.pressure,
        pressureUnit: inputs.pressureUnit,
        flowUnit: outputUnit,
      });
    } else {
      res = calculateD({
        flow: inputs.flow,
        flowUnit: inputs.flowUnit,
        pressure: inputs.pressure,
        pressureUnit: inputs.pressureUnit,
        diameterUnit: outputUnit,
      });
    }
    setResult(res);
  }, [inputs, outputUnit, mode]);

  const handleInputChange = (field) => (event) => {
    setInputs(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleModeChange = (event, newMode) => {
    if (newMode) setMode(newMode);
    setResult(null);
    setInputs({
      diameter: '',
      diameterUnit: 'in',
      flow: '',
      flowUnit: 'gpm',
      pressure: '',
      pressureUnit: 'psi',
    });
    setOutputUnit(newMode === 'flow' ? 'gpm' : 'in');
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 700, mx: 'auto' }}>
      <BackButton />
      <Typography gutterBottom sx={fontTitle} align="center">
        Nozzle Flow Rate / Diameter Calculator
      </Typography>
      <Typography gutterBottom sx={fontText} align="center">
        Calculate the flow rate from a nozzle or the required nozzle diameter for a given pressure.
      </Typography>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          color="primary"
        >
          <ToggleButton value="flow">Calculate Flow Rate</ToggleButton>
          <ToggleButton value="diameter">Calculate Required Diameter</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ mb: 2 }} />
      <Grid container spacing={3}>
        {mode === 'flow' ? (
          <>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <TextField
                  label="Nozzle Diameter"
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
                <TextField
                  label="Pressure at Nozzle"
                  type="number"
                  value={inputs.pressure}
                  onChange={handleInputChange('pressure')}
                />
              </FormControl>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Pressure Unit</InputLabel>
                <Select
                  value={inputs.pressureUnit}
                  label="Pressure Unit"
                  onChange={handleInputChange('pressureUnit')}
                >
                  {pressureUnits.map((u) => (
                    <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Flow Rate Unit</InputLabel>
                <Select
                  value={outputUnit}
                  label="Flow Rate Unit"
                  onChange={e => setOutputUnit(e.target.value)}
                >
                  {flowUnits.map((u) => (
                    <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </>
        ) : (
          <>
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
                  label="Pressure at Nozzle"
                  type="number"
                  value={inputs.pressure}
                  onChange={handleInputChange('pressure')}
                />
              </FormControl>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Pressure Unit</InputLabel>
                <Select
                  value={inputs.pressureUnit}
                  label="Pressure Unit"
                  onChange={handleInputChange('pressureUnit')}
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
                  value={outputUnit}
                  label="Diameter Unit"
                  onChange={e => setOutputUnit(e.target.value)}
                >
                  {diameterUnits.map((u) => (
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
            <Typography sx={{ fontWeight: 700, color: '#8cb43a', fontSize: 24 }}>
              {(mode === 'flow'
                ? flowUnits.find(u => u.value === outputUnit)?.label
                : diameterUnits.find(u => u.value === outputUnit)?.label) || outputUnit}
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
              ? 'Qₙ = 28.9 × D² × √P'
              : 'D = √[Qₙ / (28.9 × √P)]'}
          </Box>
        </Box>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 1 }}>
            Where:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ fontSize: 16 }}><b>Qₙ</b> = Flow rate of water from nozzle (gpm)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>D</b> = Nozzle diameter (in)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>P</b> = Pressure at nozzle (psi)</Typography>
          </Box>
        </Box>
        <Typography sx={{ fontSize: 13, color: '#888', mt: 2 }}>
          Reference: Washington State University
        </Typography>
      </Box>
    </Paper>
  );
};

export default NozzleFlowRateDiameterCalculator; 