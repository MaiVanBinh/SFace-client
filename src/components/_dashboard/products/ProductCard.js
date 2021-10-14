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

export default function ShopProductCard(props) {
  const { face, deleteFace, trainSuccess } = props;

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        <ProductImgStyle alt={face.id} src={face.filename} />
        {trainSuccess && (
          <IconButton
            size="large"
            style={{ position: 'absolute', top: 10, right: 10, backgroundColor: '#ccc' }}
            onClick={deleteFace}
          >
            <Icon icon={trash2Fill} />
          </IconButton>
        )}
      </Box>
    </Card>
  );
}
