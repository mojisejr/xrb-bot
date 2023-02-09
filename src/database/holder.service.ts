import { holderCol } from ".";
import { Holder, CreateHolderDTO } from "../interfaces/holder.interface";
import { VerifyData } from "../interfaces/verify.interface";

async function createOrReturnExsiting(
  holder: CreateHolderDTO
): Promise<Holder> {
  const snapshot = await holderCol.doc(holder.discordId).get();
  if (!snapshot.exists) {
    await holderCol.doc(holder.discordId).set(holder);
    return holder as Holder;
  } else {
    return snapshot.data() as Holder;
  }
}

async function createOrUpdateVerifyHolderData(
  holder: Holder,
  verifyData: VerifyData
) {
  const verified = holder.verified || [];
  const filtered = verified.filter(
    (v) => v.discordGuildId != verifyData.discordGuildId
  );
  const updateHolder: Holder = {
    discordId: holder.discordId,
    verified: [
      ...filtered,
      {
        walletAddress: verifyData.walletAddress,
        verified: true,
        discordGuildId: verifyData.discordGuildId,
        discordId: verifyData.discordId,
        balance: verifyData.totalBalance,
        nfts: verifyData.nftData,
      },
    ],
  };

  const result = await holderCol
    .doc(updateHolder.discordId)
    .update({ ...updateHolder });
  if (result) {
    return true;
  } else {
    return false;
  }
}

async function getHolderByWalletAddress(
  walletAddress: string,
  discordGuildId: string
) {
  const snapshot = await holderCol
    .where("walletAddress", "==", walletAddress)
    .where("discordGuildId", "==", discordGuildId)
    .get();
  const holder = snapshot.docs.map((holder) => holder.data());
  return holder[0] as Holder;
}

async function isVerifiedHolder(
  discordId: string,
  walletAddress: string,
  discordGuildId: string
) {
  const snapshot = await holderCol.doc(discordId).get();
  const holder = snapshot.data() as Holder;

  if (holder == undefined) return true;

  const verified = holder.verified || [];

  if (verified.length <= 0) {
    return true;
  } else {
    const thisProject = verified.find(
      (v) =>
        v.discordGuildId == discordGuildId ||
        v.verified == true ||
        v.walletAddress == walletAddress
    );

    return thisProject == undefined ? true : false;
  }
}

async function isUsedWallet(walletAddress: string) {
  console.log(walletAddress);
  const snapshots = await holderCol.get();
  const holder = snapshots.docs.map((s) => s.data());
  const verified = holder.map((h) => h.verified);
  const found = verified.map((v) => {
    const result = v.find((w: any) => w.walletAddress == walletAddress);
    return result;
  });
  if (found.length <= 0 || found[0] == undefined) {
    return false;
  } else {
    return true;
  }
}

export {
  createOrReturnExsiting,
  createOrUpdateVerifyHolderData,
  getHolderByWalletAddress,
  isVerifiedHolder,
  isUsedWallet,
};
