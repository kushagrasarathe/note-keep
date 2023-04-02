import UpdateNote from "./UpdateNote";

export default function NoteCard({ data, deleteNote }) {
  return (
    <div className="w-full  p-1 cursor-pointer">
      <div className="bg-white shadow-lg  rounded-md">
        <div className="bg-grey-lightest border-b p-4 flex items-center">
          <div className="flex-1 text-grey text-lg font-bold">{data.title}</div>
          <div className="mr-2 text-sm text-grey-darkest">Pin</div>
        </div>

        <div className="p-4 leading-normal">
          <p className=" font-semibold">{data.tagline}</p>
          <p>{data.body}</p>
        </div>

        <div className="bg-grey-lightest border-t p-4 text-sm text-right">
          <button onClick={deleteNote} className=" btn btn-ghost mx-2">
            Delete
          </button>
          <UpdateNote documentId={data.id} />
        </div>
      </div>
    </div>
  );
}
