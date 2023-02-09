function isValidAddress(address: string) {
  let isAddress = address.split("0x");
  if (
    isAddress[0] == "" &&
    isAddress[1].length == 40 &&
    isAddress.length == 2
  ) {
    return address;
  } else {
    console.log("[isValidAddress]: Invalid address");
    return null;
  }
}

export { isValidAddress };
