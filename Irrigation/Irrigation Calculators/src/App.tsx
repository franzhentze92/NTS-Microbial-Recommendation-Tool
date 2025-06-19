import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Box, Drawer, List, ListItem, ListItemText, ListItemIcon, Divider, IconButton, Fab } from '@mui/material';
import { styled } from '@mui/material/styles';
import WaterApplicationRateCalculator from './WaterApplicationRateCalculator';
import WaterDepthCalculator from './WaterDepthCalculator';
import IrrigationTimesCalculator from './IrrigationTimesCalculator';
import IrrigationRunTimeCalculator from './IrrigationRunTimeCalculator';
import IrrigationFrequencyCalculator from './IrrigationFrequencyCalculator';
import IrrigatableAreaCalculator from './IrrigatableAreaCalculator';
import RequiredWaterPumpHorsepowerCalculator from './RequiredWaterPumpHorsepowerCalculator';
import IrrigationUnitsDescriptionPage from './IrrigationUnitsDescriptionPage';
import IrrigationUnitConversionsPage from './IrrigationUnitConversionsPage';
import MainCalculatorsPage from './MainCalculatorsPage';
import WaterIcon from '@mui/icons-material/Water';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 280;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const StyledListItem = styled(ListItem)<{ component?: React.ElementType; to?: string }>(({ theme }) => ({
  '& .MuiListItemText-primary': {
    color: '#222',
  },
  '&:hover .MuiListItemText-primary': {
    color: '#8cb43a',
  },
  '&:hover': {
    backgroundColor: 'rgba(140, 180, 58, 0.1)',
  },
}));

const SectionHeader = styled(ListItem)({
  backgroundColor: '#f5f5f5',
  '& .MuiListItemText-primary': {
    color: '#8cb43a',
    fontWeight: 600,
    fontSize: '1.1rem',
  },
});

const CategoryHeader = styled(ListItem)({
  backgroundColor: '#e0e0e0',
  '& .MuiListItemText-primary': {
    color: '#333',
    fontWeight: 600,
    fontSize: '1rem',
  },
});

const irrigationPages = [
  { path: '/irrigation', name: 'Irrigation Calculators', component: MainCalculatorsPage },
  { path: '/water-application-rate', name: 'Water Application Rate', component: WaterApplicationRateCalculator },
  { path: '/water-depth', name: 'Water Depth', component: WaterDepthCalculator },
  { path: '/irrigation-times', name: 'Set Irrigation Times', component: IrrigationTimesCalculator },
  { path: '/irrigation-run-time', name: 'Irrigation Run Time', component: IrrigationRunTimeCalculator },
  { path: '/irrigation-frequency', name: 'Irrigation Frequency', component: IrrigationFrequencyCalculator },
  { path: '/irrigatable-area', name: 'Irrigatable Area', component: IrrigatableAreaCalculator },
  { path: '/required-water-pump-horsepower', name: 'Required Water Pump Horsepower', component: RequiredWaterPumpHorsepowerCalculator },
  { path: '/irrigation-units-description', name: 'Irrigation Units Description', component: IrrigationUnitsDescriptionPage },
  { path: '/irrigation-unit-conversions', name: 'Irrigation Unit Conversions', component: IrrigationUnitConversionsPage },
];

const irrigationCategories = {
  'Main': ['Irrigation Calculators'],
  'Calculators': [
    'Water Application Rate',
    'Water Depth',
    'Set Irrigation Times',
    'Irrigation Run Time',
    'Irrigation Frequency',
    'Irrigatable Area',
    'Required Water Pump Horsepower',
  ],
  'Information': [
    'Irrigation Units Description',
    'Irrigation Unit Conversions',
  ],
};

const App = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(true);

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="persistent"
          anchor="left"
          open={drawerOpen}
        >
          <DrawerHeader>
            <IconButton onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          </DrawerHeader>
          <List>
            {/* Irrigation Section */}
            <SectionHeader>
              <ListItemIcon>
                <WaterIcon sx={{ color: '#8cb43a' }} />
              </ListItemIcon>
              <ListItemText primary="Irrigation" />
            </SectionHeader>
            {Object.entries(irrigationCategories).map(([category, pages]) => (
              <React.Fragment key={category}>
                <CategoryHeader>
                  <ListItemText primary={category} />
                </CategoryHeader>
                {pages.map((pageName) => {
                  const page = irrigationPages.find((p) => p.name === pageName);
                  return page ? (
                    <StyledListItem
                      component={Link}
                      to={page.path}
                      key={page.path}
                      sx={{ pl: 4 }}
                    >
                      <ListItemText primary={page.name} />
                    </StyledListItem>
                  ) : null;
                })}
              </React.Fragment>
            ))}
          </List>
        </Drawer>
        <Main open={drawerOpen}>
          <DrawerHeader />
          <Container maxWidth="lg">
            <Routes>
              {irrigationPages.map((page) => (
                <Route
                  key={page.path}
                  path={page.path}
                  element={<page.component />}
                />
              ))}
              <Route path="/" element={<MainCalculatorsPage />} />
            </Routes>
          </Container>
        </Main>
        {!drawerOpen && (
          <Fab
            color="primary"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{ position: 'fixed', top: 16, left: 16 }}
          >
            <MenuIcon />
          </Fab>
        )}
      </Box>
    </Router>
  );
};

export default App; 