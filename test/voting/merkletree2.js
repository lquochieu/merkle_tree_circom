function merkleize(F, hash, arr, nlevels) {
  const extendedLen = 1 << nlevels;
  const nArr = [];
  for (let i = 0; i < extendedLen; i++) {
    //I go throughout all the levels and if there is an element I compute its hash
    // and I push it into the array of hashes and if there is not I just put a zero on it.
    if (i < arr.length) {
      nArr.push(hash([F.e(arr[i])]));
    } else {
      nArr.push(F.zero);
    }
  }
  return __merkleize(hash, nArr);
}

function __merkleize(hash, arr) {
  if (arr.length == 1) return arr;

  const nArr = [];
  for (i = 0; i < arr.length / 2; i++) {
    nArr.push(hash([arr[2 + i], arr[2 + i + 1]]));
  }

  const n = __merkleize(hash, nArr);

  return [...n, ...arr];
}

function getMerkleProof(n, key, nlevels) {
  // we pass the generated Merkletree and we generate the proof
  if (nlevels == 0) return [];
  const extendedLen = 1 << nlevels;

  topSiblings = getMerkleProof(n, key >> 1, nlevels - 1);
  curSibling = n[extendedLen - 1 + (key ^ 1)];
  return [...topSiblings, curSibling];
}

function isMerkleProofValid(F, hash, key, value, root, np) {
  let h = hash([value]);
  for (let i = np.length - 1; i >= 0; i--) {
    if ((1 << (np.length - 1 - i)) & key) {
      h = hash([np[i], h]);
    } else {
      h = hash([h, np[i]]);
    }
  }
  return F.eq(root, h);
}

module.exports.isMerkleProofValid = isMerkleProofValid;
module.exports.getMerkleProof = getMerkleProof;
module.exports.merkleize = merkleize;
