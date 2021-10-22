import { filter } from 'lodash';
import { makeStyles } from '@mui/styles';

import { sentenceCase } from 'change-case';
import { useEffect, useState, cloneElement, forwardRef, useRef } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import refreshFill from '@iconify/icons-eva/refresh-fill';
import { Link as RouterLink } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actionsType from '../reduxConfig/store/actionTypes';

import FaceIcon from '@mui/icons-material/Face';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import CameraIcon from '@mui/icons-material/CameraAlt';

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import cameraFill from '@iconify/icons-eva/camera-fill';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Slide from '@mui/material/Slide';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Products from './Faces';

// material
import { Icon } from '@iconify/react';
import CircularProgress from '@mui/material/CircularProgress';
import { MHidden } from '../@material-extend/index';

import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  IconButton,
  Box,
  Grid
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserMoreMenu } from '../components/_dashboard/user';
//
import ApiFetching from 'src/utils/apiFetching';
import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'Persons', label: 'Persons', alignRight: false },
  { id: 'ID', label: 'ID', alignRight: false },
  { id: 'Faces', label: 'Faces', alignRight: false },
  { id: '' }
];

const useStyles = makeStyles({
  dialogCustomizedWidth: {
    width: '80%'
  },
  IconButton: {
    backgroundColor: '#00AB55',
    position: 'relative',
    '&:hover': {
      backgroundColor: '#007B55'
    }
  }
});

// ----------------------------------------------------------------------

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

const Users = (props) => {
  const classes = useStyles();

  const [warning, setWarning] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openRegisterFace, setOpenRegisterFace] = useState(false);
  const [openListFaces, setOpenListFaces] = useState(false);
  const [name, setName] = useState('');
  const [currPerson, setCurrPerson] = useState(null);
  const [currImage, setCurrImage] = useState(null);
  const [totalPersons, setTotalPersons] = useState(0);
  const [openRecFace, setOpenRecFace] = useState(false);
  const [loading, setLoading] = useState(false);
  const [facesRec, setFacesRec] = useState([]);
  const [trainSuccess, setTrainSuccess] = useState(true);
  const { persons, setPersonsStore, onRegisterFace } = props;
  const [isChangeText, setIsChangeText] = useState(false);
  const [registerFaceErr, setRegisterFaceErr] = useState(false);
  const [warningText, setWarningText] = useState("");

  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  const {
    getPersons,
    createPersons,
    deletePersons,
    registerFace,
    recFaces,
    reTrain,
    checkStatusTrain
  } = ApiFetching();

  const startReTrain = () => {
    if (!trainSuccess) {
      setWarning(true);
      setWarningText("Wait for training process complete!");
      return;
    }
    setTrainSuccess(false);
    reTrain();
  };

  useEffect(async () => {
    let stop = false;

    while (!stop) {
      await sleep(2000);
      const data = await checkStatusTrain();
      if ((data && data.status === 'complete') || !data.status) {
        stop = true;
        setTrainSuccess(true);
      } 
      if(data && data.status === 'failed') {
        stop = true;
        setTrainSuccess(true);
        setWarning(true);
        setWarningText("Train Model Failed")
      }
    }
  }, [trainSuccess]);

  useEffect(async () => {
    const data = await checkStatusTrain();
    if ((data && data.status === 'complete') || !data.status) {
      setTrainSuccess(true);
    } 
    
    if(data && data.status === 'failed') {
      setTrainSuccess(true);
      setWarning(true);
      setWarningText("Train Model Failed")
    }
  }, []);

  const deletePersonHandle = () => {
    if (!trainSuccess) {
      setWarning(true);
      setWarningText("Wait for training process complete!");
      return;
    }
    if (currPerson) {
      deletePersons(currPerson.uuid, () => {
        getPersons(page, rowsPerPage, (data) => {
          setPersonsStore(data.list);
          setTotalPersons(data.paging.total);
        });
        setOpenDelete(false);
      });
    }
  };

  const openDeteleForm = (row) => {
    console.log(row);
    setCurrPerson(row);
    setOpenDelete(true);
  };

  const createPersonHandle = () => {
    if (!trainSuccess) {
      setWarning(true);
      setWarningText("Wait for training process complete!");
      return;
    }

    createPersons({ name: name }, () => {
      getPersons(page, rowsPerPage, (data) => {
        setPersonsStore(data.list);
        setCurrPerson(null);
        setOpenCreate(false);
        setName('');
        setTotalPersons(data.paging.total);
      });
    });
  };

  useEffect(() => {
    // onFetchPersons('token');
    getPersons(page, rowsPerPage, (data) => {
      setPersonsStore(data.list);
      setTotalPersons(data.paging.total);
    });
  }, [page, rowsPerPage]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const registerFaceHandle = (face) => {
    if (!trainSuccess) {
      setWarning(true);
      setWarningText("Wait for training process complete!");
      return;
    }
    setLoading(true);
    if (currImage && currPerson) {
      let registerData = new FormData();
      registerData.append('image', currImage.currentFile);
      registerFace(
        registerData,
        currPerson.uuid,
        (data) => {
          data.personId = currPerson.uuid;
          onRegisterFace(data);
          setLoading(false);
          setOpenRegisterFace(false);
          setCurrImage(null);
        },
        () => {
          setRegisterFaceErr(true);
          setLoading(false);
          // setOpenRegisterFace(false);
          setCurrImage(null);
        }
      );
    } else {
      setLoading(false);
      setOpenRegisterFace(false);
      setCurrImage(null);
    }
  };

  const openRegisterFaceHandle = (row) => {
    if (!trainSuccess) {
      setWarning(true);
      setWarningText("Wait for training process complete!");
      return;
    }
    setOpenRegisterFace(true);
  };
  const selectFile = (event) => {
    setCurrImage({
      currentFile: event.target.files[0],
      previewImage: URL.createObjectURL(event.target.files[0]),
      progress: 0,
      message: ''
    });
  };

  const recognitionHandle = () => {
    if (currImage) {
      setLoading(true);
      let recData = new FormData();
      recData.append('image', currImage.currentFile);
      recFaces(recData, (data) => {
        if (data.data.persons && data.data.persons.length > 0) {
          setFacesRec(data.data.persons);
        } else {
          setFacesRec([{ uuid: 'unknow', name: 'unknow' }]);
        }

        setLoading(false);
      });
    }
  };
  const openPersonFaces = (person) => {
    setCurrPerson(person);
    setOpenListFaces(true);
  };

  return (
    <Page title="Persons | S-Faces">
      <Container sx={{ padding: '20px !important', maxWidth: 'unset !important' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Persons
          </Typography>
          <MHidden width="mdDown">
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box mr={5}>
                <Button
                  variant="contained"
                  component={RouterLink}
                  to="#"
                  onClick={() => {
                    setOpenCreate(true);
                    setIsChangeText(false);
                  }}
                  width="smDown"
                  startIcon={<Icon icon={plusFill} />}
                  pt={3}
                >
                  New Person
                </Button>
              </Box>
              <Box mr={5}>
                <Button
                  variant="contained"
                  component={RouterLink}
                  to="#"
                  onClick={() => startReTrain()}
                  startIcon={
                    trainSuccess ? (
                      <Icon icon={refreshFill} />
                    ) : (
                      <CircularProgress size={20} color="inherit" />
                    )
                  }
                  pt={3}
                >
                  Re-Train
                </Button>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  // component={RouterLink}
                  to="#"
                  onClick={() => {
                    setOpenRecFace(true);
                    setCurrImage(null);
                    setFacesRec([]);
                  }}
                  startIcon={<Icon icon={cameraFill} />}
                >
                  Faces Recognition
                </Button>
              </Box>
            </Stack>
          </MHidden>
          <MHidden width="mdUp">
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <IconButton
                sx={{
                  backgroundColor: 'primary.main',
                  marginRight: '5px'
                }}
                onClick={() => {
                  setOpenCreate(true);
                  setIsChangeText(false);
                }}
                className={classes.IconButton}
              >
                <AddIcon
                  sx={{
                    color: '#fff'
                  }}
                />
              </IconButton>
              <IconButton
                sx={{
                  backgroundColor: 'primary.main',
                  marginRight: '5px'
                }}
                onClick={() => startReTrain()}
                className={classes.IconButton}
              >
                {trainSuccess ? (
                  <RefreshIcon
                    sx={{
                      color: '#fff'
                    }}
                  />
                ) : (
                  <CircularProgress
                    size={20}
                    sx={{
                      color: '#fff'
                    }}
                  />
                )}
              </IconButton>
              <IconButton
                sx={{
                  backgroundColor: 'primary.main'
                }}
                onClick={() => {
                  setOpenRecFace(true);
                  setCurrImage(null);
                  setFacesRec([]);
                }}
                className={classes.IconButton}
              >
                <CameraIcon
                  sx={{
                    color: '#fff'
                  }}
                  mr
                />
              </IconButton>
            </Stack>
          </MHidden>
        </Stack>

        <Card>
          {/* <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          /> */}

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {persons
                    ? persons.map((row) => {
                        const { uuid, name, faces } = row;
                        const isItemSelected = selected.indexOf(name) !== -1;
                        const avatarUrl =
                          faces && faces.length > 0
                            ? faces[0]['filename']
                            : 'https://minimal-kit-react.vercel.app/static/mock-images/avatars/avatar_12.jpg';
                        return (
                          <TableRow
                            hover
                            key={uuid}
                            tabIndex={-1}
                            role="checkbox"
                            selected={isItemSelected}
                            aria-checked={isItemSelected}
                          >
                            <TableCell
                              component="th"
                              scope="row"
                              padding="normal"
                              onClick={() => openPersonFaces(row)}
                              width="30%"
                            >
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar alt={name} src={avatarUrl} />
                                <Typography variant="subtitle2" noWrap>
                                  {name}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell
                              component="th"
                              scope="row"
                              padding="normal"
                              onClick={() => openPersonFaces(row)}
                              width="30%"
                            >
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Typography variant="subtitle2" noWrap>
                                  {uuid}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell
                              component="th"
                              scope="row"
                              padding="normal"
                              onClick={() => openPersonFaces(row)}
                              width="30%"
                            >
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Typography variant="subtitle2" noWrap>
                                  {faces.length}
                                </Typography>
                              </Stack>
                            </TableCell>

                            <TableCell align="right">
                              <UserMoreMenu openDetele={() => openDeteleForm(row)} />
                            </TableCell>
                          </TableRow>
                        );
                      })
                    : null}
                  {/* {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )} */}
                </TableBody>
                {/* {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )} */}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalPersons}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

        <Dialog
          open={openCreate}
          onClose={() => {
            setOpenCreate(false);
            setName('');
          }}
        >
          <DialogTitle>Create Person</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              type="text"
              fullWidth
              variant="standard"
              value={name}
              onChange={(e) => {
                setIsChangeText(true);
                setName(e.target.value);
              }}
              error={name === '' && isChangeText}
              helperText={name === '' && isChangeText ? 'Empty field!' : ' '}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => createPersonHandle()}>Save</Button>
            <Button
              onClick={() => {
                setOpenCreate(false);
                setName('');
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* delete person */}
        <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
          <DialogTitle>Delete Person: {currPerson && currPerson.name}</DialogTitle>

          <DialogActions>
            <Button onClick={() => deletePersonHandle()}>Save</Button>
            <Button
              onClick={() => {
                setOpenDelete(false);
                setCurrPerson(null);
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Register faces */}
        <Dialog
          open={openRegisterFace}
          onClose={() => {
            setOpenRegisterFace(false);
            setCurrImage(null);
          }}
        >
          <DialogTitle>Register one more face to: {currPerson && currPerson.name}</DialogTitle>
          <DialogContent>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box>
                <input accept="image/*" id="icon-button-photo" type="file" onChange={selectFile} />
              </Box>
            )}

            {currImage && <img src={currImage.previewImage} alt="" />}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => registerFaceHandle()}>Register</Button>
            <Button
              onClick={() => {
                setOpenRegisterFace(false);
                setCurrImage(null);
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Recface */}
        <Dialog
          open={openRecFace}
          onClose={() => {
            setOpenRecFace(false);
            setCurrImage(null);
          }}
          fullWidth={true}
          maxWidth={'sm'}
        >
          {/* <DialogTitle>Add a Image:</DialogTitle> */}
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div>
                  <Typography variant="h5" gutterBottom>
                    Results:
                  </Typography>
                  {loading ? (
                    <Box sx={{ display: 'flex' }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <List dense={false}>
                      {facesRec.map((e) => (
                        <ListItem key={e.uuid}>
                          <ListItemIcon>
                            <FaceIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={e.name}
                            secondary={false ? 'Secondary text' : null}
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </div>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                  <Box>
                    <input
                      accept="image/*"
                      id="icon-button-photo"
                      type="file"
                      onChange={selectFile}
                    />
                    <label htmlFor="icon-button-photo"></label>
                  </Box>
                </Stack>
                {currImage && (
                  <img src={currImage.previewImage} alt="" style={{ maxHeight: '500px' }} />
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => recognitionHandle()}>Recognize</Button>
            <Button
              onClick={() => {
                setOpenRecFace(false);
                setCurrImage(null);
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* list faces */}
        <Dialog
          fullScreen
          open={openListFaces}
          onClose={() => {
            setOpenListFaces(true);
          }}
          TransitionComponent={Transition}
        >
          <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setOpenListFaces(false)}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                {currPerson ? currPerson.name : ''}
              </Typography>
              <Button autoFocus color="inherit" onClick={() => openRegisterFaceHandle()}>
                Register Face
              </Button>
            </Toolbar>
          </AppBar>
          <Products personId={currPerson ? currPerson.uuid : ''} trainSuccess={trainSuccess} />
        </Dialog>

        {/* warning */}
        <Dialog open={warning} onClose={() => setWarning(false)}>
          <DialogTitle>{warningText}</DialogTitle>
        </Dialog>

        <Dialog open={registerFaceErr} onClose={() => setRegisterFaceErr(false)}>
          <DialogTitle>Face registration failed because no faces were detected.</DialogTitle>
        </Dialog>
      </Container>
    </Page>
  );
};

function mapStateToProps(state) {
  return {
    persons: state.persons
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onRegisterFace: (payload) =>
      dispatch({
        type: actionsType.REGISTER_FACE,
        payload
      }),
    setPersonsStore: (payload) =>
      dispatch({
        type: actionsType.SET_PERSONS,
        payload
      })
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Users);
