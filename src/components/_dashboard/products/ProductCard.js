import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Box, Card, Link, Typography, Stack, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
import { fCurrency } from '../../../utils/formatNumber';
//
import Label from '../../Label';
import ColorPreview from '../../ColorPreview';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';

// ----------------------------------------------------------------------

import { Icon } from '@iconify/react';
import { IconButton } from '@mui/material';

const ProductImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object
};

const RootStyle = styled()(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3)
}));

export default function ShopProductCard({ face }) {
  const { filename, id, person } = face;

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {/* {status && (
          <Label
            variant="filled"
            color={(status === 'sale' && 'error') || 'info'}
            sx={{
              zIndex: 9,
              top: 16,
              right: 16,
              position: 'absolute',
              textTransform: 'uppercase'
            }}
          >
            {status}
          </Label>
        )} */}
        <ProductImgStyle alt={id} src={filename} />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="subtitle2" noWrap>
            {person ? person.name : 'unknow'}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <IconButton size="large">
            <Icon icon={trash2Fill} />
          </IconButton>
        </Grid>
      </Grid>
      {/* <Stack spacing={2} direction="row" sx={{ p: 3 }}>
      
      {/* //trash2Fill */}
      {/* <Stack direction="row" alignItems="center" justifyContent="space-between">
          <ColorPreview colors={colors} />
          <Typography variant="subtitle1">
            <Typography
              component="span"
              variant="body1"
              sx={{
                color: 'text.disabled',
                textDecoration: 'line-through'
              }}
            >
              {priceSale && fCurrency(priceSale)}
            </Typography>
            &nbsp;
            {fCurrency(price)}
          </Typography>
        </Stack> */}
      {/* </Stack> */}
    </Card>
  );
}
