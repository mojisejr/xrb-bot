import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import credentials from "../kub-holder.json";

const params = {
  type: credentials.type,
  projectId: credentials.project_id,
  privateKeyId: credentials.private_key_id,
  privateKey: credentials.private_key,
  clientEmail: credentials.client_email,
  clientId: credentials.client_id,
  authUri: credentials.auth_uri,
  tokenUri: credentials.token_uri,
  authProviderX509CertUrl: credentials.auth_provider_x509_cert_url,
  clientC509CertUrl: credentials.client_x509_cert_url,
};

const app = admin.initializeApp({
  credential: admin.credential.cert(params),
});

const db = getFirestore(app);

const COL_NAME = {
  Holders: "Holders",
  Projects: "Projects",
  NFT: "NFTs",
};

const holderCol = db.collection(COL_NAME.Holders);
const projectCol = db.collection(COL_NAME.Projects);
const nftCol = db.collection(COL_NAME.NFT);

export { holderCol, projectCol, nftCol, COL_NAME };
