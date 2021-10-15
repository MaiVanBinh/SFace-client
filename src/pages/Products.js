import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
// material
import { Container, Stack, Typography, Button, Dialog } from '@mui/material';
// components
import Page from '../components/Page';
import {
  ProductSort,
  ProductList,
  ProductCartWidget,
  ProductFilterSidebar
} from '../components/_dashboard/products';
//
import { Icon } from '@iconify/react';
import cameraFill from '@iconify/icons-eva/camera-fill';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import ApiFetching from 'src/utils/apiFetching';
// ----------------------------------------------------------------------
import axios from '../axiosInstance';

export default function EcommerceShop(props) {
  const [openFilter, setOpenFilter] = useState(false);
  const { getFaces } = ApiFetching();

  const { faces, personId, trainSuccess} = props;
  useEffect(() => {
    console.log(faces);
  }, []);
  const formik = useFormik({
    initialValues: {
      gender: '',
      category: '',
      colors: '',
      priceRange: '',
      rating: ''
    },
    onSubmit: () => {
      setOpenFilter(false);
    }
  });

  const { resetForm, handleSubmit } = formik;

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleResetFilter = () => {
    handleSubmit();
    resetForm();
  };

  return (
    <Page title="Faces | S-Faces">
      <Container sx={{padding: '0 !important', maxWidth: "unset !important"}}>
        <ProductList faces={faces ? faces : []} mt={5} personId={personId} trainSuccess={trainSuccess}/>
      </Container>
    </Page>
  );
}
