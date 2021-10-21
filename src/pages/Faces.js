
// material
import { Container } from '@mui/material';
// components
import Page from '../components/Page';
import {
  FacesList
} from '../components/_dashboard/products';
// ----------------------------------------------------------------------

export default function Faces(props) {

  const { faces, personId, trainSuccess} = props;

  return (
    <Page title="Faces | S-Faces">
      <Container sx={{padding: '20px !important', maxWidth: "unset !important"}}>
        <FacesList faces={faces ? faces : []} mt={5} personId={personId} trainSuccess={trainSuccess}/>
      </Container>
    </Page>
  );
}
