import PropTypes from 'prop-types';
// material
import { Grid } from '@mui/material';
import ShopProductCard from './ProductCard';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

ProductList.propTypes = {
  products: PropTypes.array.isRequired
};

export default function ProductList({ faces, ...other }) {
  useEffect(() => {
    console.log(faces)
  }, [])
  return (
    <Grid container spacing={3} {...other}>
      {faces.map((face) => (
        <Grid key={face.id} item xs={12} sm={6} md={3}>
          <ShopProductCard face={face} />
        </Grid>
      ))}
    </Grid>
  );
}
