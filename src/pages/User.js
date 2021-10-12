import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import { connect } from 'react-redux';

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { PhotoCamera, Videocam } from '@mui/icons-material';

// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  IconButton
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../components/_dashboard/user';
//
import USERLIST from '../_mocks_/user';
import * as actions from '../reduxConfig/store/index';
import { set } from 'date-fns';
import ApiFetching from 'src/utils/apiFetching';
import { get } from 'lodash-es';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  // { id: 'company', label: 'Company', alignRight: false },
  // { id: 'role', label: 'Role', alignRight: false },
  // { id: 'isVerified', label: 'Verified', alignRight: false },
  // { id: 'status', label: 'Status', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

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

const User = (props) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openRegisterFace, setOpenRegisterFace] = useState(false);
  const [name, setName] = useState('');
  const [currPerson, setCurrPerson] = useState(null);
  const [imageRegister, setImageRegister] = useState(null);
  const [persons, setPersons] = useState([]);
  const [totalPersons, setTotalPersons] = useState(0);
  const { onFetchPersons, onCreatePerson, onDeletePerson, onRegisterFace } = props;
  const { getPersons, createPersons, deletePersons, registerFace } = ApiFetching();

  const deletePersonHandle = () => {
    console.log(currPerson);
    if (currPerson) {
      deletePersons(currPerson.uuid, () => {
        setOpenDelete(false);
        getPersons((data) => {
          setPersons(data.list);
          setTotalPersons(data.paging.total);
        });
      });
    }
  };

  const openDeteleForm = (row) => {
    console.log(row);
    setCurrPerson(row);
    setOpenDelete(true);
  };

  const createPersonHandle = () => {
    createPersons({ name: name }, () => {
      getPersons((data) => {
        setPersons(data.list);
        setCurrPerson(null);
        setOpenCreate(false);
        setName('');
      });
    });
  };

  useEffect(() => {
    // onFetchPersons('token');
    getPersons((data) => {
      setPersons(data.list);
      setTotalPersons(data.paging.total);
    });
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const registerFaceHandle = (face) => {
    if (imageRegister && currPerson) {
      let registerData = new FormData();
      registerData.append('image', imageRegister.currentFile);
      registerFace(registerData, currPerson.uuid, () => {
        console.log('register face success');
      });
    }

    setOpenRegisterFace(false);
    setCurrPerson(null);
    setImageRegister(null);
  };

  const openRegisterFaceHandle = (row) => {
    setCurrPerson(row);
    setOpenRegisterFace(true);
  };
  const selectFile = (event) => {
    setImageRegister({
      currentFile: event.target.files[0],
      previewImage: URL.createObjectURL(event.target.files[0]),
      progress: 0,
      message: ''
    });
  };
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="User | Minimal-UI">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            User
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="#"
            onClick={() => setOpenCreate(true)}
            startIcon={<Icon icon={plusFill} />}
          >
            New User
          </Button>
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />
          

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {persons
                    ? persons.map((row) => {
                        const { uuid, name } = row;
                        const isItemSelected = selected.indexOf(name) !== -1;
                        const avatarUrl =
                          'https://minimal-kit-react.vercel.app/static/mock-images/avatars/avatar_12.jpg';
                        return (
                          <TableRow
                            hover
                            key={uuid}
                            tabIndex={-1}
                            role="checkbox"
                            selected={isItemSelected}
                            aria-checked={isItemSelected}
                          >
                            {/* <TableCell padding="checkbox">
                              <Checkbox
                                checked={isItemSelected}
                                onChange={(event) => handleClick(event, name)}
                              />
                            </TableCell> */}
                            <TableCell component="th" scope="row" padding="normal">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar alt={name} src={avatarUrl} />
                                <Typography variant="subtitle2" noWrap>
                                  {name}
                                </Typography>
                              </Stack>
                            </TableCell>

                            <TableCell align="right">
                              <UserMoreMenu
                                openDetele={() => openDeteleForm(row)}
                                openRegisterFace={() => openRegisterFaceHandle(row)}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })
                    : null}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
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
              onChange={(e) => setName(e.target.value)}
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
              Cancle
            </Button>
          </DialogActions>
        </Dialog>

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
              Cancle
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openRegisterFace}
          onClose={() => {
            setOpenRegisterFace(false);
            setCurrPerson(null);
            setImageRegister(null);
          }}
        >
          <DialogTitle>Add a Image: {currPerson && currPerson.name}</DialogTitle>
          <DialogContent>
            <input accept="image/*" id="icon-button-photo" type="file" onChange={selectFile} />
            <label htmlFor="icon-button-photo">
              <IconButton color="primary" component="span">
                <PhotoCamera />
              </IconButton>
            </label>
            {imageRegister && <img src={imageRegister.previewImage} alt="" />}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => registerFaceHandle()}>Save</Button>
            <Button
              onClick={() => {
                setOpenRegisterFace(false);
                setCurrPerson(null);
                setImageRegister(null);
              }}
            >
              Cancle
            </Button>
          </DialogActions>
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
    onFetchPersons: (token) => dispatch(actions.fetchPersons(token)),
    onCreatePerson: (token, payload) => dispatch(actions.createPerson(token, payload)),
    onDeletePerson: (token, payload) => dispatch(actions.deletePerson(token, payload)),
    onRegisterFace: (token, payload) => dispatch(actions.registerFace(token, payload))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(User);
