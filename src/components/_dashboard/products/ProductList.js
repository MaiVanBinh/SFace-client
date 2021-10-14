import PropTypes from 'prop-types';
// material
import { Grid, Button } from '@mui/material';
import ShopProductCard from './ProductCard';
import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ApiFetching from './../../../utils/apiFetching';
import { connect } from 'react-redux';
import * as actionsType from '../../../reduxConfig/store/actionTypes';

const ProductList = ({ personId, persons, onDeleteFace, trainSuccess, ...other }) => {
  const [openDelete, setOpenDelete] = useState(false);
  const [faceDel, setFaceDel] = useState(null);
  const { deleteFaceById } = ApiFetching();
  const [faces, setFaces] = useState([]);

  useEffect(() => {
    const person = persons.find((e) => e.uuid === personId);
    setFaces(person.faces);
  }, [persons, personId]);

  const deleteImageHandle = () => {
    deleteFaceById(faceDel.id, () => {
      setOpenDelete(false);
      setFaceDel(null);
      onDeleteFace({ faceId: faceDel.id, personId: personId });
    });
  };

  return (
    <Grid container spacing={3} {...other}>
      {faces.map((face) => (
        <Grid key={face.id} item xs={12} sm={6} md={3}>
          <ShopProductCard
            face={face}
            trainSuccess={trainSuccess}
            deleteFace={() => {
              setFaceDel(face);
              setOpenDelete(true);
            }}
          />
        </Grid>
      ))}
      {/* delete person */}
      <Dialog
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
          setFaceDel(null);
        }}
      >
        <DialogTitle>Delete This Image</DialogTitle>

        <DialogActions>
          <Button onClick={() => deleteImageHandle()}>Save</Button>
          <Button
            onClick={() => {
              setOpenDelete(false);
              setFaceDel(null);
            }}
          >
            Cancle
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    persons: state.persons
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onDeleteFace: (payload) => dispatch({ type: actionsType.DELETE_FACE, payload })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
