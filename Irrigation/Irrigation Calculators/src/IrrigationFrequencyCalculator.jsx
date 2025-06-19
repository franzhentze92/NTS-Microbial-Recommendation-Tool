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
  InputAdornment
} from '@mui/material';
import BackButton from './BackButton';

const awcUnits = [
  { label: 'in/ft', value: 'inft' },
  { label: 'mm/m', value: 'mmm' },
];

const rzUnits = [
  { label: 'ft', value: 'ft' },
  { label: 'm', value: 'm' },
  { label: 'cm', value: 'cm' },
  { label: 'mm', value: 'mm' },
  { label: 'in', value: 'in' },
];

const madUnits = [
  { label: 'decimal', value: 'decimal' },
  { label: '%', value: 'percent' },
];

const etcUnits = [
  { label: 'in/day', value: 'inday' },
  { label: 'mm/day', value: 'mmday' },
  { label: 'cm/day', value: 'cmday' },
  { label: 'in/month', value: 'inmonth' },
  { label: 'mm/month', value: 'mmmonth' },
  { label: 'cm/month', value: 'cmmonth' },
];

const freqUnits = [
  { label: 'day', value: 'day' },
  { label: 'hr', value: 'hr' },
];

function convertAwcToInFt(value, unit) {
  switch (unit) {
    case 'inft': return value;
    case 'mmm': return value * 0.012;
    default: return value;
  }
}

function convertRzToFt(value, unit) {
  switch (unit) {
    case 'ft': return value;
    case 'm': return value * 3.28084;
    case 'cm': return value * 0.0328084;
    case 'mm': return value * 0.00328084;
    case 'in': return value / 12;
    default: return value;
  }
}

function convertMadToDecimal(value, unit) {
  switch (unit) {
    case 'decimal': return value;
    case 'percent': return value / 100;
    default: return value;
  }
}

function convertEtcToInDay(value, unit) {
  switch (unit) {
    case 'inday': return value;
    case 'mmday': return value * 0.0393701;
    case 'cmday': return value * 0.393701;
    case 'inmonth': return value / 30;
    case 'mmmonth': return (value * 0.0393701) / 30;
    case 'cmmonth': return (value * 0.393701) / 30;
    default: return value;
  }
}

function convertDayToOutputUnit(value, unit) {
  switch (unit) {
    case 'day': return value;
    case 'hr': return value * 24;
    default: return value;
  }
}

const fontTitle = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 700, fontSize: 32, color: '#222' };
const fontSection = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 600, fontSize: 20, color: '#8cb43a' };
const fontFormula = { fontFamily: 'monospace', fontWeight: 600, fontSize: 24, background: '#f5f5f5', p: 2, borderRadius: 2, display: 'inline-block' };
const fontText = { fontFamily: 'Roboto, Arial, sans-serif', fontSize: 16, color: '#222' };

const IrrigationFrequencyCalculator = () => {
  const [inputs, setInputs] = useState({
    awc: 0,
    awcUnit: 'inft',
    rz: 0,
    rzUnit: 'ft',
    mad: 0,
    madUnit: 'decimal',
    etc: 0,
    etcUnit: 'inday',
    freqUnit: 'day',
  });
  const [result, setResult] = useState(null);

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setInputs((prev) => ({
      ...prev,
      [field]: field.includes('Unit') ? value : Number(value),
    }));
  };

  const handleNumberInputChange = (field) => (event) => {
    const value = event.target.value;
    setInputs((prev) => ({
      ...prev,
      [field]: Number(value),
    }));
  };

  useEffect(() => {
    const awcInFt = convertAwcToInFt(inputs.awc, inputs.awcUnit);
    const rzFt = convertRzToFt(inputs.rz, inputs.rzUnit);
    const madDecimal = convertMadToDecimal(inputs.mad, inputs.madUnit);
    const etcInDay = convertEtcToInDay(inputs.etc, inputs.etcUnit);
    if (awcInFt <= 0 || rzFt <= 0 || madDecimal <= 0 || etcInDay <= 0) {
      setResult(null);
      return;
    }
    const freqDay = (awcInFt * rzFt * madDecimal) / etcInDay;
    const finalFreq = convertDayToOutputUnit(freqDay, inputs.freqUnit);
    setResult(finalFreq);
  }, [inputs]);

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <BackButton />
      <Typography gutterBottom sx={fontTitle} align="center">
        Irrigation Frequency
      </Typography>
      <Typography gutterBottom sx={{ ...fontText, mb: 4 }} align="center">
        Calculate the maximum interval allowed between irrigations based on soil type, root zone depth, and crop water use rate.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Available Water"
              type="number"
              value={inputs.awc}
              onChange={handleNumberInputChange('awc')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Available Water Unit</InputLabel>
            <Select
              value={inputs.awcUnit}
              label="Available Water Unit"
              onChange={handleInputChange('awcUnit')}
            >
              {awcUnits.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Crop Water Use"
              type="number"
              value={inputs.etc}
              onChange={handleNumberInputChange('etc')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Crop Water Use Unit</InputLabel>
            <Select
              value={inputs.etcUnit}
              label="Crop Water Use Unit"
              onChange={handleInputChange('etcUnit')}
            >
              {etcUnits.map((u) => (
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
              {result.toFixed(2)}
            </Typography>
            <Typography sx={{ fontWeight: 700, color: '#8cb43a', fontSize: 24 }}>
              {freqUnits.find(u => u.value === inputs.freqUnit)?.label || inputs.freqUnit}
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
            F = AW / CU
          </Box>
        </Box>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 1 }}>
            Where:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ fontSize: 16 }}>
              <b>F</b> = Irrigation Frequency (days)
            </Typography>
            <Typography sx={{ fontSize: 16 }}>
              <b>AW</b> = Available Water (in)
            </Typography>
            <Typography sx={{ fontSize: 16 }}>
              <b>CU</b> = Crop Water Use (in/day)
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default IrrigationFrequencyCalculator; 