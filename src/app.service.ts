import { HttpException, Injectable } from '@nestjs/common';
import { BigNumber, ethers } from 'ethers';
import * as TokenJson from './assets/MyToken.json';
import * as TokenizedBallot from './assets/TokenizedBallot.json';
import * as Ballot from './assets/Ballot.json';

const CONTRACT_ADDRESS = '0x39A1593d4D279407445f7df7B8F91d6374990B6A';

export class CandidateSelect {
  //account: ethers.Wallet;
  id1: number;
  id2: number;
  id3: number;
  id4: number;
  id5: number;
}

// export class PaymentOrder {
//   id: string;
//   secret: string;
//   amount: number;
// }

@Injectable()
export class AppService {
  // database: PaymentOrder[];
  contract: ethers.Contract;
  signedContract: ethers.Contract;
  signedContractTB: ethers.Contract;
  provider: ethers.providers.Provider;
  seed: string;
  wallet: ethers.Wallet;
  wallet1: ethers.Wallet;
  wallet2: ethers.Wallet;
  wallet3: ethers.Wallet;
  signer: ethers.Wallet;
  hdNode: ethers.utils.HDNode;
  acc1: ethers.Wallet;
  acc2: ethers.Wallet;
  acc3: ethers.Wallet;
  data: [
    { winner: number; score: number },
    { winner: number; score: number },
    { winner: number; score: number },
  ];

  constructor() {
    this.provider = ethers.getDefaultProvider('goerli');
    this.contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      Ballot.abi,
      this.provider,
    );

    this.seed = process.env.MNEMONIC!;
    this.hdNode = ethers.utils.HDNode.fromMnemonic(this.seed);
    this.wallet = new ethers.Wallet(this.hdNode.derivePath(`m/44'/60'/0'/0/0`));
    this.signer = this.wallet.connect(this.provider);

    this.wallet1 = new ethers.Wallet(
      this.hdNode.derivePath(`m/44'/60'/0'/0/1`),
    );
    this.wallet2 = new ethers.Wallet(
      this.hdNode.derivePath(`m/44'/60'/0'/0/2`),
    );
    this.wallet3 = new ethers.Wallet(
      this.hdNode.derivePath(`m/44'/60'/0'/0/3`),
    );
    this.acc1 = this.wallet1.connect(this.provider);
    this.acc2 = this.wallet2.connect(this.provider);
    this.acc3 = this.wallet3.connect(this.provider);

    this.signedContract = this.contract.connect(this.signer);

    // this.database = [];
    // this.data = [];
  }

  async getVoterInfo(address: string) {
    const voteInfo = await this.contract.voters(address);
    //const voteWeight = ethers.utils.formatEther(voteWeightBN);
    return { voteInfo };
  }

  giveRightToVote(address: string) {
    const tx = this.signedContract.giveRightToVote(address);
    return tx;
  }

  castVote(body: CandidateSelect) {
    const tx = this.contract
      .connect(this.acc1)
      .vote(body.id1, body.id2, body.id3, body.id4, body.id5);
    return tx;
  }

  async getWinnerListScore() {
    const winnerList = await this.contract.winningTopList();
    const voteCount1 = await this.contract.proposals(winnerList[0]);
    const voteCount2 = await this.contract.proposals(winnerList[1]);
    const voteCount3 = await this.contract.proposals(winnerList[2]);
    this.data = [
      {
        winner: winnerList[0],
        score: voteCount1.voteCount,
      },
      {
        winner: winnerList[1],
        score: voteCount2.voteCount,
      },
      {
        winner: winnerList[2],
        score: voteCount3.voteCount,
      },
    ];
    return this.data;
  }
}
