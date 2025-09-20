export const getlastemoji = (emoji,data) => {

  return emoji?.flatMap((result) =>
      result.reactions
        .filter((reaction) => !reaction.blockedbyuser.includes(data._id)) // Filter out reactions where the user is blocked
        .map((reaction) => ({
          ...reaction,
          messageId: result._id, 
        }))
    )
      // Flatten and map the reactions in media items
      .concat(
        emoji.flatMap((result) =>
          result.media?.flatMap((mediaItem) =>
            mediaItem.reactions
              .filter((reaction) => !reaction.blockedbyuser.includes(data._id)) // Filter out reactions where the user is blocked
              .map((reaction) => ({
                ...reaction,
                messageId: result._id, 
              }))
          )
        )
      )
      // Sort the reactions by the updatedAt field in descending order
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0]; // Return the latest reaction
  };