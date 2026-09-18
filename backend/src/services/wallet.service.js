import { Wallet } from '../models/Wallet.js';
import { WalletTransaction } from '../models/WalletTransaction.js';
import { DomainError } from '../utils/errors.js';

function addNonNegativeDecimals(left, right) {
  const [leftInteger, leftFraction = ''] = String(left).split('.');
  const [rightInteger, rightFraction = ''] = String(right).split('.');
  const scale = Math.max(leftFraction.length, rightFraction.length);
  const leftDigits = BigInt(`${leftInteger}${leftFraction.padEnd(scale, '0')}` || '0');
  const rightDigits = BigInt(`${rightInteger}${rightFraction.padEnd(scale, '0')}` || '0');
  const total = (leftDigits + rightDigits).toString().padStart(scale + 1, '0');

  if (scale === 0) {
    return total;
  }

  const integerPart = total.slice(0, -scale) || '0';
  const fractionPart = total.slice(-scale).replace(/0+$/, '');
  return fractionPart ? `${integerPart}.${fractionPart}` : integerPart;
}

export async function creditVE({ userId, amount, claimId, session }) {
  if (amount === undefined || amount === null || Number(amount) < 0) {
    throw new DomainError('INVALID_WALLET_AMOUNT', 'The wallet credit amount is invalid', 422);
  }

  const wallet = await Wallet.findOneAndUpdate(
    { userId },
    { $setOnInsert: { userId, currency: 'VE', veBalance: '0' } },
    { new: true, upsert: true, session, setDefaultsOnInsert: true }
  );
  const balanceBefore = wallet.veBalance.toString();
  const balanceAfter = addNonNegativeDecimals(balanceBefore, amount.toString());

  const updatedWallet = await Wallet.findOneAndUpdate(
    { _id: wallet._id, veBalance: wallet.veBalance },
    { $set: { veBalance: balanceAfter } },
    { new: true, session }
  );

  if (!updatedWallet) {
    throw new DomainError('WALLET_CONFLICT', 'The wallet changed during this claim; please retry', 409);
  }

  const [transaction] = await WalletTransaction.create(
    [
      {
        userId,
        walletId: wallet._id,
        type: 'CREDIT',
        currency: 'VE',
        amount,
        balanceBefore,
        balanceAfter,
        source: 'DAILY_STREAK',
        sourceReference: String(claimId),
        streakClaimId: claimId,
        status: 'POSTED',
      },
    ],
    { session }
  );

  return { wallet: updatedWallet, transaction };
}

export async function getWalletBalance(userId, session) {
  const query = Wallet.findOne({ userId }).lean();
  const wallet = session ? await query.session(session) : await query;
  return wallet?.veBalance?.toString() ?? '0';
}
