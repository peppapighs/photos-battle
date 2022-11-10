const K_FACTOR = 40

export default function getUpdatedRating(
  winnerRating: number,
  loserRating: number
) {
  const winnerExpectedScore =
    1 / (1 + 10 ** ((loserRating - winnerRating) / 400))
  const loserExpectedScore =
    1 / (1 + 10 ** ((winnerRating - loserRating) / 400))
  const winnerUpdatedRating = Math.round(
    winnerRating + K_FACTOR * (1 - winnerExpectedScore)
  )
  const loserUpdatedRating = Math.round(
    loserRating + K_FACTOR * (0 - loserExpectedScore)
  )
  return { winnerUpdatedRating, loserUpdatedRating }
}
