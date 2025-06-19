import React from 'react';
import { Paper, Typography, Box, Divider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BackButton from './BackButton';

const units = [
  {
    title: 'Area',
    items: [
      { unit: 'acre', desc: '43,560 square feet' },
      { unit: 'hectare', desc: 'metric measure of area = 10,000 square meters (100m x 100m area). There are about 2.5 acres in one hectare.' },
      { unit: 'sq. cm', desc: 'square centimeters' },
      { unit: 'sq. ft', desc: 'square feet' },
      { unit: 'sq. in', desc: 'square inches' },
      { unit: 'sq. meter', desc: 'square meters' },
      { unit: 'sq. mile', desc: 'square miles. There are 640 acres in a square mile.' },
    ],
  },
  {
    title: 'Distance',
    items: [
      { unit: 'cm', desc: 'centimeters' },
      { unit: 'ft', desc: 'foot (singular), feet (plural)' },
      { unit: 'in', desc: 'inches' },
      { unit: 'km', desc: 'kilometers' },
      { unit: 'mile', desc: '1 mile = 5280 ft' },
      { unit: 'mm', desc: 'millimeters' },
      { unit: 'm', desc: 'meters' },
      { unit: 'yd', desc: 'yard' },
    ],
  },
  {
    title: 'Flow Rate',
    items: [
      { unit: 'acre-ft/day', desc: 'flow that would cover a perfectly flat acre of land one-foot deep in one day' },
      { unit: 'acre-in/day', desc: 'flow that would cover a perfectly flat acre of land one-inch deep in one day' },
      { unit: 'acre-in/hr', desc: 'flow that would cover a perfectly flat acre of land one-inch deep in one hour. This is approximately equal to 1 cfs.' },
      { unit: 'cf/s', desc: 'cubic feet per second. There are about 450 gpm in 1 cfs. 1 cfs is about 1 acre-in/hr.' },
      { unit: 'cfm', desc: 'cubic feet per minute' },
      { unit: 'cms', desc: 'cubic meters per second (1 cms is a lot of water! About 16,000 gpm.)' },
      { unit: 'cu. m/hr', desc: 'cubic meters per hour' },
      { unit: 'cu. yd/min', desc: 'cubic yards per minute' },
      { unit: 'gpd', desc: 'gallons per day' },
      { unit: 'gph', desc: 'gallons per hour. Typically used for drip emitter flow rates.' },
      { unit: 'gpm', desc: 'gallons per minute' },
      { unit: 'mgd', desc: 'million gallons per day' },
      { unit: 'lph', desc: 'liters per hour' },
      { unit: 'lpm', desc: 'liters per minute' },
      { unit: 'lps', desc: 'metric liters per second. 1 lps is about 16 gallons per minute.' },
    ],
  },
  {
    title: 'Power',
    items: [
      { unit: 'BTU/hr', desc: 'British thermal units per hour' },
      { unit: 'BTU/min', desc: 'British thermal units per minute' },
      { unit: 'hp', desc: 'horsepower' },
      { unit: 'kW', desc: 'kilowatts' },
    ],
  },
  {
    title: 'Precipitation',
    items: [
      { unit: 'cfs/acre', desc: 'cubic feet per second per acre' },
      { unit: 'cm/day', desc: 'centimeters per day' },
      { unit: 'cm/hr', desc: 'centimeters per hour' },
      { unit: 'cm/month', desc: 'centimeters per month' },
      { unit: 'cms/ha', desc: 'cubic meters per second per hectare' },
      { unit: 'gpm/acre', desc: 'gallons per minute per acre. This is commonly used to design irrigation systems.' },
      { unit: 'in/day', desc: 'inches per day' },
      { unit: 'in/hr', desc: 'inches per hour. This is a common measurement of an irrigation system\'s application rate.' },
      { unit: 'in/month', desc: 'inches per month' },
      { unit: 'lps/ha', desc: 'liters per second per hectare' },
      { unit: 'mm/day', desc: 'millimeters per day' },
      { unit: 'mm/hr', desc: 'millimeters per hour' },
      { unit: 'mm/month', desc: 'millimeters per month' },
    ],
  },
  {
    title: 'Pressure',
    items: [
      { unit: 'atm', desc: 'Atmospheres. Equal to about 14.7 pounds per square inch.' },
      { unit: 'bar', desc: '1 bar is 100 kilopascals of pressure.' },
      { unit: 'milli bar', desc: 'One thousandth of a bar.' },
      { unit: 'ft of water', desc: 'Feet of water. Also known as feet of head. The pressure at the bottom of the given depth of water in feet.' },
      { unit: 'in of Mercury', desc: 'Inches of mercury. Pressure at the bottom of the given depth of mercury in inches.' },
      { unit: 'kPa', desc: 'Kilopascals. 1000 pascals.' },
      { unit: 'm of water', desc: 'meters of water. The pressure at the bottom of the given depth of water in meters.' },
      { unit: 'psi', desc: 'pounds per square inch. Sometimes referred to colloquially as "pounds of pressure".' },
    ],
  },
  {
    title: 'Salinity',
    items: [
      { unit: 'dS/m', desc: 'deci-siemens per meter. A measurement of electrical conductivity (EC).' },
      { unit: 'microS/cm', desc: 'micro-siemens per centimeter' },
      { unit: 'mg/l', desc: 'milligrams of dissolved salt per liter of liquid.' },
      { unit: 'mS/cm', desc: 'milli-siemens per centimeter' },
      { unit: 'ppm', desc: 'parts per million. Parts of salt per million parts of the total solution.' },
      { unit: 'tons/acre-ft', desc: 'tons of salt per acre-foot of water' },
    ],
  },
  {
    title: 'Speed',
    items: [
      { unit: 'ft/hr', desc: 'feet per hour' },
      { unit: 'ft/min', desc: 'feet per minute' },
      { unit: 'ft/sec', desc: 'feet per second' },
      { unit: 'in/min', desc: 'inches per minute' },
      { unit: 'km/hr', desc: 'kilometers per hour' },
      { unit: 'meters/hr', desc: 'meters per hour' },
      { unit: 'meters/min', desc: 'meters per minute' },
      { unit: 'meters/sec', desc: 'meters per second' },
      { unit: 'mph', desc: 'miles per hour' },
    ],
  },
  {
    title: 'Time',
    items: [
      { unit: 'sec', desc: 'seconds' },
      { unit: 'min', desc: 'minutes' },
      { unit: 'hr', desc: 'hours' },
      { unit: 'day', desc: 'days' },
      { unit: 'week', desc: 'weeks' },
      { unit: 'month', desc: 'months' },
      { unit: 'yr', desc: 'years' },
    ],
  },
  {
    title: 'Volume',
    items: [
      { unit: 'acre-ft', desc: 'amount of water that would cover a perfectly flat acre of land one-foot deep' },
      { unit: 'acre-in', desc: 'amount of water that would cover a perfectly flat acre of land one-inch deep' },
      { unit: 'cu. ft.', desc: 'cubic foot of water' },
      { unit: 'cu. in', desc: 'cubic inches' },
      { unit: 'cu. meter', desc: 'cubic meters' },
      { unit: 'cu. yd', desc: 'cubic yards' },
      { unit: 'gal', desc: 'gallons' },
      { unit: 'gal UK', desc: 'United Kingdom (UK) gallons' },
      { unit: 'hectare-mm', desc: 'Amount of water that would cover a perfectly flat hectare that is one millimeter deep.' },
      { unit: 'hectare-m', desc: 'Amount of water that would cover a perfectly flat hectare that is one meter deep.' },
      { unit: 'liter', desc: 'liters. 1000 liters fit inside a cubic meter.' },
      { unit: 'ml', desc: 'milliliters, a thousandths of a liter' },
      { unit: 'cups', desc: 'cups (US customary)' },
      { unit: 'quarts', desc: 'quarts (US customary)' },
    ],
  },
];

const fontTitle = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 700, fontSize: 32, color: '#222' };
const fontSection = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 600, fontSize: 20, color: '#8cb43a' };
const fontText = { fontFamily: 'Roboto, Arial, sans-serif', fontSize: 16, color: '#222' };

const IrrigationUnitsDescription = () => {
  return (
    <Paper sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <BackButton />
      <Typography gutterBottom sx={fontTitle} align="center">
        Irrigation Units Description
      </Typography>
      <Typography gutterBottom sx={{ ...fontText, mb: 4 }} align="center">
        Comprehensive reference guide for units commonly used in irrigation calculations.
      </Typography>
      <Typography gutterBottom sx={{ fontSize: 14, color: '#666', mb: 4 }} align="center">
        Reference: Washington State University
      </Typography>

      <Box sx={{ mt: 4 }}>
        {units.map((group, idx) => (
          <Accordion key={group.title} sx={{ mb: 2, boxShadow: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: '#f5f5f5',
                '&:hover': {
                  backgroundColor: 'rgba(140, 180, 58, 0.1)',
                },
              }}
            >
              <Typography sx={fontSection}>
                {group.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3 }}>
              <Box>
                {group.items.map((item) => (
                  <Box key={item.unit} sx={{ display: 'flex', mb: 2, alignItems: 'flex-start' }}>
                    <Typography 
                      sx={{ 
                        minWidth: 140, 
                        fontWeight: 600, 
                        color: '#8cb43a',
                        fontSize: 16,
                        mr: 2
                      }}
                    >
                      {item.unit}
                    </Typography>
                    <Typography sx={{ ...fontText, flex: 1 }}>
                      {item.desc}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <Box sx={{ mt: 6, p: 3, bgcolor: '#f9f9f9', borderRadius: 2, textAlign: 'center' }}>
        <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 2 }}>
          Understanding Irrigation Units
        </Typography>
        <Typography sx={{ fontSize: 14, color: '#666' }}>
          These units are essential for accurate irrigation system design, water management, and agricultural planning. 
          Use this reference guide alongside the unit conversion calculator for comprehensive unit handling.
        </Typography>
      </Box>
    </Paper>
  );
};

export default IrrigationUnitsDescription; 