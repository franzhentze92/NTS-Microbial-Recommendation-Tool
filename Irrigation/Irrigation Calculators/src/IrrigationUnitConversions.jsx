import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Grid,
  Tabs,
  Tab
} from '@mui/material';
import BackButton from './BackButton';

// Conversion factors and helper functions for each category
const conversions = {
  'Flow Rate': {
    // Base unit: liters per second (lps)
    'lps': 1,
    'lpm': 1/60,
    'lph': 1/3600,
    'gpm': 0.0630902,
    'gph': 0.0010515,
    'gpd': 0.0000438125,
    'cf/s': 0.0283168,
    'cfm': 0.000471947,
    'cu. m/hr': 0.000277778,
    'cu. yd/min': 0.0127426,
    'mgd': 0.0438125,
    'acre-in/day': 0.0142764,
    'acre-in/hour': 0.342634,
    'acre-ft/day': 0.0142764,
    'cms': 0.001
  },
  'Area': {
    // Base unit: square meters
    'sq. meter': 1,
    'acre': 4046.86,
    'sq. in.': 0.00064516,
    'sq. ft.': 0.092903,
    'hectare': 10000,
    'sq. cm.': 0.0001,
    'sq. yd': 0.836127,
    'sq. km': 1000000,
    'sq. mile': 2589988.11
  },
  'Distance': {
    // Base unit: meters
    'm': 1,
    'ft': 0.3048,
    'in': 0.0254,
    'mm': 0.001,
    'cm': 0.01,
    'yd': 0.9144,
    'mile': 1609.344,
    'km': 1000
  },
  'Time': {
    // Base unit: seconds
    'sec': 1,
    'min': 60,
    'hr': 3600,
    'day': 86400,
    'week': 604800,
    'month': 2592000,
    'yr': 31536000
  },
  'Volume': {
    // Base unit: cubic meters
    'cu. meter': 1,
    'cu. in.': 0.0000163871,
    'cu. ft.': 0.0283168,
    'cu. yd': 0.764555,
    'gal': 0.00378541,
    'gal UK': 0.00454609,
    'ml': 0.000001,
    'liter': 0.001,
    'acre-in': 102.790,
    'acre-ft': 1233.48,
    'hectare-mm': 10,
    'hectare-m': 10000,
    'cups': 0.000236588,
    'quarts': 0.000946353
  },
  'Pressure': {
    // Base unit: Pascal (Pa)
    'psi': 6894.76,
    'bar': 100000,
    'milli bar': 100,
    'kPa': 1000,
    'atm': 101325,
    'in of Mercury': 3386.39,
    'ft of water': 2989.07,
    'm of water': 9806.65
  },
  'Power': {
    // Base unit: Watts
    'hp': 745.7,
    'kW': 1000,
    'BTU/min': 17.5843,
    'BTU/hr': 0.293071
  },
  'Precipitation': {
    // Base unit: mm/hr
    'mm/hr': 1,
    'mm/month': 1/720,
    'mm/day': 1/24,
    'in/hr': 25.4,
    'in/day': 1.05833,
    'in/month': 0.0352778,
    'gpm/acre': 0.00160417,
    'cfs/acre': 0.09625,
    'lps/ha': 0.0001,
    'cms/ha': 0.1
  },
  'Salinity': {
    // Base unit: dS/m
    'dS/m': 1,
    'mS/cm': 1,
    'microS/cm': 0.001,
    'mg/l': 0.001,
    'ppm': 0.001,
    'tons/acre-ft': 0.000001
  },
  'Speed': {
    // Base unit: meters per second
    'meters/sec': 1,
    'meters/min': 1/60,
    'meters/hr': 1/3600,
    'ft/min': 0.00508,
    'ft/sec': 0.3048,
    'ft/hr': 0.0000846667,
    'in/min': 0.000423333,
    'mph': 0.44704,
    'km/hr': 0.277778
  }
};

// Define all unit lists for each category
const unitCategories = [
  {
    label: 'Flow Rate',
    units: [
      'lps', 'lpm', 'lph', 'gpm', 'gph', 'gpd', 'cf/s', 'cfm', 'cu. m/hr', 'cu. yd/min', 'mgd', 'acre-in/day', 'acre-in/hour', 'acre-ft/day', 'cms'
    ]
  },
  {
    label: 'Area',
    units: [
      'acre', 'sq. in.', 'sq. ft.', 'hectare', 'sq. cm.', 'sq. meter', 'sq. yd', 'sq. km', 'sq. mile'
    ]
  },
  {
    label: 'Distance',
    units: [
      'ft', 'in', 'mm', 'cm', 'm', 'yd', 'mile', 'km'
    ]
  },
  {
    label: 'Time',
    units: [
      'sec', 'min', 'hr', 'day', 'week', 'month', 'yr'
    ]
  },
  {
    label: 'Volume',
    units: [
      'cu. in.', 'cu. ft.', 'cu. yd', 'gal', 'gal UK', 'cu. meter', 'ml', 'liter', 'acre-in', 'acre-ft', 'hectare-mm', 'hectare-m', 'cups', 'quarts'
    ]
  },
  {
    label: 'Pressure',
    units: [
      'psi', 'bar', 'milli bar', 'kPa', 'atm', 'in of Mercury', 'ft of water', 'm of water'
    ]
  },
  {
    label: 'Power',
    units: [
      'hp', 'kW', 'BTU/min', 'BTU/hr'
    ]
  },
  {
    label: 'Precipitation',
    units: [
      'mm/hr', 'mm/month', 'mm/day', 'in/hr', 'in/day', 'in/month', 'gpm/acre', 'cfs/acre', 'lps/ha', 'cms/ha'
    ]
  },
  {
    label: 'Salinity',
    units: [
      'dS/m', 'mS/cm', 'microS/cm', 'mg/l', 'ppm', 'tons/acre-ft'
    ]
  },
  {
    label: 'Speed',
    units: [
      'meters/sec', 'meters/min', 'meters/hr', 'ft/min', 'ft/sec', 'ft/hr', 'in/min', 'mph', 'km/hr'
    ]
  }
];

const fontTitle = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 700, fontSize: 32, color: '#222' };
const fontSection = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 600, fontSize: 20, color: '#8cb43a' };
const fontFormula = { fontFamily: 'monospace', fontWeight: 600, fontSize: 20, background: '#f5f5f5', p: 2, borderRadius: 2, display: 'inline-block' };
const fontText = { fontFamily: 'Roboto, Arial, sans-serif', fontSize: 16, color: '#222' };

const IrrigationUnitConversions = () => {
  const [tab, setTab] = useState(0);
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [result, setResult] = useState('');

  // Conversion logic
  const handleConvert = (val, from, to) => {
    const category = unitCategories[tab].label;
    const conversionFactors = conversions[category];
    
    if (!conversionFactors) {
      setResult('Error: Invalid category');
      return;
    }

    const fromFactor = conversionFactors[from];
    const toFactor = conversionFactors[to];

    if (!fromFactor || !toFactor) {
      setResult('Error: Invalid units');
      return;
    }

    const numValue = parseFloat(val);
    if (isNaN(numValue)) {
      setResult('Error: Invalid value');
      return;
    }

    // Convert to base unit, then to target unit
    const baseValue = numValue * fromFactor;
    const convertedValue = baseValue / toFactor;

    // Format the result with appropriate precision
    const formattedResult = convertedValue.toFixed(6).replace(/\.?0+$/, '');
    setResult(`${formattedResult} ${to}`);
  };

  // When any input changes, recalculate
  useEffect(() => {
    if (value && fromUnit && toUnit) {
      handleConvert(value, fromUnit, toUnit);
    } else {
      setResult('');
    }
  }, [value, fromUnit, toUnit, tab]);

  // When tab changes, reset units and value
  const handleTabChange = (_, newValue) => {
    setTab(newValue);
    setValue('');
    setFromUnit('');
    setToUnit('');
    setResult('');
  };

  const currentCategory = unitCategories[tab];

  return (
    <Paper sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
      <BackButton />
      <Typography gutterBottom sx={fontTitle} align="center">
        Irrigation Unit Conversions
      </Typography>
      <Typography gutterBottom sx={{ ...fontText, mb: 4 }} align="center">
        Convert between different units commonly used in irrigation calculations.
      </Typography>

      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}
      >
        {unitCategories.map((cat) => (
          <Tab key={cat.label} label={cat.label} />
        ))}
      </Tabs>

      <Box sx={{ mt: 3 }}>
        <Grid container spacing={3} alignItems="center" justifyContent="center">
          <Grid item xs={12} sm={3}>
            <TextField
              label="Value"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              fullWidth
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              select
              label="From Unit"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              fullWidth
            >
              {currentCategory.units.map(u => (
                <MenuItem key={u} value={u}>{u}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={1}>
            <Typography align="center" sx={{ fontSize: 18, fontWeight: 600, color: '#8cb43a' }}>
              to
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              select
              label="To Unit"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              fullWidth
            >
              {currentCategory.units.map(u => (
                <MenuItem key={u} value={u}>{u}</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        {/* Result display */}
        {result && (
          <Box sx={{ mt: 6, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography sx={{ ...fontSection, mb: 1 }} align="center">
              Result:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3, bgcolor: '#f5f5f5', borderRadius: 2, minWidth: 250, textAlign: 'center' }}>
              <Typography sx={{ ...fontFormula, fontSize: 28, mb: 0 }}>
                {result}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Category description */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 1 }}>
            {currentCategory.label} Units
          </Typography>
          <Typography sx={{ fontSize: 14, color: '#666' }}>
            Select a value and choose the units you want to convert between
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default IrrigationUnitConversions; 