// material
import { Box, Grid, Container, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
// components
import Page from '../components/Page';
import {
  AppNewUsers,
  LastestModel,
  FacesCount,
  AppWeeklySales
} from '../components/_dashboard/app';

import ApiFetching from '../utils/apiFetching';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const [totalPerson, setTotalPersons] = useState(0);
  const [facesCount, setFacesCount] = useState(0);
  const [modelInfo, setModelInfo] = useState(null);
  const { getPersons, getFacesCount, getLastestModelInfo } = ApiFetching();

  useEffect(() => {
    getPersons(1, 1, (data) => {
      setTotalPersons(data.paging.total);
    });
    getFacesCount((data) => {
      if (data && data.data) {
        setFacesCount(data.data.total);
      }
    });
    getLastestModelInfo((data) => {
      if (data && data.data) {
        setModelInfo(data.data);
      }
    });
  }, []);

  return (
    <Page title="Dashboard | S-Faces">
      <Container sx={{ padding: '0 !important', maxWidth: 'unset !important' }}>
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Hi, Welcome back</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <AppNewUsers totalPerson={totalPerson} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FacesCount facesCount={facesCount} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <LastestModel modelInfo={modelInfo}/>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
