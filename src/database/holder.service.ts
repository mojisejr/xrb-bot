import { holderCol, verCol } from ".";
import { Holder, CreateHolderDTO } from "../interfaces/holder.interface";
import { Verified, VerifyData } from "../interfaces/verify.interface";

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
  const verifyDataSnapshotOf = await verCol
    .where("discordId", "==", verifyData.discordId)
    .get();

  if (verifyDataSnapshotOf.docs.length <= 0) {
    const newVerifyData: Verified = {
      walletAddress: verifyData.walletAddress,
      discordId: verifyData.discordId,
      discordGuildId: verifyData.discordGuildId,
      balance: verifyData.totalBalance,
      verified: true,
    };
    await verCol.add(newVerifyData);
    await holderCol
      .doc(holder.discordId)
      .update({ verifyData: [newVerifyData] } as Partial<Holder>);
  } else {
    const verified = verifyDataSnapshotOf.docs.map((v) => {
      return { id: v.id, data: v.data() as Verified };
    });

    const updatedData = await Promise.all(
      verified.map(async (v) => {
        const { id, data } = v;
        if (data.discordGuildId == verifyData.discordGuildId) {
          const updatedData = {
            ...v.data,
            balance: verifyData.totalBalance,
            verified: true,
          } as Verified;
          //update verification data
          await verCol.doc(id).update({ ...updatedData });
          return updatedData;
        } else {
          return v;
        }
      })
    );

    const updatedHolder = { ...holder, verified: updatedData } as Holder;
    //update holder data
    await holderCol.doc(verifyData.discordId).update({ ...updatedHolder });

    return updatedHolder;
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

export {
  createOrReturnExsiting,
  createOrUpdateVerifyHolderData,
  getHolderByWalletAddress,
};
