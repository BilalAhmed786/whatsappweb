import repliedMediadisplay from "../../../utils/repliedmediadisplay";
const filtermediafile = ({msg}) => {

 const filteredMedia = msg.replyTo?.messageId?.media?.some((object) => object._id === msg.replyTo.objectId)
                    ? msg.replyTo.messageId.media.filter((object) => object._id === msg.replyTo.objectId)
                    : msg.replyTo?.messageId?.media;

                  if (filteredMedia && filteredMedia.length > 0) {

                    return repliedMediadisplay(filteredMedia);

                  }

                  return null; // Return null if there's nothing to render

}

export default filtermediafile