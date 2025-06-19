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

interface Inputs {
  awc: number;
  awcUnit: string;
  rz: number;
  rzUnit: string;
  mad: number;
  madUnit: string;
  etc: number;
  etcUnit: string;
  freqUnit: string;
}

function convertAwcToInFt(value: number, unit: string): number {
  switch (unit) {
    case 'inft': return value;
    case 'mmm': return value * 0.012;
    default: return value;
  }
}

function convertRzToFt(value: number, unit: string): number {
  switch (unit) {
    case 'ft': return value;
    case 'm': return value * 3.28084;
    case 'cm': return value * 0.0328084;
    case 'mm': return value * 0.00328084;
    case 'in': return value / 12;
    default: return value;
  }
}

function convertMadToDecimal(value: number, unit: string): number {
  switch (unit) {
    case 'decimal': return value;
    case 'percent': return value / 100;
    default: return value;
  }
}

function convertEtcToInDay(value: number, unit: string): number {
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

function convertDayToOutputUnit(value: number, unit: string): number {
  switch (unit) {
    case 'day': return value;
    case 'hr': return value * 24;
    default: return value;
  }
}

const fontTitle = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 700, fontSize: 32, color: '#222' };
const fontSection = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 600, fontSize: 20, color: '#8cb43a' };
const fontFormula = { fontFamily: 'monospace', fontWeight: 600, fontSize: 20, background: '#f5f5f5', p: 2, borderRadius: 2, display: 'inline-block' };
const fontText = { fontFamily: 'Roboto, Arial, sans-serif', fontSize: 16, color: '#222' };
const fontVar = { fontWeight: 700, color: '#8cb43a' };

const IrrigationFrequencyCalculator = () => {
  const [inputs, setInputs] = useState<Inputs>({
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
    calculateFrequency();
    // eslint-disable-next-line
  }, [inputs]);

  const calculateFrequency = () => {
    const awcInFt = convertAwcToInFt(inputs.awc, inputs.awcUnit);
    const rzFt = convertRzToFt(inputs.rz, inputs.rzUnit);
    const madDecimal = convertMadToDecimal(inputs.mad, inputs.madUnit);
    const etcInDay = convertEtcToInDay(inputs.etc, inputs.etcUnit);
    if (awcInFt <= 0 || rzFt <= 0 || madDecimal <= 0 || etcInDay <= 0) {
      setResult(null);
      return;
    }
    // F = (AWC * Rz * MAD) / ETc
    const freqDay = (awcInFt * rzFt * madDecimal) / etcInDay;
    const finalFreq = convertDayToOutputUnit(freqDay, inputs.freqUnit);
    setResult(finalFreq);
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography gutterBottom sx={fontTitle} align="center">
        Irrigation Frequency
      </Typography>
      <Typography gutterBottom sx={fontText} align="center">
        This calculates the maximum interval allowed between irrigations. This is dependent on soil type, root zone depth, and the water use rate of the crop.
      </Typography>
      <Box sx={{ mb: 4 }} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Soil's Available Water Holding Capacity"
              type="number"
              value={inputs.awc}
              onChange={handleNumberInputChange('awc')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>AWC Unit</InputLabel>
            <Select
              value={inputs.awcUnit}
              label="AWC Unit"
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
              label="Root Zone Depth"
              type="number"
              value={inputs.rz}
              onChange={handleNumberInputChange('rz')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Rz Unit</InputLabel>
            <Select
              value={inputs.rzUnit}
              label="Rz Unit"
              onChange={handleInputChange('rzUnit')}
            >
              {rzUnits.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Management Allowable Depletion"
              type="number"
              value={inputs.mad}
              onChange={handleNumberInputChange('mad')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>MAD Unit</InputLabel>
            <Select
              value={inputs.madUnit}
              label="MAD Unit"
              onChange={handleInputChange('madUnit')}
            >
              {madUnits.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Crop Water Use Rate"
              type="number"
              value={inputs.etc}
              onChange={handleNumberInputChange('etc')}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>ETc Unit</InputLabel>
            <Select
              value={inputs.etcUnit}
              label="ETc Unit"
              onChange={handleInputChange('etcUnit')}
            >
              {etcUnits.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Frequency Unit</InputLabel>
            <Select
              value={inputs.freqUnit}
              label="Frequency Unit"
              onChange={handleInputChange('freqUnit')}
            >
              {freqUnits.map((u) => (
                <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      {result !== null && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Suggested Irrigation Frequency:
          </Typography>
          <Typography variant="h4" color="primary">
            {result.toFixed(2)} {freqUnits.find(u => u.value === inputs.freqUnit)?.label}
          </Typography>
        </Box>
      )}
      <Box sx={{ mt: 6 }}>
        <Typography sx={fontSection} gutterBottom align="center">
          The Equation
        </Typography>
        <Typography sx={fontText} align="center" gutterBottom>
          This is the formula this calculator uses to determine the suggested irrigation frequency.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Box sx={fontFormula}>
            F = (AWC × Rz × MAD) / ETc
          </Box>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={fontText} align="center"><Box component="span" sx={fontVar}>F</Box> = Suggested irrigation frequency (day)</Typography>
          <Typography sx={fontText} align="center"><Box component="span" sx={fontVar}>AWC</Box> = Soil's available water holding capacity (in/ft)</Typography>
          <Typography sx={fontText} align="center"><Box component="span" sx={fontVar}>Rz</Box> = Root Zone Depth (ft)</Typography>
          <Typography sx={fontText} align="center"><Box component="span" sx={fontVar}>MAD</Box> = Management Allowable Depletion</Typography>
          <Typography sx={fontText} align="center"><Box component="span" sx={fontVar}>ETc</Box> = Crop water use rate (in/day)</Typography>
        </Box>
        <Typography sx={{ fontSize: 14, color: '#8cb43a', fontWeight: 600, letterSpacing: 1, mt: 2 }} align="center">
          Reference: Washington State University
        </Typography>
      </Box>
    </Paper>
  );
};

export default IrrigationFrequencyCalculator; 