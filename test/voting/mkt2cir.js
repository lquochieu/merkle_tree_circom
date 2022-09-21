const wasm_tester = require("circom_tester").wasm;
const hash = require("circomlibjs").poseidon;
const { merjleize, getMerkleProof, merkleize } = require("./merkletree2.js");

const main = async () => {
  const F = await (await require("circomlibjs").buildBabyjub()).F;
  let circuit;
  circuit = await wasm_tester(
    "./circuit.circom");

  const m = merkleize(F, hash, [11, 22, 33, 44, 55, 66, 77, 88], 3);
  console.log(m);
  const root = m[0];
  const mp = getMerkleProof(m, 2, 3);
  const input = {
    key: F.e(2),
    value: F.e(33),
    root: root,
    siblings: mp,
  };

  console.log(input);
  await circuit.calculateWitness(input, true);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
