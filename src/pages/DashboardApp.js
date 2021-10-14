// material
import { Box, Grid, Container, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
// components
import Page from '../components/Page';
import {
  AppNewUsers,
  AppBugReports,
  AppItemOrders,
  AppWeeklySales
} from '../components/_dashboard/app';

import ApiFetching from '../utils/apiFetching';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const [totalPerson, setTotalPersons] = useState(0);

  const {
    getPersons
  } = ApiFetching();

  useEffect(() => {
    getPersons(1, 1, (data) => {
      setTotalPersons(data.paging.total);
    });
  }, []);

  return (
    <Page title="Dashboard | S-Faces">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Hi, Welcome back</Typography>
        </Box>
        <Grid container spacing={3}>
          {/* <Grid item xs={12} sm={6} md={3}>
            <AppWeeklySales />
          </Grid> */}
          <Grid item xs={12} sm={6} md={3}>
            <AppNewUsers totalPerson={totalPerson} />
          </Grid>
          {/* <Grid item xs={12} sm={6} md={3}>
            <AppItemOrders />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppBugReports />
          </Grid> */}
        </Grid>
      </Container>
    </Page>
  );
}
