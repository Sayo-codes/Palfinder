import { db } from './db'

/**
 * Confirms a payment and unlocks the associated profile content.
 * Should be called once the blockchain monitor confirms the transaction.
 * 
 * @param paymentId The unique payment reference (e.g. PAL-XXXX-YYYY)
 * @param txHash The blockchain transaction hash confirming the payment
 * @param amountReceived The actual amount received on chain
 * @returns Object containing the unlock links (megaLink, unlockLink)
 */
export async function confirmAndUnlockPayment(
  paymentId: string, 
  txHash: string, 
  amountReceived: number
) {
  try {
    const payment = await db.directPayment.findUnique({
      where: { paymentRef: paymentId },
    })

    if (!payment) {
      throw new Error(`Payment not found: ${paymentId}`)
    }

    // Wrap the updates in a transaction to ensure atomicity
    const result = await db.$transaction(async (tx) => {
      // 1. Mark the DirectPayment as confirmed
      const updatedPayment = await tx.directPayment.update({
        where: { id: payment.id },
        data: {
          status: 'confirmed',
          txHash,
          amountReceived,
          confirmedAt: new Date(),
        },
      })

      // 2. Grant access by creating a ProfileAccess record
      // Upsert to handle the case where it might already exist
      await tx.profileAccess.upsert({
        where: { paymentRef: payment.paymentRef },
        create: {
          profileId: payment.profileId,
          profileName: payment.profileName,
          paymentRef: payment.paymentRef,
          txHash,
          grantedAt: new Date(),
        },
        update: {}, // Don't modify if it already exists
      })

      // 3. Fetch the profile to get the unlock links
      const profile = await tx.palfinderProfile.findUnique({
        where: { id: payment.profileId },
        select: {
          megaLink: true,
          unlockLink: true,
        }
      })

      return {
        payment: updatedPayment,
        unlockData: profile
      }
    })

    return { 
      success: true, 
      megaLink: result.unlockData?.megaLink || '', 
      unlockLink: result.unlockData?.unlockLink || '' 
    }

  } catch (error: any) {
    console.error('[confirmAndUnlockPayment] Error:', error)
    return { success: false, error: error.message }
  }
}
