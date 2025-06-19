import React, { useState } from 'react';
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

interface CalculatorInputs {
  systemCapacity: number;
  waterNeeds: number;
  operationHours: number;
  systemEfficiency: number;
  capacityUnit: string;
  waterNeedsUnit: string;
  operationHoursUnit: string;
  areaUnit: string;
}

const IrrigatableAreaCalculator = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    systemCapacity: 0,
    waterNeeds: 0,
    operationHours: 0,
    systemEfficiency: 0.75,
    capacityUnit: 'gpm',
    waterNeedsUnit: 'in/day',
    operationHoursUnit: 'hr',
    areaUnit: 'sq. ft',
  });

  const [result, setResult] = useState<number | null>(null);

  const handleInputChange = (field: keyof CalculatorInputs) => (
    event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
  ) => {
    const value = event.target.value;
    setInputs((prev) => ({
      ...prev,
      [field]: field.includes('Unit') ? value : Number(value),
    }));
  };

  const calculateArea = () => {
    const { systemCapacity, waterNeeds, operationHours, systemEfficiency } = inputs;
    
    // Convert all units to consistent base units
    let capacityInGpm = systemCapacity;
    if (inputs.capacityUnit === 'lps') {
      capacityInGpm = systemCapacity * 15.85; // Convert L/s to GPM
    }

    let waterNeedsInInches = waterNeeds;
    if (inputs.waterNeedsUnit === 'mm/day') {
      waterNeedsInInches = waterNeeds * 0.0393701; // Convert mm to inches
    }

    let hours = operationHours;
    if (inputs.operationHoursUnit === 'min') {
      hours = operationHours / 60;
    } else if (inputs.operationHoursUnit === 'sec') {
      hours = operationHours / 3600;
    }

    // Correct formula: Area (sq ft) = (96.25 * S * hrs * E) / Wn
    const area = (96.25 * capacityInGpm * hours * systemEfficiency) / waterNeedsInInches;

    // Convert to selected area unit
    let finalArea = area;
    switch (inputs.areaUnit) {
      case 'acres':
        finalArea = area / 43560; // 1 acre = 43,560 sq ft
        break;
      case 'hectares':
        finalArea = area / 107639; // 1 hectare = 107,639 sq ft
        break;
      case 'sq. meters':
        finalArea = area * 0.092903; // 1 sq ft = 0.092903 sq meters
        break;
      case 'sq. yd':
        finalArea = area / 9; // 1 sq yd = 9 sq ft
        break;
      case 'sq. km':
        finalArea = area * 0.000000092903; // 1 sq ft = 0.000000092903 sq km
        break;
      case 'sq. mile':
        finalArea = area * 0.0000000358701; // 1 sq ft = 0.0000000358701 sq miles
        break;
    }

    setResult(finalArea);
  };

  const fontTitle = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 700, fontSize: 32, color: '#222' };
  const fontSection = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 600, fontSize: 20, color: '#8cb43a' };
  const fontFormula = { fontFamily: 'monospace', fontWeight: 600, fontSize: 20, background: '#f5f5f5', p: 2, borderRadius: 2, display: 'inline-block' };
  const fontText = { fontFamily: 'Roboto, Arial, sans-serif', fontSize: 16, color: '#222' };
  const fontVar = { fontWeight: 700, color: '#8cb43a' };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography gutterBottom sx={fontTitle} align="center">
        Irrigatable Area As Limited By Water Supply
      </Typography>
      <Typography gutterBottom sx={fontText} align="center">
        This calculator finds the land area that can be irrigated with a given flow of water. The minimum system capacity (supply) is the available water from the supply. The water needs is the peak crop water need during a specific time period. The available hours of operation per day is measured as the available hours for irrigation on a worst case day. The system efficiency is based on the irrigation efficiency and distribution uniformity.
      </Typography>
      <Box sx={{ mb: 4 }} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Minimum System Capacity (Supply)"
              type="number"
              value={inputs.systemCapacity}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setInputs(prev => ({
                  ...prev,
                  systemCapacity: Number(e.target.value)
                }));
                calculateArea();
              }}
              onBlur={calculateArea}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Capacity Unit</InputLabel>
            <Select
              value={inputs.capacityUnit}
              label="Capacity Unit"
              onChange={handleInputChange('capacityUnit')}
              onBlur={calculateArea}
            >
              <MenuItem value="gpm">GPM</MenuItem>
              <MenuItem value="lps">LPS</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Water Needs"
              type="number"
              value={inputs.waterNeeds}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setInputs(prev => ({
                  ...prev,
                  waterNeeds: Number(e.target.value)
                }));
                calculateArea();
              }}
              onBlur={calculateArea}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Water Needs Unit</InputLabel>
            <Select
              value={inputs.waterNeedsUnit}
              label="Water Needs Unit"
              onChange={handleInputChange('waterNeedsUnit')}
              onBlur={calculateArea}
            >
              <MenuItem value="in/day">inches/day</MenuItem>
              <MenuItem value="mm/day">mm/day</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="Operation Hours Per Day"
              type="number"
              value={inputs.operationHours}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setInputs(prev => ({
                  ...prev,
                  operationHours: Number(e.target.value)
                }));
                calculateArea();
              }}
              onBlur={calculateArea}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Time Unit</InputLabel>
            <Select
              value={inputs.operationHoursUnit}
              label="Time Unit"
              onChange={handleInputChange('operationHoursUnit')}
              onBlur={calculateArea}
            >
              <MenuItem value="hr">Hours</MenuItem>
              <MenuItem value="min">Minutes</MenuItem>
              <MenuItem value="sec">Seconds</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <TextField
              label="System Efficiency (%)"
              type="number"
              value={inputs.systemEfficiency * 100}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setInputs(prev => ({
                  ...prev,
                  systemEfficiency: Number(e.target.value) / 100
                }));
                calculateArea();
              }}
              onBlur={calculateArea}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Area Unit</InputLabel>
            <Select
              value={inputs.areaUnit}
              label="Area Unit"
              onChange={handleInputChange('areaUnit')}
              onBlur={calculateArea}
            >
              <MenuItem value="sq. ft">Square Feet</MenuItem>
              <MenuItem value="acres">Acres</MenuItem>
              <MenuItem value="hectares">Hectares</MenuItem>
              <MenuItem value="sq. meters">Square Meters</MenuItem>
              <MenuItem value="sq. yd">Square Yards</MenuItem>
              <MenuItem value="sq. km">Square Kilometers</MenuItem>
              <MenuItem value="sq. mile">Square Miles</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      {result !== null && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Irrigated Area:
          </Typography>
          <Typography variant="h4" color="primary">
            {result.toFixed(2)} {inputs.areaUnit}
          </Typography>
        </Box>
      )}
      <Box sx={{ mt: 6 }}>
        <Typography sx={fontSection} gutterBottom align="center">
          The Equation
        </Typography>
        <Typography sx={fontText} align="center" gutterBottom>
          This calculator uses this formula to determine the Irrigatable area.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Box sx={fontFormula}>
            A = (96.25 × S × hrs × E) / Wₙ
          </Box>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={fontText} align="center"><Box component="span" sx={fontVar}>A</Box> = Irrigatable Area (sq. ft)</Typography>
          <Typography sx={fontText} align="center"><Box component="span" sx={fontVar}>S</Box> = Minimum system capacity, or supply (gpm)</Typography>
          <Typography sx={fontText} align="center"><Box component="span" sx={fontVar}>Wₙ</Box> = Water needs (in/day)</Typography>
          <Typography sx={fontText} align="center"><Box component="span" sx={fontVar}>hrs</Box> = Operation hours per day (hrs)</Typography>
          <Typography sx={fontText} align="center"><Box component="span" sx={fontVar}>E</Box> = System Efficiency (as a decimal)</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default IrrigatableAreaCalculator; 