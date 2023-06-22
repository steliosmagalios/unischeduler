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
    <div className="flex gap-2">
      <button onClick={() => handleView()}>
        <span className="material-symbols-outlined">open_in_full</span>
      </button>
      <button onClick={() => handleEdit()}>
        <span className="material-symbols-outlined">edit</span>
      </button>
      <button onClick={() => handleDelete()}>
        <span className="material-symbols-outlined">delete</span>
      </button>
    </div>
  );
}
