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
  const [faces, setFaces] = useState([]);
  const { getFaces } = ApiFetching();
  const { person } = props;
  useEffect(() => {
    console.log(person);
    getFaces((data) => {
      setFaces(data.list);
    });
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
    <Page title="Dashboard: Products | Minimal-UI">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Faces
          </Typography>

          <Button
            variant="contained"
            // component={RouterLink}
            to="#"
            // onClick={() => setOpenCreate(true)}
            startIcon={<Icon icon={cameraFill} />}
          >
            Faces Recognition
          </Button>
        </Stack>

        <Stack
          direction="row"
          flexWrap="wrap-reverse"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ mb: 5 }}
        >
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              formik={formik}
              isOpenFilter={openFilter}
              onResetFilter={handleResetFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort />
          </Stack>
        </Stack>

        <ProductList faces={faces} />
      </Container>
    </Page>
  );
}
