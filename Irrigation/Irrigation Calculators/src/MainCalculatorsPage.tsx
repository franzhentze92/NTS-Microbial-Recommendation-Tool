import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';
import { Link } from 'react-router-dom';

const categories = [
  {
    name: 'General Design Calculators',
    calculators: [
      { label: 'Irrigatable Area', path: '/irrigatable-area', desc: 'The land area that can be irrigated with a given flow of water.' },
      { label: 'Irrigation Run Time', path: '/irrigation-run-time', desc: 'Determine the length of time that an irrigation system must run to apply enough water to replace the water lost to evapotranspiration.' },
      { label: 'Required Water Pump Horsepower', path: '/required-water-pump-horsepower', desc: 'Estimate the brake horsepower and total power (hp) requirements of the electric motor used to power an irrigation water pump.' },
      { label: 'Irrigation System Pumping Requirements', path: '#', desc: 'Calculate the system capacity (flow rate) required to meet the demands of a field.' },
      { label: 'NPSHA', path: '#', desc: 'Determines the absolute pressure at the pump impeller.' },
      { label: 'Total Dynamic Head', path: '#', desc: 'Finds the pressure required at the pump, and the head that the pump must generate.' },
      { label: 'Minimum Required Pipe Size', path: '#', desc: 'Determine required pipe size based on given flow rate, pipe length, material and maximum allowable pressure loss.' },
      { label: 'Pipe Velocity and Diameter', path: '#', desc: 'Calculate the velocity of water in a pipe and calculate the diameter of a pipe required for 5 fps pipe velocity.' },
      { label: 'Pipeline Pressure Loss', path: '#', desc: 'Calculates the pressure or friction loss along a given length of pipeline with a specified inside diameter and the minimum pipe size to limit pressure loss to a specified value.' },
      { label: 'Pressure Loss from Laterals with Outlets', path: '#', desc: 'Calculates friction loss in a pipe with equally spaced outlets and the minimum pipe size for a pipe with equally spaced outlets.' },
      { label: 'Fitting Pressure Loss', path: '#', desc: 'The equivalent feet of pipe to add to the pressure loss equation.' },
      { label: 'Required System Capacity', path: '#', desc: 'Calculate the system capacity (flow rate) required to meet the demands of a field.' },
      { label: 'Total Surge Pressure', path: '#', desc: 'Surge pressure due to a sudden shutting of a valve, or water hitting the end of a pipe.' },
      { label: 'Water Depth', path: '/water-depth', desc: 'Depth of water applied to a specified area over the specified time span based on the given flow rate onto the field.' },
      { label: 'Water Supply Design', path: '#', desc: 'Estimate of the water flow requirements to replace water lost to evapotranspiration.' },
    ]
  },
  {
    name: 'Irrigation Management Calculators',
    calculators: [
      { label: 'Irrigation Frequency', path: '/irrigation-frequency', desc: 'Maximum interval allowed between irrigations. This is dependent on soil type, root zone depth, and the water use rate of the crop.' },
      { label: 'Set Irrigation Times', path: '/irrigation-times', desc: 'Set time required to fulfill a given water application, irrigation area, and flow rate.' },
      { label: 'Water Application Rate', path: '/water-application-rate', desc: 'Application rate using the flow rate on an area.' },
    ]
  },
  {
    name: 'Drip Irrigation Calculators',
    calculators: [
      { label: 'Drip Line Application Rate', path: '#', desc: 'Water application rate of drip irrigation.' },
      { label: 'Drip Design for Landscapes', path: '#', desc: 'Determine how much water to apply to individual plants with drip emitters.' },
    ]
  },
  {
    name: 'Sprinkler Irrigation Calculators',
    calculators: [
      { label: 'Nozzle Flow Rate and Effective Application Rate', path: '#', desc: 'Sprinkler nozzle flow rate and effective application rate based on nozzle diameter and spacing.' },
      { label: 'Nozzle Flow Rate and Required Nozzle Diameter', path: '#', desc: 'Sprinkler nozzle flow rate and required nozzle diameter based on target application rate and spacing.' },
      { label: 'Nozzle Requirements', path: '#', desc: 'Find the flow rate using a given pressure and diameter, or find the nozzle diameter for a given pressure and flow rate.' },
      { label: 'Lateral Friction Loss', path: '#', desc: 'Find the flow rate, pipe length and friction loss based on a sprinkler lateral.' },
      { label: 'Hand Move Sprinklers', path: '#', desc: 'Find recommended values for hand move sprinklers, such as set times, nozzle and pressure losses.' },
      { label: 'Sprinkler Density', path: '#', desc: 'Find the number of sprinkler heads per area for rectangular or triangular spacing.' },
      { label: 'Traveling Big Gun Sprinkler', path: '#', desc: 'Calculate the net water application for a given flow rate, efficiency percentage, lane width, and travel speed.' },
      { label: 'Traveling Irrigator', path: '#', desc: 'Estimate the total number of irrigated acres per hour based on lane spacing and travel speed.' },
    ]
  },
  {
    name: 'Centre Pivot Irrigation Calculators',
    calculators: [
      { label: 'Percent Timer Setting', path: '#', desc: 'Calculate an approximate timer setting to apply a particular depth.' },
      { label: '1" Application Time', path: '#', desc: 'Calculate the irrigation time to apply one inch of water with a center pivot.' },
      { label: 'Center Pivot Acreage', path: '#', desc: 'Calculate the area underneath a center pivot.' },
      { label: 'Pivot Full Rotation Time', path: '#', desc: 'The time that it takes for a 360 degree rotation of a center pivot.' },
      { label: 'System Pumping Requirements', path: '#', desc: 'Calculate the system capacity (flow rate) required to meet the demands of a field.' },
    ]
  },
  {
    name: 'Residential Irrigation Calculators',
    calculators: [
      { label: 'Drip Design for Landscapes', path: '#', desc: 'Determine how much water to apply to individual plants with drip emitters.' },
      { label: 'Garden Hose Flow Rate', path: '#', desc: 'Calculate the flow rate and application time for a garden hose, based on hose size and supply pressure.' },
      { label: 'Lawn Water Management', path: '#', desc: 'Find the application depth and operation time for a specific grass type, precipitation rate, and daily water use.' },
    ]
  },
  {
    name: 'Other Tools',
    calculators: [
      { label: 'Irrigation Units Description', path: '/irrigation-units-description', desc: 'Lists and describes all relevant irrigation units.' },
      { label: 'Irrigation Unit Conversions', path: '/irrigation-unit-conversions', desc: 'Convert a given value and unit to different unit type.' },
    ]
  }
];

const MainCalculatorsPage: React.FC = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Irrigation Calculators
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Select an irrigation calculator by category:
      </Typography>
      <Box>
        {categories.map((cat, idx) => (
          <Box key={cat.name} sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ color: '#8cb43a', mb: 1 }}>{cat.name}</Typography>
            <List>
              {cat.calculators.map(calc => (
                <ListItem key={calc.label} alignItems="flex-start" disablePadding sx={{ mb: 1 }}>
                  <ListItemButton component={calc.path !== '#' ? Link : 'div'} to={calc.path !== '#' ? calc.path : undefined} disabled={calc.path === '#'} alignItems="flex-start">
                    <ListItemText
                      primary={<Typography sx={{ fontWeight: 600, color: '#8cb43a' }}>{calc.label}</Typography>}
                      secondary={<Typography sx={{ color: '#444' }}>{calc.desc}</Typography>}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            {idx < categories.length - 1 && <Divider sx={{ my: 2 }} />}
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default MainCalculatorsPage; 