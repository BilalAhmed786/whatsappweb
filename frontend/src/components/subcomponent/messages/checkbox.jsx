
const checkbox = ({msg,checkbox,forwardmsgid,setForwardmsgid,deltecheckbox}) => {
  

 const toggleMessageSelection = (msgId) => {
    setForwardmsgid((prev) =>
      prev.includes(msgId)
        ? prev.filter((id) => id !== msgId) // Remove if already selected
        : [...prev, msgId] // Add if not already selected
    );
  };



  return (
    <div className="flex items-center">

      {checkbox &&
        <input
          type="checkbox"
          checked={forwardmsgid.includes(msg._id)} // Show checked state for selected IDs
          onChange={() => {
            toggleMessageSelection(msg?._id)

          }}
        />
      }
      {deltecheckbox &&
        <input
          type="checkbox"
          checked={forwardmsgid.includes(msg._id)} // Show checked state for selected IDs
          onChange={() => {
            toggleMessageSelection(msg._id)
            setDeletemsgs(true)

          }}
        />
      }

    </div>
  )
}

export default checkbox