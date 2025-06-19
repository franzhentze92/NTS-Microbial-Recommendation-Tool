import React from 'react';
import { Paper, Typography, Box, Divider } from '@mui/material';

const fontTitle = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 700, fontSize: 32, color: '#222' };
const fontSection = { fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 600, fontSize: 20, color: '#8cb43a', mt: 3 };
const fontText = { fontFamily: 'Roboto, Arial, sans-serif', fontSize: 16, color: '#222' };
const fontVar = { fontWeight: 700, color: '#8cb43a', minWidth: 120, display: 'inline-block' };

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
      { unit: 'y', desc: 'yard' },
    ],
  },
  {
    title: 'Flow',
    items: [
      { unit: 'acre-ft/day', desc: 'flow that would cover a perfectly flat acre of land one-foot deep in one day' },
      { unit: 'acre-in/day', desc: 'flow that would cover a perfectly flat acre of land one-inch deep in one day' },
      { unit: 'acre-in/hr', desc: 'flow that would cover a perfectly flat acre of land one-inch deep in one hour. This is approximately equal to 1 cfs.' },
      { unit: 'cfs', desc: 'cubic feet per second. There are about 450 gpm in 1 cfs. 1 cfs is about 1 acre-in/hr. In other words 1 cfs will cover 1 acre in 2 feet of water in one day.' },
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
      { unit: 'btu', desc: 'British thermal units per hour' },
      { unit: 'btm', desc: 'British thermal units per minute' },
      { unit: 'hp', desc: 'horsepower' },
      { unit: 'kw', desc: 'kilowatts' },
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
      { unit: 'gpm/acre', desc: 'gallons per minute per acre. This is commonly used to design irrigation systems. 7 gpm/acre is a common design number for Eastern Washington.' },
      { unit: 'in/day', desc: 'inches per day' },
      { unit: 'in/hr', desc: 'inches per hour. This is a common measurement of an irrigation system\'s application rate. It is important to know to understand how long to leave the irrigation system on.' },
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
      { unit: 'bars', desc: '1 bar is 100 kilopascals of pressure.' },
      { unit: 'ft of water', desc: 'Feet of water. Also known as feet of head. The pressure at the bottom of the given depth of water in feet. Used by engineers to design systems. About 2.3 feet of water is equivalent to 1 psi.' },
      { unit: 'in of Mercury', desc: 'Inches of mercury. Pressure at the bottom of the given depth of mercury in inches.' },
      { unit: 'in of water', desc: 'Inches of water. Pressure at the bottom of the given depth of water in inches.' },
      { unit: 'kPa', desc: 'Kilopascals. 1000 pascals. 1 pascal = the force of 1 newton on 1 square meter.' },
      { unit: 'm of water', desc: 'meters of water. The pressure at the bottom of the given depth of water in meters. 1 m of water is about 9.8 kPa.' },
      { unit: 'psi', desc: 'pounds per square inch. Sometimes referred to colloquially as "pounds of pressure".' },
    ],
  },
  {
    title: 'Salinity',
    items: [
      { unit: 'dS/m', desc: 'deci-siemens per meter. A measurement of electrical conductivity (EC). Salty water conducts electricity more readily than pure water. Therefore as salinity increases, EC increases.' },
      { unit: 'microS/cm', desc: 'micro-siemens per centimeter' },
      { unit: 'mg/l', desc: 'milligrams of dissolved salt per liter of liquid. A measurement of total dissolved solids(TBS) equivalent to parts per million (ppm).' },
      { unit: 'mS/cm', desc: 'milli-siemens per centimeter' },
      { unit: 'ppm', desc: 'parts per million. Parts of salt per million parts of the total solution. Equivalent to milligrams per liter.' },
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
    title: 'Volume',
    items: [
      { unit: 'acre-ft', desc: 'amount of water that would cover a perfectly flat acre of land one-foot deep' },
      { unit: 'acre-in', desc: 'amount of water that would cover a perfectly flat acre of land one-inch deep' },
      { unit: 'cu. ft.', desc: 'cubic foot of water' },
      { unit: 'cu. in', desc: 'cubic inches' },
      { unit: 'cu. meter', desc: 'cubic meters' },
      { unit: 'cu. yd', desc: 'cubic yards' },
      { unit: 'gals', desc: 'gallons' },
      { unit: 'gal UK', desc: 'United Kingdom (UK) gallons' },
      { unit: 'hectare - mm', desc: 'Amount of water that would cover a perfectly flat hectare that is one millimeter deep.' },
      { unit: 'hectare - m', desc: 'Amount of water that would cover a perfectly flat hectare that is one meter deep.' },
      { unit: 'liter', desc: 'liters. 1000 liters fit inside a cubic meter.' },
      { unit: 'ml', desc: 'milliliters, a thousandths of a liter' },
    ],
  },
];

const IrrigationUnitsDescriptionPage = () => {
  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 900, margin: '32px auto' }}>
      <Typography sx={fontTitle} gutterBottom align="center">
        Irrigation Unit Descriptions
      </Typography>
      <Typography sx={fontText} gutterBottom align="center">
        This page lists and describes all relevant irrigation units used in the calculators.
      </Typography>
      <Box sx={{ mt: 4 }}>
        {units.map((group, idx) => (
          <Box key={group.title} sx={{ mb: 4 }}>
            <Typography sx={fontSection}>{group.title}</Typography>
            {group.items.map((item) => (
              <Box key={item.unit} sx={{ display: 'flex', mb: 1 }}>
                <Typography component="span" sx={fontVar}>{item.unit}</Typography>
                <Typography component="span" sx={{ ...fontText, ml: 2 }}>{item.desc}</Typography>
              </Box>
            ))}
            {idx < units.length - 1 && <Divider sx={{ mt: 3 }} />}
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default IrrigationUnitsDescriptionPage; 