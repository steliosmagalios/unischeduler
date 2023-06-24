type CellActionProps = {
  itemId: string;
};

export default function CellActions(props: CellActionProps) {
  function handleView() {
    // TODO
    alert("view " + props.itemId);
  }

  function handleEdit() {
    // TODO
    alert("edit " + props.itemId);
  }

  function handleDelete() {
    // TODO
    alert("delete " + props.itemId);
  }

  return (
    <div className="flex justify-center gap-2">
      <button onClick={() => handleView()}>
        <span className="text-sm text-blue-400">View</span>
      </button>
      <button onClick={() => handleEdit()}>
        <span className="text-sm text-blue-400">Edit</span>
      </button>
      <button onClick={() => handleDelete()}>
        <span className="text-sm text-blue-400">Delete</span>
      </button>
    </div>
  );
}
