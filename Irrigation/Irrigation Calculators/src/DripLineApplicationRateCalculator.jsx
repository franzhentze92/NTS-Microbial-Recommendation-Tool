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
  { label: 'gal/hr', value: 'gph', toGph: v => v },
  { label: 'lph', value: 'lph', toGph: v => v * 0.264172 },
  { label: 'gpm', value: 'gpm', toGph: v => v * 60 },
];
const spacingUnits = [
  { label: 'in', value: 'in', toIn: v => v },
  { label: 'cm', value: 'cm', toIn: v => v * 0.393701 },
  { label: 'mm', value: 'mm', toIn: v => v * 0.0393701 },
  { label: 'ft', value: 'ft', toIn: v => v * 12 },
];
const appRateUnits = [
  { label: 'in/hr', value: 'inhr', fromInHr: v => v },
  { label: 'mm/hr', value: 'mmhr', fromInHr: v => v * 25.4 },
];

const fontTitle = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 700, fontSize: 32, color: '#222' };
const fontSection = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 600, fontSize: 20, color: '#8cb43a' };
const fontFormula = { fontFamily: 'monospace', fontWeight: 600, fontSize: 24, background: '#f5f5f5', p: 2, borderRadius: 2, display: 'inline-block' };
const fontText = { fontFamily: 'Roboto, Arial, sans-serif', fontSize: 16, color: '#222' };

function calculateDripAppRate({ flow, flowUnit, eff, row, rowUnit, emit, emitUnit, appRateUnit }) {
  if (!flow || !eff || !row || !emit) return null;
  const Qe = flowUnits.find(u => u.value === flowUnit).toGph(Number(flow));
  const Eff = Number(eff);
  const Rowx = spacingUnits.find(u => u.value === rowUnit).toIn(Number(row));
  const Emity = spacingUnits.find(u => u.value === emitUnit).toIn(Number(emit));
  if (Qe <= 0 || Eff <= 0 || Rowx <= 0 || Emity <= 0) return null;
  const PR_inhr = 231 * Qe * Eff / (Rowx * Emity);
  const outConv = appRateUnits.find(u => u.value === appRateUnit).fromInHr;
  return outConv(PR_inhr);
}

const DripLineApplicationRateCalculator = () => {
  const [inputs, setInputs] = useState({
    flow: '',
    flowUnit: 'gph',
    eff: '0.95',
    row: '',
    rowUnit: 'in',
    emit: '',
    emitUnit: 'in',
    appRateUnit: 'inhr',
  });
  const [result, setResult] = useState(null);

  const handleInputChange = (field) => (event) => {
    setInputs(prev => ({ ...prev, [field]: event.target.value }));
  };

  useEffect(() => {
    const res = calculateDripAppRate(inputs);
    setResult(res);
  }, [inputs]);

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <BackButton />
      <Typography gutterBottom sx={fontTitle} align="center">
        Drip Line Application Rate
      </Typography>
      <Typography gutterBottom sx={fontText} align="center">
        Calculate the application (precipitation) rate of a drip line irrigation system.
      </Typography>
      <Box sx={{ mb: 4 }} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Emitter Flow Rate"
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
              helperText="(e.g. 0.95 for drip)"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Distance Between Drip Rows"
              type="number"
              value={inputs.row}
              onChange={handleInputChange('row')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Row Spacing Unit</InputLabel>
            <Select
              value={inputs.rowUnit}
              label="Row Spacing Unit"
              onChange={handleInputChange('rowUnit')}
            >
              {spacingUnits.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Emitter Spacing Along Line"
              type="number"
              value={inputs.emit}
              onChange={handleInputChange('emit')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Emitter Spacing Unit</InputLabel>
            <Select
              value={inputs.emitUnit}
              label="Emitter Spacing Unit"
              onChange={handleInputChange('emitUnit')}
            >
              {spacingUnits.map((u) => (
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
            PR = 231 × Q<sub>e</sub> × Eff / (Row<sub>x</sub> × Emit<sub>y</sub>)
          </Box>
        </Box>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 1 }}>
            Where:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ fontSize: 16 }}><b>PR</b> = Precipitation rate (in/hr)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>Q<sub>e</sub></b> = Drip emitter flow rate (gal/hr)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>Eff</b> = Irrigation efficiency (decimal, e.g. 0.95)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>Row<sub>x</sub></b> = Distance between drip rows (in)</Typography>
            <Typography sx={{ fontSize: 16 }}><b>Emit<sub>y</sub></b> = Emitter spacing along line (in)</Typography>
          </Box>
        </Box>
        <Typography sx={{ fontSize: 13, color: '#888', mt: 2 }}>
          Reference: Washington State University
        </Typography>
      </Box>
    </Paper>
  );
};

export default DripLineApplicationRateCalculator; 